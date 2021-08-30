const config = require('../config.json');
const { MessageEmbed } = require('discord.js');
const User = require('../models/user');

module.exports = async (message, arguments) => {

    let embedDescription = 'пройди авторизацию [авторизацию](https://discord.com/oauth2/authorize?client_id=875128833899102248&redirect_uri=http%3A%2F%2Flocalhost%3A53134&response_type=code&scope=connections%20identify)';

    const result = await User.findAll({
        where: {
            discordId: message.author.id
        }, raw: true
    });

    if (result.length > 0) {
        embedDescription = 'ты уже прошел авторизацию';
    }

    const response = new MessageEmbed()
        .setDescription(embedDescription)

    message.channel.send({ embeds: [response] });
};
