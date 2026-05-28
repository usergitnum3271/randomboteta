const handler = async (m, { conn, text, command, usedPrefix }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) return conn.reply(m.chat, `《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`, m)
const user = global.db.data.users[m.sender]
if (!text) return conn.reply(m.chat, `❀ لازم تراهن على كمية صحيحة.\n> مثال » *${usedPrefix + command} 150 (ملك/كتابة).*`, m)
const args = text.trim().split(/\s+/)
if (!args[0] || !args[1]) return conn.reply(m.chat, `❌ صيغة غير صحيحة!  
❗ لازم تحدد المبلغ 💰 وبعده تختار 👑 ملك أو ✍️ كتابة  
> مثال » *${usedPrefix + command} 150 كتابة*`, m)

const cantidad = parseFloat(args[0])
const eleccion = args[1].toLowerCase()
if (isNaN(cantidad)) return conn.reply(m.chat, `❌ كمية غير صالحة!  
🔢 ادخل رقم صحيح.  
> مثال » *${usedPrefix + command} 200 كتابة* ✍️`, m)
if (Math.abs(cantidad) < 100) return conn.reply(m.chat, `⚠️ الحد الأدنى للمراهنة هو *100 ${currency}* 💰`, m)
if (!['ملك', 'كتابة'].includes(eleccion)) return conn.reply(m.chat, `⚠️ اختيار غير صالح. لازم تختار *ملك* 👑 أو *كتابة* 📜.\n> مثال » *${usedPrefix + command} 200 ملك*`, m)
if (cantidad > user.coin) return conn.reply(m.chat, `💸 معندكش كفاية من *${currency}* عشان تراهن، معاك دلوقتي *¥${user.coin.toLocaleString()} ${currency}* فقط.`, m)
const resultado = Math.random() < 0.5 ? 'ملك' : 'كتابة'
const acierto = resultado === eleccion
const cambio = acierto ? cantidad : -cantidad
user.coin += cambio
if (user.coin < 0) user.coin = 0
const mensaje = `「✿」العملة وقعت على *${capitalize(resultado)}* ${acierto ? '🎉 لقد فزت' : '🩸 خسرت'} *¥${Math.abs(cambio).toLocaleString()} ${currency}*!\n> اختيارك كان *${capitalize(eleccion)}*`
return conn.reply(m.chat, mensaje, m)
}

handler.help = ['ملك-كتابة']
handler.tags = ['economy']
handler.command = ['ملك-كتابة', 'كتابة-ملك', 'coinflip', 'flip']
handler.group = true

export default handler

function capitalize(txt) {
return txt.charAt(0).toUpperCase() + txt.slice(1)
}