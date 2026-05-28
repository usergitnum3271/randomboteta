const handler = async (m, { conn, text, command, usedPrefix }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`)
}
const users = global.db.data.users[m.sender]
if (!text) return conn.reply(m.chat, `ꕥ لازم تدخل مبلغ من *${currency}* وتراهن على لون.\n> مثال: *${usedPrefix + command} 2500 احمر*`, m)
let args = text.trim().split(" ")
if (args.length !== 2) return conn.reply(m.chat, `❗ꕥ صيغة غير صحيحة. لازم تدخل مبلغ من *${currency}* وتراهن على لون.\n> مثال: *${usedPrefix + command} 2500 احمر* 🎯`, m)
let coin = parseInt(args[0])
let color = args[1].toLowerCase()
if (isNaN(coin) || coin <= 0) return conn.reply(m.chat, `⚠️ ꕥ من فضلك، أدخل مبلغ صحيح للمراهنة 💰`, m)
if (!(color === 'اسود' || color === 'احمر')) return conn.reply(m.chat, `🎯 ꕥ لازم تراهن على لون صحيح: *اسود* أو *احمر* 🎨`, m)
if (coin > users.coin) return conn.reply(m.chat, `💸 ꕥ معندكش عملات كفاية *${currency}* عشان تعمل الرهان ده 😢`, m)
const resultColor = Math.random() < 0.5 ? 'اسود' : 'احمر'
const win = color === resultColor
if (win) {
users.coin += coin
conn.reply(m.chat, `「✿」الروليت وقفت على *${resultColor}* 🎉 وكسبت *¥${coin.toLocaleString()} ${currency}*! 💰`, m)
} else {
users.coin -= coin
conn.reply(m.chat, `「✿」الروليت وقفت على *${resultColor}* 😢 وخسرت *¥${coin.toLocaleString()} ${currency}*! 💸`, m)
}}

handler.tags = ['economy']
handler.help = ['روليت']
handler.command = ['روليت', 'roulette', 'الروليت']
handler.group = true

export default handler