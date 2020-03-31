const Discord = require('discord.js')
 
exports.run = async (client, message, args) => {
        const embed = new Discord.RichEmbed()
        .setColor('GREEN')
        .setTitle("Discord")      
        .addField("­", "")
        .setThumbnail('');
        message.channel.sendEmbed(embed);
}
 
exports.conf = {
        enabled: true,
        guildOnly: true,
        aliases: ['bilgi', 'info'],
        permLevel: 0,
}
 
exports.help = {
        name: 'bilgi',
        description: '',
        usage: ''
}