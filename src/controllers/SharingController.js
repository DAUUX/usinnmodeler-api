const { body, validationResult } = require('express-validator');
const db = require("../database");
const Sharing = db.sharing;
const Diagram = db.diagram;
const User = db.user;

module.exports = {

    getAll: {
        handler: async (req, res) => {

            try {
                const { id } = req.params;
    
                const collaborators = await Sharing.scope({ method: ['byDiagram', id] }).findAll();

                return res.json({collaborators: collaborators});
    
            } catch (error) {
                if (error.name == 'RequestValidationError') {
                    return res.status(422).json({errors: error.errors.array()});
                } else if (error.name == 'SequelizeValidationError') {
                    return res.status(422).json({ errors: error.errors.map(e => ({msg: e.message})) });
                } else {
                    return res.status(500).json({ errors: [{msg: "Não foi possível processar esta requisição"}] });
                }
            }
            
        }
    },

    create: {
        validations: [
            body('collaborator_id').isInt().withMessage("O colaborador é inválido").not().isEmpty().withMessage("Selecione o colaborador")
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const userId = req.userId;
                    
                const { collaborator_id } = req.body;
                
                const userExists = await User.findByPk(collaborator_id);
                if (!userExists)
                    return res.status(422).json({errors: [{msg: "Colaborador não existe"}]});
                    
                const { id } = req.params;
                
                const diagramExists = await Diagram.scope({ method: ['byUser', userId] }).findByPk(id);
                if (!diagramExists)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                const collaborator = await Sharing.create({ diagram_id: id, collaborator_id});

                return res.json(collaborator);
 
            } catch (error) {
                if (error.name == 'RequestValidationError') {
                    return res.status(422).json({errors: error.errors.array()});
                } else if (error.name == 'SequelizeValidationError') {
                    return res.status(422).json({ errors: error.errors.map(e => ({msg: e.message})) });
                } else {
                    console.log(error);
                    return res.status(500).json({ errors: [{msg: "Não foi possível processar esta requisição"}] });
                }
            }
        }
    },

    delete: {
        handler: async (req, res) => {
    
            try {
    
                const { id } = req.params;
                const { diagram_id } = req.params;
                const userId = req.userId;
    
                const diagramExists = await Diagram.scope({ method: ['byUser', userId] }).findByPk(diagram_id);
                if (!diagramExists)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                await Sharing.scope({ method: ['byDiagram', diagram_id] }).destroy({ where: {id} });
    
                return res.status(204).send();
    
            } catch (error) {
                if (error.name == 'RequestValidationError') {
                    return res.status(422).json({errors: error.errors.array()});
                } else if (error.name == 'SequelizeValidationError') {
                    return res.status(422).json({ errors: error.errors.map(e => ({msg: e.message})) });
                } else {
                    console.log(error);
                    return res.status(500).json({ errors: [{msg: "Não foi possível processar esta requisição"}] });
                }
            }
            
        }
    }

}