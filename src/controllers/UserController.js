const { body, validationResult } = require('express-validator');
const db = require("../database");
const User = db.user;
const bcrypt = require("bcryptjs");
const { handleExceptions } = require('../helpers');
const dns = require('dns');

module.exports = {

    get: {
        handler: async (req, res) => {

            try {
    
                const id = req.user_id;
    
                const user = await User.findOne({
                    where: {id},
                    attributes: ['id', 'name', 'email', 'role', 'birthday', 'gender', 'avatar', 'company']
                });

                if (!user) { return res.status(404).json({errors: [{msg: "Usuário não encontrado"}]}); }
    
                return res.json(user);
    
            } catch (error) {
                return handleExceptions(error, res);
            }
            
        }
    },

    getIDForEmail: {
        handler: async (req, res) => {
            try {
              const emails = req.query.emails;
          
              if (!emails) {
                return res.status(400).json({ errors: [{ msg: "Emails são obrigatórios" }] });
              }

              const emailArray = Array.isArray(emails) ? emails : emails.split(',');
          
              if (!Array.isArray(emailArray) || emailArray.length === 0) {
                return res.status(400).json({ errors: [{ msg: "Emails tem que estar em um array e não podem estar vazios" }] });
              }
          
              const users = await User.findAll({
                where: {
                  email: emailArray
                },
                attributes: ['id']
              });
          
              if (!users || users.length === 0) {
                return res.status(404).json({ errors: [{ msg: "Usuário não encontrado" }] });
              }
          
              const ids = users.map(user => user.id);
          
              return res.json(ids);
          
            } catch (error) {
              return handleExceptions(error, res);
            }
          }
      },

    update: {
        validations: [
            body('name').isLength({ min: 3, max: 100 }).withMessage("O nome deve ter entre 3 e 100 caracteres").not().isEmpty().withMessage("Preencha o campo nome").isAlpha("pt-BR", {ignore:" "}).withMessage("O nome não deve conter caracteres especiais"),
            body('email').isLength({ min: 3, max: 100 }).withMessage("O email deve ter entre 3 e 100 caracteres").isEmail().withMessage("O campo deve ser um email válido").not().isEmpty().withMessage("Preencha o campo email"),
            body('birthday').isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage("A data de nascimento deve ser uma data válida"),
            body('gender').isInt({ min: 1, max: 3 }).withMessage("O campo gênero é inválido"),
            body('company').isLength({ max: 100 }).withMessage("A empresa deve ter no máximo 100 caracteres"),
            body('role').isInt({ min: 1, max: 3 }).withMessage("O campo perfil é inválido"),
            body('avatar').isInt({ min: 1, max: 4}).withMessage("O campo avatar é inválido"),
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const id = req.user_id;

                const { name, email, birthday, gender, company, role, avatar } = req.body;

                const user = await User.findOne({
                    where: {id},
                    attributes: ['email']
                });

                if(email != user.email){
                    const email_is_used = await User.findOne({
                        where: {email}
                    });
                    if(email_is_used){
                        return res.status(406).json({errors: [{msg: "O email já está sendo utilizado!"}]});
                    }
                }

                const domain = email.split('@')[1];
                
                const isValidDomain = await new Promise((resolve, reject) => {
                    dns.resolveMx(domain, (err, addresses) => {
                        if (err || !addresses || addresses.length === 0) {
                            return resolve(false);
                        }
                        resolve(true);
                    });
                });

                if (!isValidDomain) {
                    return res.status(400).json({ errors: [{ msg: `O domínio '${domain}' não é válido` }] });
                }

                const updated_user = await User.update({ name, email, birthday, gender, company, role, avatar }, {
                    where: { id }
                });

                return res.status(200).send();

            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },

    changePassword: {
        validations: [
            body('password').isLength({ min: 8 }).withMessage("A senha deve ter no mínimo 8 caracteres").not().isEmpty().withMessage("Preencha o campo senha"),
            body('confirmPassword').isLength({ min: 8 }).withMessage("A senha deve ter no mínimo 8 caracteres").not().isEmpty().withMessage("Preencha o campo senha")
        ], 
        handler: async (req, res) => {
            
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) 
                    throw {name: 'RequestValidationError', errors};

                const id = req.user_id;

                const {password} = req.body;

                // Verifique se a nova senha é diferente da senha atual
                const currentUser = await User.findByPk(id);
                const isPasswordMatch = await bcrypt.compare(password, currentUser.password);

                if (isPasswordMatch) {
                    return res.status(406).json({errors: [{msg: "A nova senha não pode ser idêntica à senha atual. Por favor, escolha uma senha diferente para garantir a segurança da sua conta."}]});
                }

                const user = await User.update({password: bcrypt.hashSync(password, 8)}, {
                    where: { id }
                });

                return res.status(200).send();

            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },

    checkPassord: {
        validations: [
            body('password').isLength({ min: 8 }).withMessage("A senha deve ter no mínimo 8 carcteres").not().isEmpty().withMessage("Preencha o campo senha"),
        ],
        handler: async (req, res) => {

            try {

                const errors = validationResult(req);
                if(!errors.isEmpty())
                    throw {name: "RequestValidationError", errors};

                const {password} = req.body;

                const id = req.user_id;
                const user = await User.findByPk(id);

                const compare = bcrypt.compareSync(password, user.password);

                if(compare){
                    return res.status(204).send();
                }
                return res.status(406).json({errors: [{msg: "A senha digitada não corresponde a senha cadastrada!"}]});

            } catch (error) {
                return handleExceptions(error, res);
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
                return handleExceptions(error, res);
            }
            
        }
    },

    setUserPreferences: {
        handler: async (req, res) => {
            try {
                const id = req.user_id; // O id do usuário, assumindo que você já tenha essa informação.
                const { dados } = req.body; // Captura as informações de "key" e "value" do corpo da requisição.
        
                const user = await User.findByPk(id); // Encontra o usuário no banco de dados.
                if (!user) return res.status(404).send('Usuário não encontrado.');
        
                // Atualiza ou adiciona a chave no dicionário de preferências.

                let preferences = user.preferences ? JSON.parse(user.preferences) : {};

                let preferencess = { ...preferences, ...dados };

                // Atualiza as preferências do usuário no banco de dados
                user.preferences = preferencess;
                await user.save()
    
                return res.status(200).send(dados);
            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },
    
    
    getUserPreferences: {
        handler: async (req, res) => {
            try {
                const id = req.user_id;
                const { key } = req.query; // Chave enviada via query string
    
                // Obtém as preferências do usuário
                const user = await User.findByPk(id);
                if (!user) return res.status(404).send('Usuário não encontrado.');
    
                let preferences = user.preferences ? JSON.parse(user.preferences) : {};
    
                // Se não foi passada uma chave, retorna todas as preferências
                if (!key) {
                    return res.status(200).json(preferences);
                }
    
                // Se a chave foi fornecida, retorna a preferência correspondente
                const value = preferences[key];
    
                if (value === undefined) {
                    return res.status(404).send('Preferência não encontrada.');
                }
    
                return res.status(200).json({ key, value });
            } catch (error) {
                return handleExceptions(error, res);
            }
        },
    },
    
    
    deleteUserModelsOcultosPreferences: {
        handler: async (req, res) => {
            try {
                const id = req.user_id; // O ID do usuário, assumindo que já tenha essa informação.
                console.log(id)
                const user = await User.findByPk(id); // Encontra o usuário no banco de dados.
    
                if (!user) return res.status(404).send('Usuário não encontrado.');
    
                let preferences = user.preferences ? JSON.parse(user.preferences) : {};
                
                // Verifica se cada modelo tem o campo "oculto" antes de alterá-lo
                Object.keys(preferences).forEach(key => {
                    if (preferences[key].hasOwnProperty('oculto')) {
                        preferences[key].oculto = "false";
                    }
                });

                // Salva as preferências atualizadas no banco
                user.preferences = (preferences);
                await user.save();
    
                return res.json({ message: "Preferências atualizadas com sucesso" });
    
            } catch (error) {
                return handleExceptions(error, res);
            }
        },
    },
    
    
    
    


}
