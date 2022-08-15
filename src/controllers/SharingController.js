const jwt  = require('jsonwebtoken');
const auth = require('../config/auth');
const db = require("../database");
const ShareToken = db.shareToken;
const Diagram = db.diagram;
const Collaboration = db.collaboration;

module.exports = {

    generateLink: {
        handler: async (req, res) => {

            try {

                const user_id = req.user_id;
                const { diagram_id } = req.params;

                const diagram = await Diagram.scope({ method: ['byUser', user_id] }).findByPk(diagram_id);
                if (!diagram)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                let token = jwt.sign({ diagram_id: diagram.id }, auth.secret);

                await Diagram.update({ is_shared: 1 }, {
                    where: { id: diagram.id }
                });

                let share_token = await ShareToken.findOrCreate({where: { diagram_id: diagram.id }, defaults: { token: token, diagram_id: diagram.id }})

                return res.json({token: share_token[0].token});

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

    removeLink: {
        handler: async (req, res) => {

            try {

                const user_id = req.user_id;
                const { diagram_id } = req.params;

                const diagram = await Diagram.scope({ method: ['byUser', user_id] }).findByPk(diagram_id);
                if (!diagram)
                    return res.status(422).json({errors: [{msg: "Diagrama não existe"}]});

                await Collaboration.scope({ method: ['byDiagram', diagram_id] }).destroy();

                await Diagram.update({ is_shared: 0 }, {
                    where: { id: diagram.id }
                });

                await ShareToken.destroy({where: { diagram_id: diagram.id }})

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
    },

}