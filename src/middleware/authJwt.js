const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const db = require("../database");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({
            errors: [{msg: "Nenhuma autenticação fornecida!"}]
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                errors: [{msg: "Usuário não autorizado!"}]
            });
        }

        User.findByPk(decoded.id).then(user => {
            if (!user) { 
                res.status(401).json({errors: [{msg: "Usuário inexistente!"}]}); 
                return;
            }
            req.userId = decoded.id;
            next();
        })

    });
};

const authJwt = {
    verifyToken: verifyToken
};

module.exports = authJwt;