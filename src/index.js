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

// ---- Safe "ensure bot is started" helper ----
let loginPromise = null;
async function ensureBotStarted() {
  if (!token) throw new Error("DISCORD token not configured");

  // If the client is already ready, we're good.
  if (typeof client.isReady === "function" && client.isReady()) return "already-ready";

  // If a login attempt is in-flight, await it.
  if (loginPromise) {
    await loginPromise;
    return client.isReady() ? "became-ready" : "login-attempt-failed";
  }

  // Start a new login attempt.
  loginPromise = client
    .login(token)
    .catch((err) => {
      // Surface error but clear the promise so future attempts can retry.
      throw err;
    })
    .finally(() => {
      loginPromise = null;
    });

  await loginPromise;
  return client.isReady() ? "started-now" : "login-attempt-failed";
}

// ===== Express keep-alive server =====
const app = express();

// Trust proxy so req.protocol reflects X-Forwarded-Proto on platforms like Render/Heroku
app.set("trust proxy", true);

app.get("/", async (req, res) => {
  // Build a dynamic, public URL from the incoming request
  const baseUrl = `${req.protocol}://${req.get("host")}/`;

  try {
    const status = await ensureBotStarted();
    return res.send(
      [
        "✅ Discord bot keep-alive endpoint.",
        `🤖 Bot status: ${status}`,
        `🔗 Use this URL in UptimeRobot: ${baseUrl}`,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("========================================");
  console.log("🚀 Express keep-alive server started!");
  console.log(`🔗 Keep-alive URL will be detected dynamically from requests`);
  console.log("========================================");
});
