var handler = async (m, { conn, usedPrefix }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) return m.reply(`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`)

  let user = global.db.data.users[m.sender]

  const gap = 365 * 24 * 60 * 60 * 1000
  const now = Date.now()
  user.yearlyStreak = user.yearlyStreak || 0
  user.lastYearlyGlobal = user.lastYearlyGlobal || 0
  user.coin = user.coin || 0
  user.exp = user.exp || 0
  user.lastyearly = user.lastyearly || 0

  if (now < user.lastyearly) {
    const wait = formatTime(Math.floor((user.lastyearly - now) / 1000))
    return conn.reply(m.chat, `🎁 أنت بالفعل استلمت جائزتك السنوية.
> يمكنك استلامها مرة أخرى بعد *${wait}*`, m)
  }

  const lost = user.yearlyStreak >= 1 && now - user.lastYearlyGlobal > gap * 1.5
  if (lost) user.yearlyStreak = 0

  const canClaim = now - user.lastYearlyGlobal >= gap
  if (canClaim) {
    user.yearlyStreak = Math.min(user.yearlyStreak + 1, 30)
    user.lastYearlyGlobal = now
  }

  const coins = Math.min(500000 + (user.yearlyStreak - 1) * 100000, 5000000)
  const expRandom = Math.floor(Math.random() * (500 - 200 + 1)) + 200

  user.coin += coins
  user.exp += expRandom
  user.lastyearly = now + gap

  let nextReward = Math.min(500000 + user.yearlyStreak * 100000, 5000000).toLocaleString()

  let msg = `> سنة *${user.yearlyStreak + 1}* » *+¥${nextReward}*`
  if (lost) msg += `\n> ☆ لقد خسرت سلسلة السنوات! 💔`

  conn.reply(
    m.chat,
    `「❁」 لقد استلمت جائزتك السنوية بقيمة *¥${coins.toLocaleString()} ${currency}* (السنة *${user.yearlyStreak}*)\n${msg}`,
    m
  )
}

handler.help = ['سنوي']
handler.tags = ['economy']
handler.command = ['yearly', 'سنوي']
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