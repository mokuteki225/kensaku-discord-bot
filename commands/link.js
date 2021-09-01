const { MessageEmbed } = require('discord.js');
const User = require('../models/user');

module.exports = async (message, arguments) => {
    let embedDescription = 'пройди авторизацию [авторизацию](https://discord.com/api/oauth2/authorize?client_id=875128833899102248&redirect_uri=https%3A%2F%2Flobak-discord-bot.herokuapp.com&response_type=code&scope=identify%20connections)';

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
