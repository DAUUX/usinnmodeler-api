const express = require('express');
const routes = express.Router();
const { verifySignUp } = require("./middleware");
const AuthController = require("./controllers/AuthenticationController");

routes.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

routes.post("/signup",
    [
        verifySignUp.checkDuplicateEmail,
        AuthController.signup.validations
    ],
    AuthController.signup.handler
);

module.exports = routes;