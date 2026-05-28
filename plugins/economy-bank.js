let handler = async (m, { conn, usedPrefix }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》❌ أوامر *الاقتصاد* متعطّلة في المجموعة دي 😴

👮‍♂️ ممكن *حد من الأدمنز* يفعلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`)
}
let mentionedJid = await m.mentionedJid
let who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : m.sender
let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
if (!(who in global.db.data.users)) return m.reply(`ꕥ المستخدم مش موجود في قاعدة بياناتي ❌`)
let user = global.db.data.users[who]
let coin = user.coin || 0
let bank = user.bank || 0
let total = (user.coin || 0) + (user.bank || 0)
const texto = `> ✿ » الاقتصاد - الرصيد « ✿

ᰔᩚ المستخدم » *${name}*   
⛀ المحفظة » *¥${coin.toLocaleString()} ${currency}*
⚿ البنك » *¥${bank.toLocaleString()} ${currency}*
⛁ الإجمالي » *¥${total.toLocaleString()} ${currency}*

> *لحماية فلوسك، حطها في البنك باستخدام .ايداع*!`
await conn.reply(m.chat, texto, m)
}

handler.help = ['بنك']
handler.tags = ['economy']
handler.command = ['بنك', 'البنك', 'bank'] 
handler.group = true 

export default handler