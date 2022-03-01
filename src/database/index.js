const Sequelize = require('sequelize');
const User = require('../models/User');

const config = require('../config/database');
const connection = new Sequelize(config);

const db = {};

db.Sequelize = Sequelize;
db.connection = connection;

db.user = User.init(connection);

module.exports = db;