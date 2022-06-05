const express = require('express');
const routes = express.Router();
const { verifySignUp, authJwt } = require("./middleware");
const AuthController = require("./controllers/AuthenticationController");
const UserController = require("./controllers/UserController");
const DiagramController = require("./controllers/DiagramController");

routes.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// Rotas de login e cadastro
routes.post("/signup", [ verifySignUp.checkDuplicateEmail, AuthController.signup.validations ], AuthController.signup.handler);
routes.post("/signin", [ AuthController.signin.validations ], AuthController.signin.handler);

// Rotas de usuário
const userRoutes = express.Router();
userRoutes.use([authJwt.verifyToken]);
userRoutes.get("/", UserController.get.handler);
userRoutes.put("/", UserController.update.handler);
userRoutes.delete("/", UserController.delete.handler);
routes.use('/user', userRoutes); 

// Rotas de diagrama
const diagramRoutes = express.Router();
diagramRoutes.use([authJwt.verifyToken]);
diagramRoutes.get("/", DiagramController.getAll.handler);
diagramRoutes.get("/:id", DiagramController.get.handler);
diagramRoutes.post("/", DiagramController.create.handler);
diagramRoutes.put("/:id", DiagramController.update.handler);
diagramRoutes.delete("/:id", DiagramController.delete.handler);
routes.use('/diagrams', diagramRoutes); 

module.exports = routes;