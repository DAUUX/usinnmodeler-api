const { body, validationResult } = require('express-validator');
const db = require("../database");
const User = db.user;
const bcrypt = require("bcryptjs");

module.exports = {

    get: {
        handler: async (req, res) => {

            try {
    
                const id = req.user_id;
    
                const user = await User.findOne({
                    where: {id},
                    attributes: ['name', 'email', 'role', 'company']
                });

                if (!user) { return response.status(404).json({errors: [{msg: "Usuário não encontrado"}]}); }
    
                return res.json(user);
    
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
            body('name').isLength({ min: 3, max: 100 }).withMessage("O nome deve ter entre 3 e 100 caracteres").not().isEmpty().withMessage("Preencha o campo nome"),
            body('email').isLength({ min: 3, max: 100 }).withMessage("O email deve ter entre 3 e 100 caracteres").isEmail().withMessage("O campo deve ser um email válido").not().isEmpty().withMessage("Preencha o campo email"),
            body('password').isLength({ min: 8 }).withMessage("A senha deve ter no mínimo 8 caracteres").not().isEmpty().withMessage("Preencha o campo senha"),
            body('company').isLength({ max: 100 }).withMessage("A empresa deve ter no máximo 100 caracteres"),
            body('role').isLength({ max: 100 }).withMessage("O cargo deve ter no máximo 100 caracteres"),
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const id = req.user_id;

                const { name, email, password, company, role } = req.body;

                const user = await User.update({ name, email, password: bcrypt.hashSync(password, 8), company, role }, {
                    where: { id }
                });

                return res.status(200).send();

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
    
                const id = req.user_id;
    
                await User.destroy({ where: {id} });
    
                return res.status(204).send();
    
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
    }

}