import fetch from "node-fetch";

let handler = async (m, { conn }) => {
  let name = conn.getName(m.sender);

  let teks = `
${pickRandom([`\`موجودة 🐦🌷\``])}
`.trim();

  const thumb = await (await fetch('https://telegra.ph/file/3a507f8eac3ec0f89a9bc.jpg')).buffer(); 
  const verifiedMessage = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "⏤͟͞ू⃪ 𝐑𝐄𝐌🌷𖤐_VERIFIED"
    },
    message: {
      locationMessage: {
        name: "𝑅𝐸𝑀 𝐵𝛩𝑇",
        jpegThumbnail: thumb,
        vcard: `BEGIN:VCARD
VERSION:3.0
N:;⏤͟͞ू⃪ 𝐑𝐄𝐌🌷𖤐 LOVE 7ARB;;;
FN:⏤͟͞ू⃪ 𝐑𝐄𝐌🌷𖤐O • B7R
ORG:⏤͟͞ू⃪ 𝐑𝐄𝐌🌷𖤐O SYSTEM
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:⏤͟͞ू⃪ 𝐑𝐄𝐌🌷𖤐 SUPPORT
X-WA-BIZ-DESCRIPTION:Official ⏤͟͞ू⃪ 𝐑𝐄𝐌🌷𖤐 Bot Verified Service
X-WA-BIZ-NAME:𝑅𝐸𝑀･𝒃𝒐𝒕
END:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

const forwardedInfo = {
  forwardingScore: 9999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363158797567045@newsletter',
    serverMessageId: 777,
    newsletterName: '◜𝐑𝐄𝐌┊🎀┊𝐂𝐇𝐀𝐍𝐍𝐄𝐋◞'
  }
}
 
  conn.reply(
  m.chat,
  teks,
  verifiedMessage,
  {
    mentions: { mentionedJid: [m.sender] },
    contextInfo: forwardedInfo
  }
);
};

handler.customPrefix = /(تست)/i;
handler.command = new RegExp;

export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}