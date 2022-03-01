const { body, validationResult } = require('express-validator');
const db = require("../database");
const User = db.user;
const bcrypt = require("bcryptjs");
const _pick = require("lodash/pick");

module.exports = {

    signup: {
        validations: [
            body('name').isLength({ min: 3, max: 100 }).withMessage("O nome deve ter entre 3 e 100 caracteres").not().isEmpty().withMessage("Preencha o campo nome"),
            body('email').isLength({ min: 3, max: 100 }).withMessage("O email deve ter entre 3 e 100 caracteres").isEmail().withMessage("O campo deve ser um email válido").not().isEmpty().withMessage("Preencha o campo email"),
            body('password').isLength({ min: 8 }).withMessage("A senha deve ter no mínimo 8 caracteres").not().isEmpty().withMessage("Preencha o campo senha"),
            body('company').isLength({ max: 100 }).withMessage("A empresa deve ter no máximo 100 caracteres"),
            body('password').isLength({ max: 100 }).withMessage("O cargo deve ter no máximo 100 caracteres"),
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const { name, email, password, company, role } = req.body;

                const user = await User.create({ name, email, password: bcrypt.hashSync(password, 8), company, role });
                return res.json(_pick(user, ["name", "email", "company", "role"]));

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