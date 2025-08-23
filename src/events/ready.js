module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    // setInterval(() => {
    //   console.log(
    //     `[KeepAlive] Bot is running at ${new Date().toLocaleTimeString()}`
    //   );
    // }, 15000);
  },
};
