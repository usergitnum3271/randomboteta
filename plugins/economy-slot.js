import { delay } from "@whiskeysockets/baileys"

const handler = async (m, { args, usedPrefix, command, conn }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`)
}
const users = global.db.data.users[m.sender]
if (!args[0] || isNaN(args[0]) || parseInt(args[0]) <= 0) {
return m.reply(`❗ من فضلك، ادخل المبلغ الذي تريد المراهنة به.`)
}
const apuesta = parseInt(args[0])
if (Date.now() - users.lastslot < 10000) {
const restante = users.lastslot + 10000 - Date.now()
return m.reply(`⏳ لازم تنتظر *${formatTime(restante)}* قبل ما تستخدم الأمر *${usedPrefix + command}* مرة تانية.`)
}
if (apuesta < 100) return m.reply(`💰 الحد الأدنى للمراهنة هو 100 *${currency}*.`)
if (users.coin < apuesta) return m.reply(`❌ عملاتك *${currency}* غير كافية للمراهنة بهذا المبلغ.`)
const emojis = ['✾', '❃', '❁']
const getRandomEmojis = () => {
const x = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])
const y = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])
const z = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)])
return { x, y, z }
}
const initialText = '「✿」| *رهان* \n────────\n'
let { key } = await conn.sendMessage(m.chat, { text: initialText }, { quoted: m })
const animateSlots = async () => {
for (let i = 0; i < 5; i++) {
const { x, y, z } = getRandomEmojis()
const animationText = `「✿」| *رهان* 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────`
await conn.sendMessage(m.chat, { text: animationText, edit: key }, { quoted: m })
await delay(300)
}}
await animateSlots()
const { x, y, z } = getRandomEmojis()
let resultado
if (x[0] === y[0] && y[0] === z[0]) {
resultado = `❀ لقد فزت! *¥${(apuesta * 2).toLocaleString()} ${currency}*.`
users.coin += apuesta
} else if (x[0] === y[0] || x[0] === z[0] || y[0] === z[0]) {
resultado = `❀ كدت تنجح! *خذ ¥10 ${currency}* مقابل المحاولة. 🎉`
users.coin += 10
} else {
resultado = `❌ خسرت *¥${apuesta.toLocaleString()} ${currency}* 😢`
users.coin -= apuesta
}
users.lastslot = Date.now()
const finalText = `「✿」| *رهان* 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────
${resultado}`
await conn.sendMessage(m.chat, { text: finalText, edit: key }, { quoted: m })
}

handler.help = ['رهان']
handler.tags = ['economy']
handler.command = ['slot','رهان','راهن']
handler.group = true

export default handler

function formatTime(ms) {
const totalSec = Math.ceil(ms / 1000)
const minutes = Math.floor((totalSec % 3600) / 60)
const seconds = totalSec % 60
const parts = []
if (minutes > 0) parts.push(`${minutes} دقيقة`)
parts.push(`${seconds} ثانية`)
return parts.join(' ')
  }