const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays information about the bot"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🤖 Bot Help")
      .setDescription("Here are some things you can do with this bot:")
      .addFields(
        {
          name: "/ping",
          value: "Replies with Pong! Used to check if the bot is online.",
        },
        { name: "/about", value: "Displays info about ADU 99" },
        {
          name: "/builds",
          value:
            "Shows some of the handpicked builds, which are mostly used by Squad of ADU 99",
        },
        { name: "/help", value: "Displays this help message." }
      )
      .setFooter({ text: "Bot created by YourName" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
