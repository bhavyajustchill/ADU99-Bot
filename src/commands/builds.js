const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

const builds = {
  killer: [
    {
      id: "build_without_limitations",
      name: "Build Without Limitations",
      killer: "Any Killer",
      description:
        "This Build has no Limitations, as it targets Generator Slowdown",
      perks: [
        "Corrupt Intervention",
        "Dead Man's Switch",
        "Scourge Hook: Pain Resonance",
        "Grim Embrace",
      ],
    },
    {
      id: "best_beginner_build",
      name: "Best Beginner Build",
      killer: "Any Killer",
      description: "Best build for players that have low hours on Killer",
      perks: [
        "Lethal Pursuer",
        "Barbeque and Chili",
        "Pop Goes the Weasel",
        "Nurse's Calling",
      ],
    },
    {
      id: "devour_hope_build",
      name: "Devour Hope Build",
      killer: "Any Killer",
      description:
        "Want to bully survivors and end a match early? Use this Build for giving hope to survivors and then snatching it away after 3 hooks.",
      perks: [
        "Hex: Undying",
        "Hex: Pentimento",
        "Hex: Haunted Ground",
        "Hex: Devour Hope",
      ],
    },
    {
      id: "pallet_eating_build",
      name: "Pallet Eating Build",
      killer: "Any Killer",
      description:
        "Tired of getting Pallet Camped? Use this build so that you don't have to worry about pallets anymore",
      perks: ["Corrupt Intervention", "Enduring", "Spirit Fury", "Deadlock"],
    },
    {
      id: "aditis_anti_chase_vecna_build",
      name: "Aditi's Anti-Chase Vecna Build",
      killer: "The Lich",
      description:
        "This is the main build used by Aditi (ADU 99) on Vecna to counter most of the exhaustion perks and also has an element of Generator Slowdown",
      perks: [
        "Spies from the Shadows",
        "Languid Touch",
        "Sloppy Butcher",
        "Pop Goes the Weasel",
      ],
    },
    {
      id: "bhavyajustchills_dracula_build",
      name: "BhavyaJustChill's Dracula Build",
      killer: "The Dark Lord",
      description:
        "This is the build used by BhavyaJustChill on Dracula, for both Stealth to make surprise silent attacks as well as finding survivors' location and pressuring Generators and adding extra slowdown with Totem cleansing",
      perks: [
        "Scourge Hook: Pain Resonance",
        "Grim Embrace",
        "Hex: Plaything",
        "Spies from the Shadows",
      ],
    },
    {
      id: "taruns_silent_onryo_build",
      name: "Tarun's Silent Onryo Build",
      killer: "The Onryo",
      description:
        "Want to Surprise attack on someone and jumpscare them? Use this build by Tarun on already kind of stealh killer Onryo and make them scared",
      perks: [
        "Trail of Torment",
        "Tinkerer",
        "Hex: Plaything",
        "Monitor and Abuse",
      ],
    },
    {
      id: "beast_adityas_nurse_build",
      name: "Beast Aditya's Nurse Build",
      killer: "The Nurse",
      description:
        "This is the build used by Beast Aditya on Nurse for Gathering Info about survivors, helping to reach Scourge Hooks and passive Generator Slowdown! Great for most of nurse players",
      perks: [
        "Agitation",
        "Scourge Hook: Pain Resonance",
        "Spies from the Shadows",
        "Eruption",
      ],
    },
  ],
  survivor: [
    {
      id: "best_overall_build",
      name: "Best Overall Build",
      description: "Best Build to use for almost any situation",
      perks: ["Unbreakable", "Decisive Strike", "Deliverance", "Dead Hard"],
    },
    {
      id: "best_soloq_build",
      name: "Best SoloQ Build",
      description: "Helps the survivors with no friends",
      perks: ["Deja Vu", "Windows of Oppourtunity", "Kindred", "Lithe"],
    },
    {
      id: "best_chase_build",
      name: "Best Chase Build",
      description: "Make your chases last longer with this build",
      perks: ["Finesse", "Hope", "Resilience", "Dramaturgy"],
    },
    {
      id: "best_anti_tunnel_build",
      name: "Best Anti-Tunnel Build",
      description: "Tired of getting Tunneled? Use this build",
      perks: ["Decisive Strike", "Dead Hard", "Hope", "Off the Record"],
    },
    {
      id: "aditi_special_build",
      name: "Aditi Special Build",
      description:
        "If you want to bully the Killer, use this Special Build made by Aditi (ADU 99), and make the killer cry for chasing you!",
      perks: ["Finesse", "Lithe", "Windows of Oppourtunity", "Resilience"],
    },
    {
      id: "bhavyajustchills_fav_build",
      name: "BhavyaJustChill's Fav Build",
      description:
        "This is BhavyaJustChill's main build that he uses since day one! Most useful for balance in all aspects of a DBD match, whether it be chasing, anti tunneling or healing other survivors! You can get it all done",
      perks: [
        "Windows of Oppourtunity",
        "Lithe",
        "Off the Record",
        "We'll Make It",
      ],
    },
    {
      id: "taruns_flashy_saves_build",
      name: "Tarun's Flashlight Save Build",
      description:
        "Tired of seeing other survivors getting hooked and tunneled? Use this Tarun's Epic Flashlight Save Build! Tail the Killer when he is chasing your team mate and save instantly with this build!",
      perks: ["Background Player", "Champion of Light", "Bond", "Flash Bang"],
    },
    {
      id: "beast_adityas_chase_build",
      name: "Beast Aditya's Chase Build",
      description:
        "Want an unpredictable chase build that doesn't include meta perks? Then use Beast Aditya's Unique chase build to surprise the killer",
      perks: ["Sprint Burst", "Vigil", "Windows of Oppourtunity", "Resilience"],
    },
  ],
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("builds")
    .setDescription("Choose a role to see Dead by Daylight builds")
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("killer or survivor")
        .setRequired(true)
        .addChoices(
          { name: "Killer", value: "killer" },
          { name: "Survivor", value: "survivor" }
        )
    ),

  async execute(interaction) {
    const role = interaction.options.getString("role");
    const roleBuilds = builds[role];
    const rows = [];
    let currentRow = new ActionRowBuilder();

    for (let i = 0; i < roleBuilds.length; i++) {
      const build = roleBuilds[i];

      if (currentRow.components.length === 5) {
        rows.push(currentRow);
        currentRow = new ActionRowBuilder();
      }

      currentRow.addComponents(
        new ButtonBuilder()
          .setCustomId(build.id)
          .setLabel(build.name)
          .setStyle(ButtonStyle.Primary)
      );
    }

    if (currentRow.components.length > 0) {
      rows.push(currentRow);
    }

    await interaction.reply({
      content: `Select a ${role} build:`,
      components: rows,
      ephemeral: true,
    });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({
          content: "This is not your build selection.",
          ephemeral: true,
        });
      }

      const selectedBuild = roleBuilds.find((b) => b.id === i.customId);
      if (!selectedBuild) {
        return i.reply({ content: "Build not found.", ephemeral: true });
      }

      const buildText =
        role === "killer"
          ? `**${selectedBuild.name}** (for **${selectedBuild.killer}**)\n${
              selectedBuild.description
            }\n\n**Perks**: ${selectedBuild.perks.join(", ")}`
          : `**${selectedBuild.name}**\n${
              selectedBuild.description
            }\n\n**Perks**: ${selectedBuild.perks.join(", ")}`;

      await i.reply({ content: buildText, ephemeral: true });
    });
  },
};
