const jwt  = require('jsonwebtoken');
const auth = require('../config/auth');
const db = require("../database");
const { handleExceptions } = require('../helpers');
const Favorite = db.favorite;
const Collaboration = db.collaboration;
const Diagram = db.diagram;
const User = db.user;
const { Op } = require("sequelize");

module.exports = {

    getAll: {
        handler: async (req, res) => {

            try {
                const { diagram_id } = req.params;
    
                const collaborators = await Collaboration.scope({ method: ['byDiagram', diagram_id] }).findAll();

                return res.json({collaborators: collaborators});
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },

    create: {
        handler: async (req, res) => {
            
            try {

                const collaborator_id = req.user_id;
                const { token } = req.params;

                let { diagram_id, permission } = jwt.verify(token, auth.secret);
                
                const diagram = await Diagram.findByPk(diagram_id);
                if (!diagram)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                const owned_diagram = await Diagram.scope({ method: ['byUser', collaborator_id] }).findByPk(diagram_id);
                if (owned_diagram)
                    return res.json(owned_diagram);

                const existingCollaboration = await Collaboration.findOne({
                    where: { diagram_id, collaborator_id },
                });

                let collaborator = await Collaboration.findOrCreate({where: { diagram_id, collaborator_id }, defaults: { diagram_id, collaborator_id, permission}});

                return res.json({collaborator: collaborator[0], diagram, existingCollaboration});
 
            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },

    delete: {
        handler: async (req, res) => {
    
            try {
    
                const { id } = req.params;
                const { diagram_id } = req.params;
                const user_id = req.user_id;
                const diagramExists = await Diagram.scope({ method: ['byUser', user_id] }).findByPk(diagram_id);
                if (!diagramExists)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                await Collaboration.destroy({where: { diagram_id: diagram_id, collaborator_id: id }});
                await Favorite.destroy({where: { diagram_id: diagram_id, user_id: id }});
    
                return res.status(204).send();
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },

    deleteAllCollaborators: {
        handler: async (req, res) => {

            try {

                const { diagram_id } = req.params;
                const user_id = req.user_id;
    
                const diagramExists = await Diagram.scope({ method: ['byUser', user_id] }).findByPk(diagram_id);
                if (!diagramExists)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                await Collaboration.scope({ method: ['byDiagram', diagram_id] }).destroy();
                await Favorite.scope({ method: ['byDiagram', diagram_id] }).destroy({ where: {user_id: {[Op.ne]: user_id}}});
    
                return res.status(204).send();
    
            } catch (error) {
                return handleExceptions(error, res);
            }

        }
    },
    getCollaboratorPermission: {
        handler: async (req, res) => {

            try {
                const { diagram_id, user_id } = req.params;
                const diagram = await Diagram.findOne({where: {id: diagram_id}});
                if (diagram.user_id == user_id){
                    return res.json({permission: 2});
                } else{
                    const collaborator = await Collaboration.findOne({where: { collaborator_id: user_id, diagram_id: diagram_id }});
                    
                    return res.json({permission: collaborator.permission});
                }      
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },
    getAllCollaborationWithName: {
        handler: async (req, res) => {

            try {
                const { diagram_id } = req.params;
    
                const collaborators = await Collaboration.scope({ method: ['byDiagram', diagram_id] }).findAll();

                let usersInviteds = [];

                const promises = collaborators.map(async (collaborator) => {
                    const user = await User.findOne({raw: true, where: {id: collaborator.collaborator_id}});
                    usersInviteds.push({id: collaborator.collaborator_id, avatar: user.avatar, email: user.email, permission: collaborator.permission});
                });
                
                await Promise.all(promises);

                return res.json({usersInviteds: usersInviteds});
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },
    updatePermission: {
        handler: async (req, res) => {
            
            try {
                const { diagram_id, user_id } = req.params;
                const permission = req.body.updation;
                                
                await Collaboration.update({ permission }, { where: { collaborator_id : user_id, diagram_id: diagram_id } });
                
                return res.status(200).send();
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        } 
    }
}