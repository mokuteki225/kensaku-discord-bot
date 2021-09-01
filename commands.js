const me = require('./commands/me');
const link = require('./commands/link');
const queue = require('./commands/queue');

const commands = {
    me: me,
    link: link,
    queue: queue
};

module.exports = async (message) => {
    let msg = message.content;
    let arguments = msg.substring(msg.indexOf(' ') + 1);
    let command = msg.substring(1, (msg.indexOf(' ') > 0 ? msg.indexOf(' ') : msg.length));

    if (msg[0] === '^') {
        if (commands[command]) {
            commands[command](message, arguments);
        } else {
            message.channel.send("This command doesn't exist");
        }
    }
};