import fetch from 'node-fetch';

const newsletterJid  = '120363406191527808@newsletter';
const newsletterName = '◜𝐖𝐈𝐋𝐋𝐈𝐀𝐌┊⛰️┊𝐂𝐇𝐀𝐍𝐍𝐄𝐋◞';

const packname = 'ᴡɪʟʟɪᴀᴍ ʙᴏᴛ';
const dev = '© ʙʏ ᴡɪʟʟɪᴀᴍ';
const redes = 'https://whatsapp.com/channel/0029Vb78EOTC1FuLAqNdNr2p';
const icons = 'https://files.catbox.moe/bff50y.jpg';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const contextInfo = {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName,
        serverMessageId: -1
      },
      externalAdReply: {
        title: packname,
        body: dev,
        thumbnailUrl: icons,
        sourceUrl: redes,
        mediaType: 1,
        renderLargerThumbnail: true
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "🌐 قـنـاة الـبـوت",
              url: redes,
              merchant_url: redes
            })
          }
        ],
        messageParamsJson: ""
      }
    };

    await m.react('❤️');
await conn.reply(
  m.chat,
  '🌌 *بدور لك على وايفو… استنى لحظة بس من فضلك...*',
  m,
  { contextInfo }
);

    let res = await fetch('https://api.waifu.pics/sfw/waifu');
    if (!res.ok) throw new Error('No se pudo obtener la waifu.');
    let json = await res.json();
    if (!json.url) throw new Error('Respuesta inválida.');

    
const caption = `🌌 *دي الوايفو بتاعتك يا ${conn.getName(m.sender)}* 👑\n\n💫 عايز واحدة تانية؟ دوس الزرار اللي تحت~`;

    const buttons = [
      { buttonId: usedPrefix + command, buttonText: { displayText: '🔁 واحدة تانية' }, type: 1 }
    ];

    await conn.sendMessage(
      m.chat,
      {
        image: { url: json.url },
        caption,
        footer: '❤️‍🩹 𝙱𝚈 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 𝙱𝙾𝚃',
        buttons,
        headerType: 4
      },
      { quoted: m, contextInfo }
    );

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '❌ عذراً، حدث خطأ أثناء البحث عن waifu.', m);
  }
};

handler.help = ['وايفو'];
handler.tags = ['anime'];
handler.command = ['waifu','وايفو','كوسبلاي2','cosplay2'];
handler.group = true;
handler.register = true;

export default handler;