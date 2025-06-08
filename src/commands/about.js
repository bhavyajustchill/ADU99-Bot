const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Learn more about this bot and its creator"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("📢 About ADU 99")
      .setDescription(
        "Find out more about ADU 99, the female Indian DBD Streamer and get connected to know more!"
      )
      .addFields(
        {
          name: "YouTube",
          value: "https://www.youtube.com/@ADU-99a",
          inline: false,
        },
        {
          name: "Instagram",
          value: "https://instagram.com/_adu_99_",
          inline: false,
        },
        {
          name: "Official Discord Server",
          value: "https://discord.gg/xZc9bvSB6n",
          inline: false,
        }
      )
      .setColor(0x5865f2)
      .setFooter({ text: "Thanks for using the bot!" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
