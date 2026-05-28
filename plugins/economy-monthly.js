var handler = async (m, { conn, usedPrefix }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) return m.reply(`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`)

let user = global.db.data.users[m.sender]
const gap = 2592000000
const now = Date.now()
user.monthlyStreak = user.monthlyStreak || 0
user.lastMonthlyGlobal = user.lastMonthlyGlobal || 0
user.coin = user.coin || 0
user.exp = user.exp || 0
user.lastmonthly = user.lastmonthly || 0
if (now < user.lastmonthly) {
const wait = formatTime(Math.floor((user.lastmonthly - now) / 1000))
return conn.reply(m.chat, `ꕥ لقد استلمت مكافأتك الشهرية بالفعل 🎁
> يمكنك استلامها مرة أخرى بعد *${wait}* ⏳`, m)
}
const lost = user.monthlyStreak >= 1 && now - user.lastMonthlyGlobal > gap * 1.5
if (lost) user.monthlyStreak = 0
const canClaimGlobal = now - user.lastMonthlyGlobal >= gap
if (canClaimGlobal) {
user.monthlyStreak = Math.min(user.monthlyStreak + 1, 8)
user.lastMonthlyGlobal = now
}
const coins = Math.min(60000 + (user.monthlyStreak - 1) * 5000, 95000)
const expRandom = Math.floor(Math.random() * (500 - 100 + 1)) + 100
user.coin += coins
user.exp += expRandom
user.lastmonthly = now + gap
let next = Math.min(60000 + user.monthlyStreak * 5000, 95000).toLocaleString()
let msg = `> الشهر *${user.monthlyStreak + 1}* » *+${next}*`
if (lost) msg += `\n> ☆ لقد خسرت سلسلة الأشهر الخاصة بك 💔`
conn.reply(m.chat, `「❁」 لقد استلمت مكافأتك الشهرية بقيمة *+${coins.toLocaleString()} ${currency}* (الشهر *${user.monthlyStreak}*) 🎁\n${msg}`, m)
}

handler.help = ['شهري']
handler.tags = ['economy']
handler.command = ['monthly', 'شهري']
handler.group = true

export default handler

function formatTime(t) {
const d = Math.floor(t / 86400)
const h = Math.floor((t % 86400) / 3600)
const m = Math.floor((t % 3600) / 60)
const s = t % 60
if (d) return `${d} يوم ${h} ساعة ${m} دقيقة`
if (h) return `${h} ساعة ${m} دقيقة ${s} ثانية`
if (m) return `${m} دقيقة ${s} ثانية`
return `${s} ثانية`
}