const jwt  = require('jsonwebtoken');
const auth = require('../config/auth');
const db = require("../database");
const { handleExceptions } = require('../helpers');
const Collaboration = db.collaboration;
const Diagram = db.diagram;

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

                let { diagram_id } = jwt.verify(token, auth.secret);
                
                const diagram = await Diagram.findByPk(diagram_id);
                if (!diagram)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                const owned_diagram = await Diagram.scope({ method: ['byUser', collaborator_id] }).findByPk(diagram_id);
                if (owned_diagram)
                    return res.json(owned_diagram);

                let collaborator = await Collaboration.findOrCreate({where: { diagram_id, collaborator_id }, defaults: { diagram_id, collaborator_id}});

                return res.json({collaborator: collaborator[0], diagram});
 
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

                await Collaboration.scope({ method: ['byDiagram', diagram_id] }).destroy({ where: {id} });
    
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
    
                return res.status(204).send();
    
            } catch (error) {
                return handleExceptions(error, res);
            }

        }
    }

}