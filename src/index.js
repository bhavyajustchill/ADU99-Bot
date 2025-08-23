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

async function ensureBotStarted() {
  if (!token) throw new Error("DISCORD token not configured");

  if (client.isReady()) return "already-ready";

  return client
    .login(token)
    .then(() => {
      return "started-now";
    })
    .catch((err) => {
      return "login-attempt-failed";
    });

  // await loginPromise;
  // return client.isReady() ? "started-now" : "login-attempt-failed";
}

const app = express();
// app.use(express.json());

app.set("trust proxy", true);

app.get("/", async (req, res) => {
  const url = `${req.protocol}://${req.get("host")}/`;

  try {
    const status = await ensureBotStarted();
    return res.send(
      [
        "✅ Discord bot keep-alive endpoint.",
        `🤖 Bot status: ${status}`,
        `🔗 Use this URL in UptimeRobot: ${url}`,
      ].join("\n")
    );
  } catch (err) {
    console.error("Failed to ensure bot is running:", err);
    return res
      .status(500)
      .send(
        [
          "❌ Failed to start Discord bot.",
          `Reason: ${err.message || err}`,
          `🔗 Keep-alive URL (still valid): ${baseUrl}`,
        ].join("\n")
      );
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, async () => {
  await ensureBotStarted();
  console.log("========================================");
  console.log(`🚀 Express keep-alive server started on port ${PORT}!`);
  console.log(`🔗 Keep-alive URL will be detected dynamically from requests`);
  console.log("========================================");
});
