const jwt  = require('jsonwebtoken');
const auth = require('../config/auth');
const db = require("../database");
const { handleExceptions } = require('../helpers');
const Favorite = db.favorite;
const Diagram = db.diagram;

module.exports = {

    create: {
        handler: async (req, res) => {
            
            try {

                const user_id = req.user_id;
                const { diagram_id } = req.params;

                
                const diagram = await Diagram.findByPk(diagram_id);
                if (!diagram)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                let favorite = await Favorite.findOrCreate({where: { diagram_id, user_id }, defaults: { diagram_id, user_id}});

                return res.json({favorite: favorite[0], diagram});
 
            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },

    delete: {
        handler: async (req, res) => {
    
            try {
                
                const user_id = req.user_id;
                const { diagram_id } = req.params;
    
                const diagramExists = await Diagram.findByPk(diagram_id);
                if (!diagramExists)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                await Favorite.scope({ method: ['byDiagram', diagram_id] }).destroy({ where: {user_id} });
    
                return res.status(204).send();
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },
}