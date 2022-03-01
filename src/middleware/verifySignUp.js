const db = require("../database");
const User = db.user;
checkDuplicateEmail = (req, res, next) => {
    const {email} = req.body;

    if (!email) {
        res.status(400).send({
            errors: [{msg: "Preencha o campo email!"}]
        });
        return;
    }

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                errors: [{msg: "Email já está sendo utilizado!"}]
            });
            return;
        }
        next();
    });
};
const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
};
module.exports = verifySignUp;