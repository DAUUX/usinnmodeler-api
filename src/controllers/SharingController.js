const { body, validationResult } = require('express-validator');
const jwt  = require('jsonwebtoken');
const auth = require('../config/auth');
const db = require("../database");
const { handleExceptions } = require('../helpers');
const Favorite = db.favorite;
const ShareToken = db.shareToken;
const Diagram = db.diagram;
const Collaboration = db.collaboration;
const User = db.user;
const { sendLinkMail } = require('../config/mail');

module.exports = {

    generateLink: {
        handler: async (req, res) => {

            try {

                const user_id = req.user_id;
                const { diagram_id } = req.params;
                const { permission } = req.body;

                const diagram = await Diagram.scope({ method: ['byUser', user_id] }).findByPk(diagram_id);
                if (!diagram)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});
                

                let token = jwt.sign({ diagram_id: diagram.id, permission: permission }, auth.secret, {noTimestamp: true});

                await Diagram.update({ is_shared: 1 }, {
                    where: { id: diagram.id }
                });

                share_token = await ShareToken.findOrCreate({where: { diagram_id: diagram.id, token: token }, defaults: { token: token, diagram_id: diagram.id }});
               
                return res.json({token: share_token[0].token});

            } catch (error) {
                return handleExceptions(error, res);
            }

        }
    },

    inviteLink: {        
        validations: [
           
            body('usersInvited.*.email').isLength({max: 255 }).withMessage("O email deve ter menos de 255 caracteres").isEmail().withMessage("O campo deve ser um email válido").not().isEmpty().withMessage("Preencha o campo email"),
            
        ],
        handler: async (req, res) => {           

            try {    
                
                const errors = validationResult(req);
                if (!errors.isEmpty()) {             
                    throw {name: 'InvalidEmailError', errors};
                }                
                
                const { link, usersInvited, messages } = req.body;
                const user_id = req.user_id;
                const { diagram_id } = req.params;  
                         
                const diagram = await Diagram.scope({ method: ['byUser', user_id] }).findByPk(diagram_id);
                if (!diagram)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                usersInvited.forEach(userInvited => {
                    if(userInvited.permission == 2){
                        (async () => {
                            const ownerOfDiagram = await User.findOne({raw: true, where: {id: user_id}});  
                            await sendLinkMail(userInvited.email, link.reader, ownerOfDiagram.name, messages);
                        })()
                    } else if(userInvited.permission == 1){
                        (async () => {
                            const ownerOfDiagram = await User.findOne({raw: true, where: {id: user_id}});  
                            await sendLinkMail(userInvited.email, link.reader, ownerOfDiagram.name, messages);
                        })()
                    }
                    
                });
                
                return res.status(200).send("O email com o link de convite do diagrama foi enviado");

            } catch (error) {
                return handleExceptions(error, res);
            }

        }
    },

    removeLink: {
        handler: async (req, res) => {

            try {

                const user_id = req.user_id;
                const { diagram_id } = req.params;

                const diagram = await Diagram.scope({ method: ['byUser', user_id] }).findByPk(diagram_id);
                if (!diagram)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                await Collaboration.scope({ method: ['byDiagram', diagram_id] }).destroy();
                await Favorite.scope({ method: ['byDiagram', diagram_id] }).destroy({ where: {user_id: {[Op.ne]: user_id}}});
                await Diagram.update({ is_shared: 0 }, {
                    where: { id: diagram.id }
                });

                await ShareToken.destroy({where: { diagram_id: diagram.id }})

                return res.status(204).send();

            } catch (error) {
                return handleExceptions(error, res);
            }

        }
    },

}