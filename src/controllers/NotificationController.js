const db = require("../database");
const Notification = db.notification;
const { handleExceptions } = require('../helpers');
const { fn, col, literal } = db.Sequelize;

module.exports = {

  get: {
    handler: async (req, res) => {
      try {
        const user_id = req.user_id;

        const notifications = await Notification.findAll({
          where: { user_id: user_id },
          attributes: ['id', 'user_id', 'diagram_id', 'diagram_name', 'type', 'message', 'read', 'created_at'],
          order: [['created_at', 'DESC']]
        });

        if (!notifications) { return res.status(404).json({errors: [{msg: "Usuário não encontrado em notification"}]}); }

        return res.json(notifications);

      } catch (error) {
        return handleExceptions(error, res);
      }    
    }
  },
  getCount: {
    handler: async (req, res) => {
      try {
        const { user_id } = req.params;
  
        const notificationCount = await Notification.count({
          where: { user_id: user_id, read: 0 }
        });
  
        return res.json({ count: notificationCount });
  
      } catch (error) {
        return handleExceptions(error, res);
      }
    }
  },
  getDiagrams: {
    handler: async (req, res) => {
      try {
        const { user_id } = req.params;

        const diagramsWithUnreadCount = await Notification.findAll({
          attributes: [
            'diagram_id',
            [fn('COUNT', fn('IF', col('read'), null, col('id'))), 'unread_count'],
            [fn('MAX', col('created_at')), 'most_recent'],
          ],
          where: {
            user_id: user_id,
          },
          group: ['diagram_id'],
          order: [
            [fn('COUNT', fn('IF', col('read'), null, col('id'))), 'DESC'],
            [fn('MAX', col('created_at')), 'DESC'],
          ],
          raw: true,
        });

        const diagramsWithNames = await Promise.all(
          diagramsWithUnreadCount.map(async (diagram) => {
            const diagramInfo = await Notification.findOne({
              where: { diagram_id: diagram.diagram_id },
              attributes: ['diagram_name'],
              order: [['created_at', 'DESC']],
              raw: true,
            });

            return {
              ...diagram,
              diagram_name: diagramInfo ? diagramInfo.diagram_name : null,
            };
          })
        );

        return res.json(diagramsWithNames);
      } catch (error) {
        return handleExceptions(error, res);
      }
    },
  },
  getNotificationDiagram: {
    handler: async (req, res) => {
      try {
        const {user_id, diagram_id} = req.params;
  
        const notifications = await Notification.findAll({
          where: { 
            user_id: user_id,
            diagram_id: diagram_id
          },
          attributes: ['id', 'user_id', 'diagram_id', 'diagram_name', 'type', 'message', 'read', 'created_at'],
          order: [['created_at', 'DESC']]
        });
  
        if (notifications.length === 0) {
          return res.status(404).json({ errors: [{ msg: "Nenhuma notificação encontrada" }] });
        }
  
        return res.json(notifications);
  
      } catch (error) {
        return handleExceptions(error, res);
      }    
    }
  },
  create: {
    handler: async (req, res) => {
      try {
        const { user_id, diagram_id, diagram_name, type, message } = req.body;

        if (Array.isArray(user_id)) {
          const notifications = [];

          for (const id of user_id) {
            const notification = await Notification.create({
              user_id: id,
              diagram_id,
              diagram_name,
              type,
              message,
              read: 0
            });
            notifications.push(notification);
          }

          return res.status(201).json(notifications);

        } else {
          const notification = await Notification.create({
            user_id,
            diagram_id,
            diagram_name,
            type,
            message,
            read: 0
          });

          return res.status(201).json(notification);
        }
      } catch (error) {
        return handleExceptions(error, res);
      }
    }
  },
  updateRead: {
    handler: async (req, res) => {
      try {
        const { id } = req.params;
        const { read }  = req.body;
  
        const [updateNotification] = await Notification.update(
          { read: read },
          { where: { id: id }}
        );
        
        if (updateNotification > 0) {
          const updatedNotification = await Notification.findOne({ where: { id: id } });
          return res.status(200).json(updatedNotification);
        }

        return res.status(404).json({ error: "Notificação não foi encontrada" });
    
      } catch (error) {
        return handleExceptions(error, res);
      }
    }
  },  
  delete: {
    handler: async (req, res) => {
      try {
        const { id } = req.params;

        await Notification.destroy({ where: {id} });

        return res.status(204).send();

      } catch (error) {
        return handleExceptions(error, res);
      }    
    }
  }
}