let handler = async (m, { conn, text }) => {
	const allowedUsers = ['212726315195@s.whatsapp.net']
if (!allowedUsers.includes(m.sender)) return m.reply('❌ *الأمر ده مسموح للمطور بس.*')

    if (!text && !m.quoted) return m.reply('🌌⚠️ *منشن المستخدم او اعمل ريبلاي ع رسالت المستخدم.*')
    

let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
    else who = m.chat
    if (!who) return m.reply('🌌⚠️ *منشن أو اعمل ريبلاي ع رسالته يبني.*')

    let users = global.db.data.users
    if (!users[who]) users[who] = {}

    users[who].banned = false

    await conn.sendMessage(
        m.chat,
        {
            text: `🍃🌌 *لقد تم فك الحظر عن المستخدم @${who.split('@')[0]} يمكنه الان الاستمتاع بجميع مزايا البوت*\n\n❄️ اشكر المطور بق 🌚...`,
            contextInfo: {
                forwardingScore: 200,
                isForwarded: false,
                mentionedJid: [who],
                externalAdReply: {
                    showAdAttribution: false,
                    title: `❗`,
                    body: `✨ مع تحياتي`,
                    mediaType: 2,
                    sourceUrl: global.redes || '',
                    thumbnail: global.icons || null
                }
            }
        },
        { quoted: m }
    )
}

handler.help = ['بانفك <@tag>']
handler.command = ['unbanuser','بانفك','unban']
handler.tags = ['owner']

export default handler