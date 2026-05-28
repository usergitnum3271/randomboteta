const handler = async (m, { conn, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`❌《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة 😴\n\n🛠️ يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:\n» *${usedPrefix}economy on* ✅`)
}
const user = global.db.data.users[m.sender]
user.lastrob = user.lastrob || 0
if (Date.now() < user.lastrob) {
const restante = user.lastrob - Date.now()
return conn.reply(m.chat, `⏳ ꕥ لازم تنتظر *${formatTime(restante)}* قبل ما تستخدم الأمر *${usedPrefix + command}* مرة تانية 🔁`, m)
}
let who = (m.mentionedJid && m.mentionedJid.length) 
          ? m.mentionedJid[0] 
          : (m.quoted && m.quoted.sender) 
            ? m.quoted.sender 
            : null
if (!who) return conn.reply(m.chat, `❗ ꕥ لازم تعمل منشن لشخص عشان تحاول تسرق منه 🕵️‍♂️💰`, m)
if (!(who in global.db.data.users)) {
return conn.reply(m.chat, `❌ ꕥ المستخدم مش موجود في قاعدة بياناتي 📂`, m)
}
let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
const target = global.db.data.users[who]
const tiempoInactivo = Date.now() - (target.lastwork || 0)
if (tiempoInactivo < 3600000) {
return conn.reply(m.chat, `⏳ ꕥ تقدر تسرق *${currency}* من أي مستخدم بس لو كان غير نشط أكتر من ساعة 🕒`, m)
}
const rob = Math.floor(Math.random() * 1001) + 2000
if (target.coin < rob) {
return conn.reply(m.chat, `💸 ꕥ *${name}* ماعندوش كفاية من *${currency}* برا البنك عشان يستاهل تحاول تسرقه 😅`, m, { mentions: [who] })
}
user.coin += rob
target.coin -= rob
user.lastrob = Date.now() + 7200000
conn.reply(m.chat, `💰 ❀ سرقت *¥${rob.toLocaleString()} ${currency}* من *${name}* 😎`, m, { mentions: [who] })
}

handler.help = ['اسرق @tag']
handler.tags = ['economy']
handler.command = ['اسرق', 'steal', 'rob','سرقه']
handler.group = true

export default handler

function formatTime(ms) {
const totalSec = Math.ceil(ms / 1000)
const hours = Math.floor(totalSec / 3600)
const minutes = Math.floor((totalSec % 3600) / 60)
const seconds = totalSec % 60
const parts = []
if (hours) parts.push(`${hours} ساعة`)
if (minutes) parts.push(`${minutes} دقيقة`)
parts.push(`${seconds} ثانية`)
return parts.join(' ')
}