const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", () => {
    console.log(`logged is as ${client.user.tag}`);
});

const token =
    "MTE0NzA5Njg4NzU3MzM1MjQ1OA.GC2hjL.EcnSRgWJapTWZ6XwhHYdrxaCXmmwshqSikNND4";
client.login(token);

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content === "hello") {
        message.reply(`Hellooo! Can I help you?`);
    }
});
