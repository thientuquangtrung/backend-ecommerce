const { Client, GatewayIntentBits } = require("discord.js");

const { DISCORD_CHANNELID, DISCORD_TOKEN } = process.env;

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        });

        this.channelId = DISCORD_CHANNELID;

        this.client.on("ready", () => {
            console.log(`logged is as ${this.client.user.tag}`);
        });

        this.client.login(DISCORD_TOKEN);
    }

    sendToFormatCode(logData) {
        const { code, message = `This is some information about code.`, title = `Code Example` } = logData;

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt("00ff00", 16),
                    title,
                    description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
                },
            ],
        };

        this.sendToMessage(codeMessage);
    }

    sendToMessage(message = "message") {
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) {
            console.error(`channel ${this.channelId} not found`);
            return;
        }

        channel.send(message).catch((error) => console.error(error));
    }
}

const loggerService = new LoggerService();
module.exports = loggerService;
