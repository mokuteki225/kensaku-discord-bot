const User = require('../models/user');
const { MessageEmbed } = require('discord.js');

module.exports = async (message, arguments) => {
    let user = message.author;
    
    // const result = await User.findOne({
    //     where: {
    //         discordId: user.id
    //     }, raw: true
    // });

    const response = new MessageEmbed()
    .setTitle(user.username)
    .setImage(user.avatarURL())

    message.channel.send({embeds: [response]});
}