let handler = async (m, { conn, args, participants }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* معطلة في هذه المجموعة.

يمكن *للمشرف* تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on*`)
}
const users = [...new Map(Object.entries(global.db.data.users).map(([jid, data]) => [jid, { ...data, jid }])).values()]
const sorted = users.sort((a, b) => ((b.coin || 0) + (b.bank || 0)) - ((a.coin || 0) + (a.bank || 0)))
const totalPages = Math.ceil(sorted.length / 10)
const page = Math.max(1, Math.min(parseInt(args[0]) || 1, totalPages))
const startIndex = (page - 1) * 10
const endIndex = startIndex + 10
let text = `「✿」المستخدمون الذين لديهم أكبر كمية من *${currency}* هم:\n\n`
const slice = sorted.slice(startIndex, endIndex)
for (let i = 0; i < slice.length; i++) {
const { jid, coin, bank } = slice[i]
const total = (coin || 0) + (bank || 0)
let name = await (async () => global.db.data.users[jid].name.trim() || (await conn.getName(jid).then(n => typeof n === 'string' && n.trim() ? n : jid.split('@')[0]).catch(() => jid.split('@')[0])))()
text += `❐ ${startIndex + i + 1} » *${name}:*\n`
text += `\t\t المجموع→ *¥${total.toLocaleString()} ${currency}*\n`
}
text += `\n> ꕥ الصفحة *${page}* من *${totalPages}*`
await conn.reply(m.chat, text.trim(), m, { mentions: conn.parseMention(text) })
}

handler.help = ['الاغنياء']
handler.tags = ['economy']
handler.command = ['المعرقين', 'لوحه-الاغنياء', 'topmoney', 'اغنياء', 'اغنى', 'الاغنياء']
handler.group = true

export default handler