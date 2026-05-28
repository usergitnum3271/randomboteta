let handler = async (m, { conn, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* متعطلة في المجموعة دي ❌

👮‍♂️ ممكن *حد من الأدمنز* يفعلها بالأمر ده:
» *${usedPrefix}economy on* ✅`)
}
let user = global.db.data.users[m.sender]
if (!user) return conn.reply(m.chat, `ꕥ المستخدم مش موجود في قاعدة البيانات ❌`, m)
if (user.health >= 100) return conn.reply(m.chat, `❀ صحتك دلوقتي على أقصى حد ❤️`, m)
if (user.coin <= 0) return conn.reply(m.chat, `ꕥ معندكش كفاية من *${currency}* عشان تعالج نفسك 💸🩹`, m)
const faltante = 100 - user.health
const disponible = Math.floor(user.coin / 50)
const curable = Math.min(faltante, disponible)
user.health += curable
user.coin -= curable * 50
user.lastHeal = Date.now()
const info = `❀ انت شفيت ${curable} نقطة${curable !== 1 ? '' : ''} من الصحة ❤️‍🩹
⛁ رصيدك المتبقي: ¥${user.coin.toLocaleString()} ${currency} 💰
♡ صحتك الحالية: ${user.health} 🩺`
await conn.sendMessage(m.chat, { text: info }, { quoted: m })
}

handler.help = ['عالج']
handler.tags = ['economy']
handler.command = ['heal', 'عالج']
handler.group = true

export default handler