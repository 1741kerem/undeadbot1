const Discord = require('discord.js');
const db = require('quick.db')

exports.run = async (client, message, args, member) => {

      if (!message.guild) {
    const ozelmesajuyari = new Discord.RichEmbed()
    .setColor(0x2488E7)
    .setTimestamp()
    .setAuthor(message.author.username, message.author.avatarURL)
    .addField('Bu komutu sadece sunucu içerisinde kullanabilirsin.:relaxed: ')
    return message.author.sendEmbed(ozelmesajuyari); }

  
     if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(':no_entry: Bu komudu kullanmak için `Sunucuyu Yönet` yetkin bulunmamaktadır! ') 
     let mesaj = args.join(' ');
     if (!mesaj) return message.channel.send(":no_entry: Ototag ayarlamak için bir değer belirtmelisiniz.  `h!ototag (tag) `"); 
     if (message.channel.type === "dm") return;
     if (message.author.bot) return;
      await db.set(`ototag_${message.guild.id}`, mesaj)
      return message.channel.send(`:white_check_mark: Başarılı bir şekilde tagımız \`${mesaj}\` olarak belirlenmiştir.`)

}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ototag',
  description: 'Sunucu içerisinde bot otomatik tag verir',
  usage: 'ototag'
}