const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
require("./util/eventLoader")(client);
const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  console.log(
    ` az önce pinglenmedi. Sonra ponglanmadı... ya da başka bir şeyler olmadı.`
  );
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.on("message", msg => {
  const kzgn = client.emojis.get("512302904141545509");
  const embedlul = new Discord.RichEmbed()
    .setColor(0x00ae86)
    .setDescription(msg.author + " Reklam Yasak Bunu Bilmiyormusun!");

  const embedlulz = new Discord.RichEmbed()
    .setTitle("Sunucunda " + msg.author.tag + " reklam yapıyor!")
    .setColor(0x00ae86)
    .setDescription(
      "u!uyar <kişi> komutu ile onu uyarabilir ya da u!kick <kişi> veya u!ban <kişi> komutlarını kullanarak onu sunucudan uzaklaştırabilirsin!"
    )
    .addField("Kullanıcının mesajı:", "**" + msg.content + "**");

  if (
    msg.content
      .toLowerCase()
      .match(/(discord\.gg\/)|(discordapp\.com\/invite\/) (htpp)/g) &&
    msg.channel.type === "text" &&
    msg.channel
      .permissionsFor(msg.guild.member(client.user))
      .has("MANAGE_MESSAGES")
  ) {
    if (msg.member.hasPermission("BAN_MEMBERS")) {
      return;
    } else {
      msg
        .delete(30)
        .then(deletedMsg => {
          deletedMsg.channel.send(embedlul);
          msg.guild.owner.send(embedlulz).catch(e => {
            console.error(e);
          });
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
});

const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new YouTube("AIzaSyCkT_L10rO_NixDHNjoAixUu45TVt0ES-s");
const queue = new Map();

client.on("message", async msg => {
  if (msg.author.bot) return undefined;

  const args = msg.content.split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(msg.guild.id);
  let command = msg.content.toLowerCase().split(" ")[0];

  if (command === "çal") {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setDescription("❎ | Lütfen Sesli Bir Kanala Giriş Yapınız!")
      );
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT")) {
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("❎ | Lütfen Seli Bir Kanala Giriş Yapınız!")
      );
    }
    if (!permissions.has("SPEAK")) {
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("❎ | Şarkıyı Çalamıyorum Bu Kanalda Konuşma Yetkim Yok!")
      );
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      return msg.channel
        .sendEmbed(new Discord.RichEmbed())
        .setTitle(`✅** | **${playlist.title}** Adlı Şarkı Kuyruğa Eklendi!**`);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          let index = 0;

          msg.channel.sendEmbed(
            new Discord.RichEmbed()
              .setTitle("Şarkı Seçimi")
              .setDescription(
                `${videos
                  .map(video2 => `**${++index} -** ${video2.title}`)
                  .join("\n")}`
              )
              .setFooter(
                "Lütfen 1-10 Arasında Bir Rakam Seçiniz 10 Saniye İçinde Liste İptal Edilecektir!"
              )
              .setFooter("Örnek Kullanım 1")
              .setColor("0x36393E")
          );
          msg.delete(5000);
          try {
            var response = await msg.channel.awaitMessages(
              msg2 => msg2.content > 0 && msg2.content < 11,
              {
                maxMatches: 1,
                time: 10000,
                errors: ["time"]
              }
            );
          } catch (err) {
            console.error(err);
            return msg.channel.sendEmbed(
              new Discord.RichEmbed()
                .setColor("0x36393E")
                .setDescription(
                  "❎ | **10 Saniye İçinde Şarkı Seçmediğiniz İçin seçim İptal Edilmiştir!**."
                )
            );
          }
          const videoIndex = parseInt(response.first().content);
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.sendEmbed(
            new Discord.RichEmbed()
              .setColor("0x36393E")
              .setDescription("❎ | YouTubede Böyle Bir Şarkı Yok !**")
          );
        }
      }
      return handleVideo(video, msg, voiceChannel);
    }
  } else if (command === "gir") {
    return new Promise((resolve, reject) => {
      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel || voiceChannel.type !== "voice")
        return msg.reply("Kanalda Kimse Olmadığından Çıkıyorum!");
      voiceChannel
        .join()
        .then(connection => resolve(connection))
        .catch(err => reject(err));
    });
  } else if (command === "geç") {
    if (!msg.member.voiceChannel)
      if (!msg.member.voiceChannel)
        return msg.channel.sendEmbed(
          new Discord.RichEmbed()
            .setColor("RANDOM")
            .setDescription("❎ | Lütfen Seli Bir Kanala Giriş Yapınız!")
        );
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("❎ **Şu An Zaten Şarkı Çalmıyorum!")
      );
    serverQueue.connection.dispatcher.end("**Sıradaki Şarkıya Geçildi!**");
    return undefined;
  } else if (command === "durdur") {
    if (!msg.member.voiceChannel)
      if (!msg.member.voiceChannel)
        return msg.channel.sendEmbed(
          new Discord.RichEmbed()
            .setColor("RANDOM")
            .setDescription("❎ | Lütfen Seli Bir Kanala Giriş Yapınız!")
        );
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("❎ | Şu An Zaten Şarkı Çalmıyorum!")
      );
    msg.channel.send(
      `:stop_button: **${serverQueue.songs[0].title}** Adlı Şarkı Durduruldu`
    );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("**Şarkı Bitti**");
    return undefined;
  } else if (command === "ses") {
    if (!msg.member.voiceChannel)
      if (!msg.member.voiceChannel)
        return msg.channel.sendEmbed(
          new Discord.RichEmbed()
            .setColor("RANDOM")
            .setDescription("❎ | Lütfen Seli Bir Kanala Giriş Yapınız!")
        );
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("❎ | Çalmayan Müziğin Sesine Bakamam")
      );
    if (!args[1])
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle(
            `:loud_sound: Şuanki Ses Seviyesi: **${serverQueue.volume}**`
          )
          .setColor("RANDOM")
      );
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setTitle(`:loud_sound: Ses Seviyesi Ayarlanıyor: **${args[1]}**`)
        .setColor("RANDOM")
    );
  } else if (command === "çalan") {
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("❎ | Şu An Şarkı Çalınmıyor!")
          .setColor("RANDOM")
      );
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("Çalan")
        .addField(
          "Başlık",
          `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`,
          true
        )
        .addField(
          "Süre",
          `${serverQueue.songs[0].durationm}:${serverQueue.songs[0].durations}`,
          true
        )
    );
  } else if (command === "sıra") {
    let index = 0;
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("❎ | **Şarkı Kuyruğunda Şarkı Bulunmamakta**")
          .setColor("RANDOM")
      );
    return msg.channel
      .sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("Şarkı Kuyruğu")
          .setDescription(
            `${serverQueue.songs
              .map(song => `**${++index} -** ${song.title}`)
              .join("\n")}`
          )
      )
      .addField("Şu Anda Çalınan: " + `${serverQueue.songs[0].title}`);
  } else if (command === "?duraklat") {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("**:pause_button: Şarkı Durduruldu!**")
          .setColor("RANDOM")
      );
    }
    return msg.channel.send("❎ | **Şarkı Çalmıyor Şu An**");
  } else if (command === "devam") {
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("**:arrow_forward: Şarkı Devam Ediyor!**")
          .setColor("RANDOM")
      );
    }
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setTitle("**❎ | Şu An Şarkı Çalınmıyor!**")
        .setColor("RANDOM")
    );
  }

  return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
  const serverQueue = queue.get(msg.guild.id);
  console.log(video);
  const song = {
    id: video.id,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
    durations: video.duration.seconds,
    views: video.views
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    queue.set(msg.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(msg.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(
        `❎ | **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}**`
      );
      queue.delete(msg.guild.id);
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle(
            `❎ | **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}**`
          )
          .setColor("RANDOM")
      );
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    if (playlist) return undefined;
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setTitle(`✅ | **${song.title}** Adlı Şarkı Kuyruğa Eklendi!`)
        .setColor("RANDOM")
    );
  }
  return undefined;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url))
    .on("end", reason => {
      if (reason === "❎ | **Yayın Akış Hızı Yeterli Değil.**")
        console.log("Şarkı Bitti.");
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.sendEmbed(
    new Discord.RichEmbed()
      .setTitle("**🎙 Şarkı Başladı**", `https://i.hizliresim.com/RDm4EZ.png`)
      .setThumbnail(
        `https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`
      )
      .addField("\nBaşlık", `[${song.title}](${song.url})`, true)
      .addField("\nSes Seviyesi", `${serverQueue.volume}%`, true)
      .addField("Süre", `${song.durationm}:${song.durations}`, true)
      .setColor("RANDOM")
  );
}
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//////////////sa-as

client.on("message", msg => {
  if (msg.content.toLowerCase() === "sa") {
    msg.reply("Aleyküm selam,  hoş geldin ^^");
  }
});

////////////////////////

client.on("guildMemberAdd", member => {
  let guild = member.guild;

  const channel = member.guild.channels.find("name", "「🚪」gi̇ri̇ş-çikiş ");
  if (!channel) return;
  const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(member.user.username, member.user.avatarURL)
    .setThumbnail(member.user.avatarURL)
    .setTitle(":inbox_tray: | Sunucuya katıldı!")
    .setTimestamp();
  channel.sendEmbed(embed);
});

client.on("guildMemberRemove", member => {
  const channel = member.guild.channels.find("name", "giriş-çıkış");
  if (!channel) return;
  const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(member.user.username, member.user.avatarURL)
    .setThumbnail(member.user.avatarURL)
    .setTitle(":outbox_tray: | Sunucudan ayrıldı")
    .setTimestamp();
  channel.sendEmbed(embed);
});

////////////////////////

client.on("message", msg => {
  const uyarıembed = new Discord.RichEmbed()
    .setColor(0x00ae86)
    .setDescription(
      ":crown: " +
        msg.author +
        "Reklam Yapmayı Kes Seni Yetkililere Söyledim :angry: :rage: "
    );

  const dmembed = new Discord.RichEmbed()
    .setTitle("Sunucunda " + msg.author.tag + " reklam yapıyor!")
    .setColor(0x00ae86)
    .setDescription(
      " " +
        msg.author.tag +
        " Sunucunda Reklam Yapıyor k?uyar komutu ile kişiyi uyara bilir k?ban Komutu İle Kişiyi Banlayabilirsin "
    )
    .addField("Kullanıcının mesajı:", "**" + msg.content + "**");

  if (
    msg.content
      .toLowerCase()
      .match(/(discord\.gg\/)|(discordapp\.com\/invite\/)/g) &&
    msg.channel.type === "text" &&
    msg.channel
      .permissionsFor(msg.guild.member(client.user))
      .has("MANAGE_MESSAGES")
  ) {
    if (msg.member.hasPermission("BAN_MEMBERS")) {
      return;
    } else {
      msg
        .delete(30)
        .then(deletedMsg => {
          deletedMsg.channel.send(uyarıembed);
          msg.guild.owner.send(dmembed).catch(e => {
            console.error(e);
          });
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
});

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

//////////küfür-engel

let kufurEngel = JSON.parse(
  fs.readFileSync("./jsonlar/kufurEngelle.json", "utf8")
);
client.on("message", msg => {
  if (!msg.guild) return;
  if (!kufurEngel[msg.guild.id]) return;
  if (kufurEngel[msg.guild.id].küfürEngel === "kapali") return;
  if (kufurEngel[msg.guild.id].küfürEngel === "acik") {
    const kufur = [
      "mk",
      "amk",
      "aq",
      "orospu",
      "oruspu",
      "oç",
      "sikerim",
      "yarrak",
      "piç",
      "amq",
      "sik",
      "amcık",
      "çocu",
      "sex",
      "seks",
      "amına",
      "orospu çocuğu",
      "sg",
      "siktir git"
    ];
    if (kufur.some(word => msg.content.toLowerCase().includes(word))) {
      if (!msg.member.hasPermission("ADMINISTRATOR")) {
        msg.delete();
        msg
          .reply("Küfür filtresi, aktif!")
          .then(message => message.delete(3000));
      }
    }
  }
});

///////////////////////giriş çıkış

client.on("guildMemberAdd", async member => {
  const fs = require("fs");
  let gkanal = JSON.parse(fs.readFileSync("./ayarlar/glog.json", "utf8"));
  const gözelkanal = member.guild.channels.get(gkanal[member.guild.id].resim);
  if (!gözelkanal) return;
  let username = member.user.username;
  if (gözelkanal === undefined || gözelkanal === null) return;
  if (gözelkanal.type === "text") {
    const bg = await Jimp.read(
      "https://cdn.discordapp.com/attachments/450693709076365323/473184528148725780/guildAdd.png"
    );
    const userimg = await Jimp.read(member.user.avatarURL);
    var font;
    if (member.user.tag.length < 15)
      font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    else if (member.user.tag.length > 15)
      font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    await bg.print(font, 430, 170, member.user.tag);
    await userimg.resize(362, 362);
    await bg.composite(userimg, 43, 26).write("./img/" + member.id + ".png");
    setTimeout(function() {
      gözelkanal.send(new Discord.Attachment("./img/" + member.id + ".png"));
    }, 1000);
    setTimeout(function() {
      fs.unlink("./img/" + member.id + ".png");
    }, 10000);
  }
});

exports.run = (client, message, args) => {
  let mesaj = args.slice(0).join(" ");
  if (mesaj.length < 1)
    return message.channel.send(
      "Özel DM den göndermek İstediğiniz Mesajı Yazınız."
    );
  message.delete();
  const mesajat = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription("**" + mesaj + "**");

  client.users.forEach(u => {
    u.sendEmbed(mesajat);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["dm"],
  permLevel: 4
};

exports.help = {
  name: "herkesedm",
  description: "İstediğiniz şeyi bota duyurtur. Sadece Bot Kurucuları Yapar.",
  usage: "herkesedm [duyurmak istediğiniz şey]"
};

client.on("guildMemberRemove", async member => {
  const fs = require("fs");
  let gkanal = JSON.parse(fs.readFileSync("./ayarlar/glog.json", "utf8"));
  const gözelkanal = member.guild.channels.get(gkanal[member.guild.id].resim);
  if (!gözelkanal) return;
  let username = member.user.username;
  if (gözelkanal === undefined || gözelkanal === null) return;
  if (gözelkanal.type === "text") {
    const bg = await Jimp.read(
      "https://cdn.discordapp.com/attachments/450693709076365323/473184546477572107/guildRemove.png"
    );
    const userimg = await Jimp.read(member.user.avatarURL);
    var font;
    if (member.user.tag.length < 15)
      font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    else if (member.user.tag.length > 15)
      font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    await bg.print(font, 430, 170, member.user.tag);
    await userimg.resize(362, 362);
    await bg.composite(userimg, 43, 26).write("./img/" + member.id + ".png");
    setTimeout(function() {
      gözelkanal.send(new Discord.Attachment("./img/" + member.id + ".png"));
    }, 1000);
    setTimeout(function() {
      fs.unlink("./img/" + member.id + ".png");
    }, 10000);
  }
});

///////////////////

client.on("guildMemberAdd", async member => {
  let sayac = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let otorole = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let arole = otorole[member.guild.id].sayi;
  let giriscikis = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let embed = new Discord.RichEmbed()
    .setTitle("Otorol Sistemi")
    .setDescription(
      `:loudspeaker: :inbox_tray:  @${member.user.tag}'a Otorol Verildi `
    )
    .setColor("GREEN")
    .setFooter("CHYPER", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds
      .get(member.guild.id)
      .channels.get(giriscikiskanalID);
    giriscikiskanali.send(
      `:loudspeaker: :white_check_mark: Hoşgeldin **${member.user.tag}** Rolün Başarıyla Verildi.`
    );
  } catch (e) {
    // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e);
  }
});

client.on("guildMemberAdd", async member => {
  let autorole = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let role = autorole[member.guild.id].sayi;

  member.addRole(role);
});

//////////////////sayaç

client.on("message", async message => {
  let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  if (sayac[message.guild.id]) {
    if (sayac[message.guild.id].sayi <= message.guild.members.size) {
      const embed = new Discord.RichEmbed()
        .setDescription(
          `Tebrikler, başarılı bir şekilde ${sayac[message.guild.id].sayi} kullanıcıya ulaştık!`
        )
        .setColor("0x808080")
        .setTimestamp();
      message.channel.send({ embed });
      delete sayac[message.guild.id].sayi;
      delete sayac[message.guild.id];
      fs.writeFile("./ayarlar/sayac.json", JSON.stringify(sayac), err => {
        console.log(err);
      });
    }
  }
});
client.on("guildMemberRemove", async member => {
  let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let embed = new Discord.RichEmbed()
    .setTitle("")
    .setDescription(``)
    .setColor("RED")
    .setFooter("", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds
      .get(member.guild.id)
      .channels.get(giriscikiskanalID);
    giriscikiskanali.send(
      `:loudspeaker: ${member.user.tag}, aramızdan ayrıldı, \**${
        sayac[member.guild.id].sayi
      }\** kişi olmamıza \**${sayac[member.guild.id].sayi -
        member.guild.memberCount}\** kişi kaldı!`
    );
  } catch (e) {
    // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e);
  }
});
client.on("guildMemberAdd", async member => {
  let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let embed = new Discord.RichEmbed()
    .setTitle("")
    .setDescription(``)
    .setColor("GREEN")
    .setFooter("", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds
      .get(member.guild.id)
      .channels.get(giriscikiskanalID);
    giriscikiskanali.send(
      `:loudspeaker: ${member.user.tag}, aramıza katıldı **${
        sayac[member.guild.id].sayi
      }** kişi olmamıza **${sayac[member.guild.id].sayi -
        member.guild.memberCount}** kişi kaldı!`
    );
  } catch (e) {
    // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e);
  }
});

//////////////otorol

client.on("guildMemberAdd", async member => {
  let sayac = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let otorole = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let arole = otorole[member.guild.id].sayi;
  let giriscikis = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let embed = new Discord.RichEmbed()
    .setTitle("Otorol Sistemi")
    .setDescription(
      `:loudspeaker: :inbox_tray:  @${member.user.tag}'a Otorol Verildi `
    )
    .setColor("GREEN")
    .setFooter("Gnarge", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds
      .get(member.guild.id)
      .channels.get(giriscikiskanalID);
    giriscikiskanali.send(
      `:loudspeaker: :white_check_mark: Hoşgeldin **${member.user.tag}** Rolün Başarıyla Verildi.`
    );
  } catch (e) {
    // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e);
  }
});

client.on("guildMemberAdd", async member => {
  let autorole = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let role = autorole[member.guild.id].sayi;

  member.addRole(role);
});

/////////////sunucu-panel

client.on("message", async message => {
  const ms = require("ms");
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "stattemizle") {
    if (
      !message.guild.channels.find(
        channel => channel.name === "Undead İstatistik System"
      )
    )
      return message.channel.send(" İstatistik ayarlanmamış.");
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(" Yetkin bulunmuyor.");
    const a = message.guild.channels
      .find(channel => channel.name === "Undead İstatistik System")
      .delete();
    if (!a) return console.log("guildStats");
    const b = message.guild.channels
      .find(
        channel => channel.name === `Üye sayısı: ${message.guild.memberCount}`
      )
      .delete();
    if (!b) return console.log("guildStatsMember");
    const c = message.guild.channels
      .find(
        channel =>
          channel.name ===
          `Bot sayısı: ${message.guild.members.filter(m => m.user.bot).size}`
      )
      .delete();
    if (!c) return console.log("guildStatsBot");
    const d = message.guild.channels
      .find(
        channel =>
          channel.name === `Kanal sayısı: ${message.guild.channels.size}`
      )
      .delete(); //|| message.guild.channels.find(channel => channel.name === `Kanal sayısı: ${message.guild.channels.size-1}`).delete() || message.guild.channels.find(channel => channel.name === `Kanal sayısı: ${message.guild.channels.size-1}`).delete() || message.guild.channels.find(channel => channel.name === `Kanal sayısı: ${message.guild.channels.size-2}`).delete()
    if (!d) return console.log("guildStatsChannel");
    message.channel.send(" Kanallar temizlendi.");
  }
  if (command === "statayarla") {
    if (
      message.guild.channels.find(
        channel => channel.name === "Undead İstatistik System"
      )
    )
      return message.channel.send(" Zaten istatistik ayarlanmış.");
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(" Yetkin bulunmuyor.");
    message.channel.send(
      `Kategori ve kanal kurulumu başlatılsın mı? başlatılacak ise **evet** yazınız.`
    );
    message.channel
      .awaitMessages(response => response.content === "evet", {
        max: 1,
        time: 10000,
        errors: ["time"]
      })
      .then(collected => {
        message.guild.createChannel("Undead İstatistik System", "category", [
          {
            id: message.guild.id,
            deny: ["CONNECT"],
            deny: ["VIEW_CHANNEL"]
          }
        ]);

        message.guild
          .createChannel(`Üye sayısı: ${message.guild.memberCount}`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "Undead İstatistik System"
              )
            )
          );
        message.guild
          .createChannel(
            `Bot sayısı: ${message.guild.members.filter(m => m.user.bot).size}`,
            "voice"
          )
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "Undead İstatistik System"
              )
            )
          );
        message.guild
          .createChannel(
            `Kanal sayısı: ${message.guild.channels.size}`,
            "voice"
          )
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "Undead İstatistik System"
              )
            )
          );
        message.channel.send(" Sunucu paneli ayarlandı!");
      });
  }
});

//////////////////botun dm görme

client.on("message", message => {
  const dmchannel = client.channels.find("name", "dm-log");
  if (message.channel.type === "dm") {
    if (message.author.bot) return;
    dmchannel.sendMessage("", {
      embed: {
        color: 3447003,
        title: `Gönderen: ${message.author.tag}`,
        description: `Bota Özelden Gönderilen DM: ${message.content}`
      }
    });
  }
});

///////////link-engel
let linkEngel = JSON.parse(
  fs.readFileSync("././jsonlar/linkEngelle.json", "utf8")
);
client.on("message", msg => {
  if (!linkEngel[msg.guild.id]) return;
  if (linkEngel[msg.guild.id].linkEngel === "kapali") return;
  if (linkEngel[msg.guild.id].linkEngel === "acik") {
    var regex = new RegExp(
      /(discord.gg|http|.gg|.com|.net|.org|invite|İnstagram|Facebook|watch|Youtube|youtube|facebook|instagram)/
    );
    if (regex.test(msg.content) == true) {
      if (!msg.member.hasPermission("ADMINISTRATOR")) {
        msg.delete();
        msg.channel
          .send(`<@${msg.author.id}>`)
          .then(message => message.delete(5000));
        var e = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setAuthor("Link Engeli!")
          .setDescription(
            `Bu sunucuda linkler **${client.user.username}** tarafından engellenmektedir! Link atmana izin vermeyeceğim!`
          );
        msg.channel.send(e).then(message => message.delete(5000));
      }
    }
  }
});

///////////////hazır-sunucu

client.on("message", async message => {
  const ms = require("ms");
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "sunucu-kur") {
    if (
      message.guild.channels.find(channel => channel.name === "Bot Kullanımı")
    )
      return message.channel.send(" Bot Paneli Zaten Ayarlanmış.");
    message.channel.send(
      `Bot Bilgi Kanallarının kurulumu başlatılsın mı? başlatılacak ise **evet** yazınız.`
    );
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        " Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir."
      );
    message.channel
      .awaitMessages(response => response.content === "evet", {
        max: 1,
        time: 10000,
        errors: ["time"]
      })
      .then(collected => {
        message.guild.createChannel("|▬▬|ÖNEMLİ KANALLAR|▬▬|", "category", [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ]);

        message.guild
          .createChannel("「📃」kurallar", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「🚪」gelen-giden", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「✅」sayaç", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「💾」log-kanalı", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「📢」duyuru-odası", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
      })
      .then(collected => {
        message.guild.createChannel("|▬▬|GENEL KANALLAR|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`「💡」şikayet-ve-öneri`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「👥」pre-arama-odası`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「📷」görsel-içerik`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「🤖」bot-komutları`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「💬」sohbet`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );

        message.guild
          .createChannel(`🏆》Kurucu Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "Kurucu");

            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|SES KANALLARI|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`🏆》Yönetici Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "Kurucu");
            let role3 = message.guild.roles.find("name", "Yönetici");
            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
            c.overwritePermissions(role3, {
              CONNECT: true
            });
          });

        message.guild
          .createChannel(`💬》Sohbet Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|OYUN ODALARI|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`🎮》LOL`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》ZULA`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》COUNTER STRİKE`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》PUBG`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》FORTNİTE`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》MİNECRAFT`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》ROBLOX`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》WOLFTEAM`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );

        message.guild.createRole({
          name: "Kurucu",
          color: "RED",
          permissions: ["ADMINISTRATOR"]
        });

        message.guild.createRole({
          name: "Yönetici",
          color: "BLUE",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES",
            "KICK_MEMBERS"
          ]
        });

        message.guild.createRole({
          name: "Moderatör",
          color: "GREEN",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
          ]
        });

        message.guild.createRole({
          name: "V.I.P",
          color: "00ffff"
        });

        message.guild.createRole({
          name: "Üye",
          color: "WHITE"
        });

        message.guild.createRole({
          name: "Bot",
          color: "ORANGE"
        });

        message.channel.send("Gerekli Odalar Kuruldu!");
      });
  }
});

//////////////////////bot eklenince msj yazma

client.on("guildDelete", guild => {
  let rrrsembed = new Discord.RichEmbed()

    .setColor("RED")
    .setTitle(" Bot Kickledi ")
    .addField("Sunucu Adı:", guild.name)
    .addField("Sunucu sahibi", guild.owner)
    .addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
    .addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
    .addField("Sunucudaki Kişi Sayısı:", guild.memberCount);

  client.channels.get("Kanalİd").send(rrrsembed);
});

client.on("guildCreate", guild => {
  let rrrsembed = new Discord.RichEmbed()

    .setColor("GREEN")
    .setTitle(" Bot Eklendi ")
    .addField("Sunucu Adı:", guild.name)
    .addField("Sunucu sahibi", guild.owner)
    .addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
    .addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
    .addField("Sunucudaki Kişi Sayısı:", guild.memberCount);

  client.channels.get("Kanalİd").send(rrrsembed);
});

const botStats = {
  guildID: '594621453333168148',
  totalUsersID: '633366796698910760',
  channelCountID: '633366921286254616',
  serverCountID: '633366954517856277'
};
client.on('ready', async(message,member,guild) => {
  client.setInterval(() => {
 if (!client.guilds.get(botStats.guildID)) return;
client.channels.get(botStats.totalUsersID).setName(`Toplam Kullanıcı : ${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`);
client.channels.get(botStats.serverCountID).setName(`Sunucu Sayısı : ${client.guilds.size.toLocaleString()}`);
client.channels.get(botStats.channelCountID).setName(`Kanal Sayısı : ${client.channels.size.toLocaleString()}`);
  }, 5000);
});



//////ototag
client.on('guildMemberAdd', async member => {
  
  let tag = await fetch(`_${member.guild.id}`);
  let tagsekil;
  if (tag == null) tagsekil = member.setNickname(`${member.user.username}`)
  else tagsekil = member.setNickname(`${tag} ${member.user.username}`)
});