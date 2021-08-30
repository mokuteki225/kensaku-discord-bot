require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);

module.exports = sequelize;