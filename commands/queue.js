const User = require('../models/user');
const { MessageEmbed } = require('discord.js');

const sendEmbed = async (message, embedDescription) => {
    const response = new MessageEmbed()
        .setDescription(embedDescription);

    await message.channel.send({ embeds: [response] });
};

module.exports = async (message, arguments) => {

    let embedDescription = '';

    const checkIfUserLinked = await User.findAll({
        where: {
            discordId: message.author.id
        }
    });

    if (checkIfUserLinked.length === 0) {
        embedDescription = 'сначало привяжи свой аккаунт ----> !link';
        sendEmbed(message, embedDescription);
    } else {

        await User.update({ inQueue: 1 }, {
            where: {
                discordId: message.author.id
            }
        });

        const result = await User.findAll({
            where: {
                inQueue: 1
            }, raw: true
        });

        embedDescription = 'ты находишься в очереди, игроков в очереди ----> ' + result.length;
        sendEmbed(message, embedDescription);

        if (result.length >= 2) {
            const playersSetInQueue = (result.length % 2 === 0 ? result.length : result.length - 1);

            console.log(result[0].dotaId);

            for (let i = 0; i < playersSetInQueue; i+=2) {
                await global.users.get(result[i].discordId).send(result[i + 1].dotaId);
                await global.users.get(result[i + 1].discordId).send(result[i].dotaId);

                await User.update({ inQueue: 0 }, {
                    where: {
                        discordId: result[i].discordId,
                        discordId: result[i + 1].discordId
                    }
                });
            }
        }
    }
}