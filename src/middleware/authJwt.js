const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            errors: [{msg: "Nenhum Token fornecido!"}]
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                errors: [{msg: "Não autorizado!"}]
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken
};

module.exports = authJwt;