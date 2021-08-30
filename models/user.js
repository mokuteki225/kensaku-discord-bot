const Sequelize = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
    discordId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    dotaId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gamesWon: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    gamesLost: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    inQueue: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

sequelize.sync();

module.exports = User;