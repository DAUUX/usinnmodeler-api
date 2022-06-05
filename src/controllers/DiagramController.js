const { body, validationResult } = require('express-validator');
const db = require("../database");
const Diagram = db.diagram;
const { pagination } = require('../helpers');

module.exports = {

    getAll: {
        handler: async (req, res) => {

            try {

                const {limit, offset, page} = pagination(req);
                const userId = req.userId;
    
                // Busca e conta todos os registros passando os dados para paginação
                const diagrams = await Diagram.scope({ method: ['byUser', userId] }).findAndCountAll({
                    limit,
                    offset,
                    order: [['id', 'DESC']] //Mais recentes primeiro
                });

                return res.json({diagrams: diagrams.rows, pagination: {limit, page: page+1, total: diagrams.count}});
    
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

    get: {
        handler: async (req, res) => {

            try {
    
                const { id } = req.params;
                const userId = req.userId;
    
                const diagram = await Diagram.scope({ method: ['byUser', userId] }).findByPk(id);

                if (!diagram) { return res.status(404).json({errors: [{msg: "Diagrama não encontrado"}]}); }
    
                return res.json(diagram);
    
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
            body('name').isLength({ min: 3, max: 255 }).withMessage("O nome deve ter entre 3 e 255 caracteres").not().isEmpty().withMessage("Preencha o campo nome")
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const user_id = req.userId;

                const { name, diagram_data } = req.body;

                const diagram = await Diagram.create({ name, diagram_data, user_id});

                return res.json(diagram);

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

    update: {
        validations: [
            body('name').isLength({ min: 3, max: 255 }).withMessage("O nome deve ter entre 3 e 255 caracteres").not().isEmpty().withMessage("Preencha o campo nome")
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const userId = req.userId;
                const { id } = req.params;

                const { name, diagram_data } = req.body;

                const diagram = await Diagram.scope({ method: ['byUser', userId] }).update({ name, diagram_data }, {
                    where: { id }
                });

                return res.json(diagram);

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

    delete: {
        handler: async (req, res) => {
    
            try {
    
                const { id } = req.params;
                const userId = req.userId;
    
                await Diagram.scope({ method: ['byUser', userId] }).destroy({ where: {id} });
    
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