const Discord = require('discord.js')

exports.run = async (client, message, args) => {
  
  let p = '/'
  let arg = args.slice(0).join(' ');
  
  if (!arg[0]) {
  const embed = new Discord.RichEmbed()
  .setTitle('Yardım Menüsü')
  .setDescription(`:white_small_square: \`u!yardım eğlence\` = Eğlence ve Kullanıcı Komutlarını Listeler. \n\n:white_small_square: \`u!yardım moderasyon\` = Moderasyon Komutlarını Listeler. \n\n:white_small_square: \`u!yardım kullanıcı\` = Kullanıcı Komutlarını Listeler.  `)
  message.channel.send({embed})
  }
   if (arg === 'eğlence' || arg === '1') {
  const embed = new Discord.RichEmbed()
  .setTitle('Eğlence  Komutları')
  .setDescription(`:white_small_square: \`u!avatarım\` = Avatarınızı Gösterir. \n:white_small_square: \`u!ara155\` = Polisi Arar. \n:white_small_square: \`u!ascii\` = Ascii olarak yazarsınız. \n:white_small_square: \`u!herkesebendençay\` = Herkese Çay Ismarlarsınız. \n:white_small_square: \`u!çayiç\` = Çay İçersiniz. \n:white_small_square: \`u!çayaşekerat\` = Çaya Şeker Atarsınız. \n:white_small_square: \`u!yumruk-at\` = Yumruk Atarsınız. \n:white_small_square: \`u!wwegif\` = WWE Gifi Atar. \n:white_small_square: \`u!stresçarkı\` = Stres Çarkı Çevirirsin. \n:white_small_square: \`u!çekiç\` = İstediginiz Kişiye Çekiç Atarsınız. \n:white_small_square: \`u!koş\` = Koşarsınız. \n:white_small_square: \`u!yazı-tura\` = Yazı Tura Oynarsınız.  \n:white_small_square: \`u!simit\` = Simit Yersiniz.   \n:white_small_square: \`u!ping\` = Botun Pingini Gösterir. \n:white_small_square: \`u!fbi\` = FBI Gifi Atar. \n:white_small_square: \`u!wasted\` = Profilinize Wasted Efekti Ekler. \n:white_small_square: \`u!söv\` = Söver.  `)
  message.channel.send(embed)
  }
  if (arg === 'moderasyon' || arg === '2') {
      const embed = new Discord.RichEmbed()
      .setTitle('Moderasyon Komutları:')
      .setDescription(` :white_small_square: \`u!otorol\` = Sunucu için otorol ayarlar. \n:white_small_square: \`u!sayaç-ayarla\` = Sunucu için sayaç ayarlar. \n:white_small_square: \`u!ban\` = İstediginiz Kişiyi Banlar. \n:white_small_square: \`u!unban\` = İstediğiniz Kişini Banını  Açar. \n:white_small_square: \c!küfür-engelle [aç-kapat]\` = Küfürü Engeller. \n:white_small_square: \c!link-engelle [aç-kapat]\` = Link Paylaşılmasını Engeller.  \n:white_small_square: \`u!oylama\` = Oylama Yapar. \n:white_small_square: \`u!slowmode\` = Yavaş Modu Açar. \n:white_small_square: \`u!temizle\` = İstediniz Kadar Mesaj Siler. \n:white_small_square: \`u!çekiliş\` = Çekiliş Yaparsınız. \n:white_small_square: \`u!sustur\` = İstediğiniz Kişiyi Geçici Olarak Susturursunuz. \n:white_small_square: \`u!kayıt-sistemi\` = Kayıt Sistemini Atar. `)
      return message.channel.send(embed);
}
   if (arg === 'kullanıcı' || arg === '2') {
      const embed = new Discord.RichEmbed()
      .setTitle('Kullanıcı Komutları:')
      .setDescription(`:white_small_square: \`u!yaz\` = Bota İstediğiniz Şeyi Yazdırırsınız. \n:white_small_square: \`u!sunucuresmi\` = Sunucu Resmini Atar. \n:white_small_square: \`u!nsfw-gif\` = Nsfw Gifi Atar. \n:white_small_square: \`u!yetkilerim\` = Yetkilerinizi Gösterir. \n:white_small_square: \`u!kullanıcıbilgim\` = Bilgilerinizi Gösterir. \n:white_small_square: \`c!ping\` = Botun Pingini Gösterir.  \n:white_small_square: \`u!sunucubilgi\` = Sunucu Hakkında Bilgi Verir. \n:white_small_square: \`u!afk [sebep]\` = AFK Olursunuz. `)   
      return message.channel.send(embed);
}
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['yardım','help','y'],
  permlevel: 0
};

exports.help = {
  name: 'yardım',
  description: 'Gelişmiş Yardım Menüsü',
  usage: 'yardım'
};
