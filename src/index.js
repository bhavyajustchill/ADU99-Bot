const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config/config");
const fs = require("fs");
const path = require("path");
const express = require("express");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync(path.join(__dirname, "commands"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Load events
const eventFiles = fs.readdirSync(path.join(__dirname, "events"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Start bot
client.login(token);

// ===== Express keep-alive server =====
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Discord bot is alive and running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`; // will be replaced by your hosting URL online
  console.log("========================================");
  console.log("🚀 Express keep-alive server started!");
  console.log(`🔗 Use this URL in UptimeRobot: ${url}`);
  console.log("========================================");
});
