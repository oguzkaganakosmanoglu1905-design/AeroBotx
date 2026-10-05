const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans
  ]
});

// Sistem Durumu & DEFCON Seviyesi
let defconLevel = 5; // 1 (Acil Durum) - 5 (Normal)

client.once('ready', () => {
  console.log(`[AeroBotx] ${client.user.tag} olarak başarıyla bağlandı!`);
  client.user.setActivity('AeroBotx | Sentinel Guard & Milsim System', { type: 3 });
});

// --- SENTINEL ANTI-RAID & SPAM KORUMASI ---
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.toLowerCase();

  // Reklam & Davet Linki Engeli
  const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite)/i;
  if (inviteRegex.test(content) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await message.delete().catch(() => {});
    return message.channel.send({ content: `⚠️ ${message.author}, bu sunucuda reklam yapmak kesinlikle yasaktır!` }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
  }

  // Oto SA-AS
  if (['sa', 's.a', 'selamun aleykum', 'selamün aleyküm'].includes(content)) {
    message.reply('Aleykümselam! AeroBotx Güvenlik ve Havacılık Sistemine Hoş Geldin! ✈️');
  }

  // KOMUTLAR (Prefix: !)
  if (!content.startsWith('!')) return;
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // --- MILSIM & DEFCON ALARM SİSTEMLERİ ---
  if (command === 'defcon') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply('❌ Bu komutu kullanmak için yetkiniz yok!');
    const level = parseInt(args[0]);
    if (!level || level < 1 || level > 5) return message.reply('Kullanım: `!defcon <1-5>` (1: En Yüksek Alarm, 5: Normal)');

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

  // --- SENTINEL MODERASYON KOMUTLARI ---
  if (command === 'kick') {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) return message.reply('❌ Yetkiniz yetersiz!');
    const member = message.mentions.members.first();
    if (!member) return message.reply('Lütfen atılacak kullanıcıyı etiketleyin!');
    await member.kick(args.slice(1).join(' ') || 'Sebep belirtilmedi.');
    return message.channel.send(`✅ **${member.user.tag}** sunucudan uzaklaştırıldı.`);
  }

  if (command === 'ban') {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply('❌ Yetkiniz yetersiz!');
    const member = message.mentions.members.first();
    if (!member) return message.reply('Lütfen yasaklanacak kullanıcıyı etiketleyin!');
    await member.ban({ reason: args.slice(1).join(' ') || 'Sebep belirtilmedi.' });
    return message.channel.send(`🚫 **${member.user.tag}** sunucudan yasaklandı.`);
  }

  if (command === 'sil' || command === 'purge') {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply('❌ Yetkiniz yetersiz!');
    const count = parseInt(args[0]);
    if (!count || count < 1 || count > 100) return message.reply('Lütfen 1-100 arasında bir sayı girin.');
    await message.channel.bulkDelete(count, true);
    return message.channel.send(`🧹 **${count}** mesaj temizlendi.`).then(msg => setTimeout(() => msg.delete().catch(() => {}), 3000));
  }

  // --- BİLET / TİCKET DESTEK SİSTEMİ ---
  if (command === 'ticket-kur') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;
    const embed = new EmbedBuilder()
      .setTitle('🎫 Destek & Komutanlık İletişim Paneli')
      .setDescription('Bir sorun, bildirim veya rol talebi için aşağıdaki butona basarak bilet açabilirsiniz.')
      .setColor('#0099ff');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('create_ticket').setLabel('Bilet Aç').setStyle(ButtonStyle.Primary)
    );

    return message.channel.send({ embeds: [embed], components: [row] });
  }
});

// --- OTO ROL & HOŞ GELDİN SİSTEMİ ---
client.on('guildMemberAdd', async (member) => {
  console.log(`Yeni Üye Katıldı: ${member.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
const { Client, GatewayIntentBits, Options } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  makeCache: Options.cacheWithLimits({
    MessageManager: 10, // Sadece son 10 mesajı bellekte tut
    PresenceManager: 0  // Kullanıcı durumlarını belleğe kaydetme
  })
});
