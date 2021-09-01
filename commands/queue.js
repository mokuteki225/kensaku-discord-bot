const User = require('../models/user');
const { MessageEmbed } = require('discord.js');

const sendEmbedToChat = async (message, embedDescription) => {
    const response = new MessageEmbed()
        .setDescription(embedDescription);

    await message.channel.send({ embeds: [response] });
};

const SendEmbedToDm = async (discordId, enemyDotaId) => {
    const response = new MessageEmbed()
        .setDescription('я нашел тебе оппонента, его цифры ----> ' + enemyDotaId);

    await global.users.get(discordId).send({ embeds: [response] });
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
        sendEmbedToChat(message, embedDescription);
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
        sendEmbedToChat(message, embedDescription);

        if (result.length >= 2) {
            const playersSetInQueue = (result.length % 2 === 0 ? result.length : result.length - 1);

            console.log(result[0].dotaId);

            for (let i = 0; i < playersSetInQueue; i += 2) {
                SendEmbedToDm(result[i].discordId, result[i+1].dotaId);
                SendEmbedToDm(result[i+1].discordId, result[i].dotaId);

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