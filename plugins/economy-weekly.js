var handler = async (m, { conn, usedPrefix }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) return m.reply(`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`)

let user = global.db.data.users[m.sender]
const gap = 604800000
const now = Date.now()
user.weeklyStreak = user.weeklyStreak || 0
user.lastWeeklyGlobal = user.lastWeeklyGlobal || 0
user.coin = user.coin || 0
user.exp = user.exp || 0
user.lastweekly = user.lastweekly || 0
if (now < user.lastweekly) {
const wait = formatTime(Math.floor((user.lastweekly - now) / 1000))
return conn.reply(m.chat, `🎁 أنت بالفعل استلمت جائزتك الأسبوعية.
> يمكنك استلامها مرة أخرى بعد *${wait}*`, m)
}
const lost = user.weeklyStreak >= 1 && now - user.lastWeeklyGlobal > gap * 1.5
if (lost) user.weeklyStreak = 0
const canClaimWeeklyGlobal = now - user.lastWeeklyGlobal >= gap
if (canClaimWeeklyGlobal) {
user.weeklyStreak = Math.min(user.weeklyStreak + 1, 30)
user.lastWeeklyGlobal = now
}
const coins = Math.min(40000 + (user.weeklyStreak - 1) * 5000, 185000)
const expRandom = Math.floor(Math.random() * (200 - 50 + 1)) + 50
user.coin += coins
user.exp += expRandom
user.lastweekly = now + gap
let nextReward = Math.min(40000 + user.weeklyStreak * 5000, 185000).toLocaleString()
let msg = `> أسبوع *${user.weeklyStreak + 1}* » *+¥${nextReward}*`
if (lost) msg += `\n> ☆ لقد خسرت سلسلة أسابيعك! 💔`
conn.reply(m.chat, `「❁」 لقد استلمت جائزتك الأسبوعية بقيمة *¥${coins.toLocaleString()} ${currency}* (الأسبوع *${user.weeklyStreak}*)\n${msg}`, m)
}

handler.help = ['اسبوعي']
handler.tags = ['economy']
handler.command = ['weekly', 'اسبوعي']
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