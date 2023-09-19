const Sequelize     = require('sequelize');
const User          = require('../models/User');
const Diagram       = require('../models/Diagram');
const Collaboration = require('../models/Collaboration');
const ShareToken    = require('../models/ShareToken');
const RecoverToken  = require('../models/RecoverToken');
const Favorite      = require('../models/Favorite');

const config     = require('../config/database');
const connection = new Sequelize(config);

const db = {};

db.Sequelize  = Sequelize;
db.connection = connection;

db.user          = User.init(connection);
db.diagram       = Diagram.init(connection);
db.collaboration = Collaboration.init(connection);
db.shareToken    = ShareToken.init(connection);
db.recoverToken  = RecoverToken.init(connection);
db.favorite      = Favorite.init(connection);

db.user.associate(connection.models);
db.diagram.associate(connection.models);
db.collaboration.associate(connection.models);
db.shareToken.associate(connection.models);
db.recoverToken.associate(connection.models);
db.favorite.associate(connection.models);

module.exports = db;