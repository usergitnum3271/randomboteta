let handler = async (m, { conn, text, participants }) => {
  if (!m.isGroup) return m.reply("❌ ده أمر جروبات بس يا حبي.");

  let caption = text ? text : "𝐑𝐄𝐌 ✰ 𝐁𝐎𝐓";
  let members = participants.map(v => v.id);

  await conn.sendMessage(m.chat, {
    text: `@${m.chat}`, 
    contextInfo: {
      mentionedJid: members,
      groupMentions: [
        {
          groupSubject: caption,
          groupJid: m.chat
        }
      ]
    }
  });
};

handler.help = ['@'];
handler.tags = ['group'];
handler.command = /^@$/i;
handler.admin = true
handler.group = true;


export default handler;