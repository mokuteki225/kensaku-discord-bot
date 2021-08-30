require('dotenv').config();
const { Client, Intents, Message } = require('discord.js');
const express = require('express');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, 'GUILD_PRESENCES', 'GUILD_MEMBERS'] }); //read more about intents
const commandHandler = require('./commands');
const DiscordOauth2 = require('discord-oauth2');
const oauth = new DiscordOauth2();
const SteamID = require('steamid');
const User = require('./models/user');
const { MessageEmbed } = require('discord.js');

global.users = client.users.cache;

const app = express();
const PORT = (process.env.PORT || 53134);

const steam3IdToDotaId = async (dotaId) => {
    let amountOfColons = 0;
    for (let i = 0; i < dotaId.length; i++) {
        if (dotaId[i] === ':') amountOfColons++;
        if (amountOfColons === 2) {
            dotaId = dotaId.substring(i + 1, dotaId.length - 1);
            return dotaId;
        }
    }
}

const sendEmbed = async (user, embedDescription) => {
    const response = new MessageEmbed()
        .setDescription(embedDescription);

    await global.users.get(user.id).send({ embeds: [response] });
};

app.use('/', async (req, res) => {
    if (req.query.code) {
        let embedDescription = '', dotaId, access_token = '';

        await oauth.tokenRequest({
            clientId: process.env.OAUTH2_CLIENT_ID,
            clientSecret: process.env.OAUTH2_CLIENT_SECRET,

            code: req.query.code,
            scope: "identify connections",
            grantType: "authorization_code",

            redirectUri: 'https://lobak-discord-bot.herokuapp.com'
        }).then(result => {
            access_token = result.access_token;
        });

        let user = await oauth.getUser(access_token);
        let connections = await oauth.getUserConnections(access_token);

        const usersWithSameDiscordId = await User.findAll({
            where: {
                discordId: user.id
            }, raw: true
        });

        if (usersWithSameDiscordId.length > 0) {
            embedDescription = "ты уже привязал свой аккаут";
            sendEmbed(user, embedDescription);
            res.end("you have already linked your account");
            return;
        }

        for (let i = 0; i < connections.length; i++) {
            if (connections[i].type === 'steam') {
                dotaId = new SteamID(connections[i].id).getSteam3RenderedID();
                break;
            }
        }
        if (dotaId === undefined) {
            embedDescription = 'ты ещё не подключил стим к своему дискорд аккаунту';
            sendEmbed(user, embedDescription);
            res.end("link your steam account to your discord");
            return;
        }

        dotaId = await steam3IdToDotaId(dotaId);

        await User.create({
            discordId: user.id,
            dotaId: dotaId,
            gamesWon: 0,
            gamesLost: 0,
            inQueue: 0
        });

        res.end("everything is ok");
    } else {
        res.end("ivalid request");
    }
});

app.listen(PORT);

client.on('ready', () => {
    console.log("zdarova musor)");
});

client.on('messageCreate', commandHandler);

client.login(process.env.TOKEN);
