const { Client, GatewayIntentBits, Options, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

// DisCloud 100 MB RAM Sınırı İçin Özel Önbellek Kısıtlayıcı
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  makeCache: Options.cacheWithLimits({
    MessageManager: 0,        // Mesajları hafızada tutma
    StageInstanceManager: 0,
    GuildBanManager: 0,
    GuildInviteManager: 0,
    GuildStickerManager: 0,
    GuildScheduledEventManager: 0,
    ReactionManager: 0,
    PresenceManager: 0,       // Üye durumlarını hafızada tutma
    ThreadManager: 0,
    ThreadMemberManager: 0,
    UserManager: 0,
    VoiceStateManager: 0
  })
});

let defconLevel = 5;

client.once('ready', () => {
  console.log(`[AeroBotx] ${client.user.tag} ultra-hafif modda 7/24 aktif!`);
  client.user.setActivity('AeroBotx | Sentinel Guard & Milsim', { type: 3 });
});

// --- SENTINEL ANTI-RAID & KORUMA ---
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.toLowerCase();

  // Reklam Engeli
  const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite)/i;
  if (inviteRegex.test(content) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await message.delete().catch(() => {});
    return message.channel.send(`⚠️ ${message.author}, reklam yapmak yasaktır!`).then(msg => setTimeout(() => msg.delete().catch(() => {}), 4000));
  }

  // Oto SA-AS
  if (['sa', 's.a', 'selamun aleykum', 'selamün aleyküm'].includes(content)) {
    message.reply('Aleykümselam! AeroBotx Güvenlik Sistemine Hoş Geldin! ✈️');
  }

  if (!content.startsWith('!')) return;
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // MILSIM DEFCON
  if (command === 'defcon') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply('❌ Yetkiniz yok!');
    const level = parseInt(args[0]);
    if (!level || level < 1 || level > 5) return message.reply('Kullanım: `!defcon <1-5>`');

    defconLevel = level;
    const colors = { 1: '#FF0000', 2: '#FF4500', 3: '#FFA500', 4: '#FFFF00', 5: '#00FF00' };
    
    const embed = new EmbedBuilder()
      .setTitle('🚨 ÜS DEFCON DÜZEYİ GÜNCELLENDİ')
      .setDescription(`Sunucu alarm durumu **DEFCON ${defconLevel}** olarak ayarlandı!`)
      .setColor(colors[defconLevel])
      .setFooter({ text: 'AeroBotx Milsim Security' })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  }

  // KİCK / BAN / TEMİZLE
  if (command === 'sil' || command === 'purge') {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply('❌ Yetkiniz yok!');
    const count = parseInt(args[0]);
    if (!count || count < 1 || count > 100) return message.reply('1-100 arasında bir sayı girin.');
    await message.channel.bulkDelete(count, true);
    return message.channel.send(`🧹 **${count}** mesaj temizlendi.`).then(msg => setTimeout(() => msg.delete().catch(() => {}), 3000));
  }

  // TİCKET SİSTEMİ
  if (command === 'ticket-kur') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;
    const embed = new EmbedBuilder()
      .setTitle('🎫 Destek & İletişim Paneli')
      .setDescription('Aşağıdaki butona basarak bilet açabilirsiniz.')
      .setColor('#0099ff');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('create_ticket').setLabel('Bilet Aç').setStyle(ButtonStyle.Primary)
    );

    return message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.login(process.env.DISCORD_TOKEN);
