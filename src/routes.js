const express = require('express');
const routes = express.Router();
const path = require('path');
const { verifySignUp, authJwt } = require("./middleware");
const AuthController = require("./controllers/AuthenticationController");
const UserController = require("./controllers/UserController");
const DiagramController = require("./controllers/DiagramController");
const SharingController = require('./controllers/SharingController');
const CollaborationController = require('./controllers/CollaborationController');
const FavoriteController = require('./controllers/FavoriteController');

routes.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
    
//Rotas de arquivos estáticos
routes.use('/files', express.static(path.join(__dirname, 'public/uploads')))

// Rotas de autenticação
routes.post("/signup", [ verifySignUp.checkDuplicateEmail, AuthController.signup.validations ], AuthController.signup.handler);
routes.post("/signin", [ AuthController.signin.validations ], AuthController.signin.handler);
routes.post("/recover-password", [ AuthController.passwordRecovery.validations ], AuthController.passwordRecovery.handler);
routes.post("/reset-password", [ AuthController.passwordReset.validations ], AuthController.passwordReset.handler);

// Rotas de usuário
const userRoutes = express.Router();
userRoutes.use([authJwt.verifyToken]);
userRoutes.post("/check-password", [UserController.checkPassord.validations], UserController.checkPassord.handler)
userRoutes.get("/", UserController.get.handler);
userRoutes.put("/", [UserController.update.validations], UserController.update.handler);
userRoutes.put("/change-password", [UserController.changePassword.validations], UserController.changePassword.handler);
userRoutes.delete("/", UserController.delete.handler);
routes.use('/user', userRoutes); 

// Rotas de diagrama
const diagramRoutes = express.Router();
diagramRoutes.use([authJwt.verifyToken]);
diagramRoutes.get("/", DiagramController.getAll.handler);
diagramRoutes.get("/recent", DiagramController.getRecent.handler);
diagramRoutes.get("/shared", DiagramController.getAllShared.handler);
diagramRoutes.get("/favorited", DiagramController.getAllFavorited.handler);
diagramRoutes.post("/export", [ DiagramController.export.validations ], DiagramController.export.handler);
diagramRoutes.get("/:id", DiagramController.get.handler);
diagramRoutes.post("/", [DiagramController.create.validations], DiagramController.create.handler);
diagramRoutes.put("/rename/:id", [DiagramController.rename.validations], DiagramController.rename.handler);
diagramRoutes.put("/:id", [DiagramController.update.validations], DiagramController.update.handler);
diagramRoutes.delete("/:id", DiagramController.delete.handler);
routes.use('/diagrams', diagramRoutes); 


// Rotas de compartilhamento
const sharingRoutes = express.Router();
sharingRoutes.use([authJwt.verifyToken]);
sharingRoutes.post("/:diagram_id", SharingController.generateLink.handler);
sharingRoutes.post("/:diagram_id/inviteLink", [ SharingController.inviteLink.validations ], SharingController.inviteLink.handler);
sharingRoutes.delete("/:diagram_id", SharingController.removeLink.handler);
routes.use('/share', sharingRoutes); 

// Rotas de colaboração
const collaborationRoutes = express.Router();
collaborationRoutes.use([authJwt.verifyToken]);
collaborationRoutes.get("/:diagram_id", CollaborationController.getAll.handler);
collaborationRoutes.get("/:diagram_id/getAllCollaborationWithName", CollaborationController.getAllCollaborationWithName.handler);
collaborationRoutes.get("/:diagram_id/:user_id", CollaborationController.getCollaboratorPermission.handler);
collaborationRoutes.post("/:token", CollaborationController.create.handler);
collaborationRoutes.delete("/:diagram_id/all", CollaborationController.deleteAllCollaborators.handler);
collaborationRoutes.delete("/:diagram_id/:id", CollaborationController.delete.handler);
collaborationRoutes.put("/:diagram_id/:user_id", CollaborationController.updatePermission.handler);
routes.use('/collaboration', collaborationRoutes); 

// Rotas de favorito
const favoriteRoutes = express.Router();
favoriteRoutes.use([authJwt.verifyToken]);
favoriteRoutes.post("/:diagram_id", FavoriteController.create.handler);
favoriteRoutes.delete("/:diagram_id", FavoriteController.delete.handler);
routes.use('/favorite', favoriteRoutes); 

module.exports = routes;