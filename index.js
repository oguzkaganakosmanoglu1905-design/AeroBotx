require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} başarıyla çevrimiçi oldu! AeroBot göreve hazır.`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const contentLower = message.content.toLowerCase().trim();

  // 1. SA - AS Mantığı
  if (contentLower === 'sa' || contentLower === 'selam' || contentLower === 'sa beyler') {
    return message.reply(`Aleykümselam ${message.author}, hoş geldin! 🛩️`);
  }

  // 2. Akrobasi Takımı / AeroBot Komutları
  if (contentLower === '!aerobot' || contentLower === '!bilgi') {
    const embed = new EmbedBuilder()
      .setTitle('✈️ AeroBot - Gösteri Takımı Asistanı')
      .setColor('#FF0000')
      .setDescription('Roblox Türk Akrobasi ve Gösteri Takımı resmi Discord botudur!')
      .addFields(
        { name: '🇹🇷 Gösteri Jetleri', value: 'SOLOTÜRK F-16 & Türk Yıldızları NF-5' },
        { name: '💬 Sohbet', value: 'Chatte `sa` yazarak selam verebilirsiniz.' }
      )
      .setFooter({ text: 'AeroBot | Akrobasi & Eğlence' });

    return message.channel.send({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);
