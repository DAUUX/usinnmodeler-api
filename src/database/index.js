const Sequelize = require('sequelize');
const User = require('../models/User');
const Diagram = require('../models/Diagram');
const Sharing = require('../models/Sharing');

const config = require('../config/database');
const connection = new Sequelize(config);

const db = {};

db.Sequelize = Sequelize;
db.connection = connection;

db.user    = User.init(connection);
db.diagram = Diagram.init(connection);
db.sharing = Sharing.init(connection);

db.user.associate(connection.models);
db.diagram.associate(connection.models);
db.sharing.associate(connection.models);

module.exports = db;