let handler = async (m, { conn, text }) => {
	
	const allowedUsers = ['77472347218@s.whatsapp.net']
if (!allowedUsers.includes(m.sender)) return m.reply('❌ *الأمر ده مسموح للمطور بس.*')

    if (!text && !m.quoted) return m.reply('🌌⚠️ *منشن أو اعمل ريبلاي العلق اللي عايز تمنعه من استخدام البوت.*')

    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
    else who = m.chat
    if (!who) return m.reply('🌌⚠️ *منشن أو اعمل ريبلاي ع رسالته يبني.*')

    let users = global.db.data.users
    if (!users[who]) users[who] = {}

    users[who].banned = true

    await conn.sendMessage(
        m.chat,
        {
            text: `🍃🌌 *لقد تم منع المستخدم @${who.split('@')[0]} من استخدام اللبوت.*\n\n❄️ حاول تحسين سلوكك لي يتم فك الحظر عنك...`,
            contextInfo: {
                forwardingScore: 200,
                isForwarded: false,
                mentionedJid: [who],
                externalAdReply: {
                    showAdAttribution: false,
                    title: `❗`,
                    body: `✨ مع تحياتي.`,
                    mediaType: 2,
                    sourceUrl: global.redes || '',
                    thumbnail: global.icons || null
                }
            }
        },
        { quoted: m }
    )
}

handler.help = ['بان <@tag>']
handler.command = ['banuser','بان','ban']
handler.tags = ['owner']

export default handler