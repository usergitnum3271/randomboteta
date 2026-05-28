import { createHash } from 'crypto'

const SelloMistico = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender)
  const pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://files.catbox.moe/2oj0as.jpg')
  const user = global.db.data.users[m.sender]
  const name2 = conn.getName(m.sender)

  if (user.registered) {
    return conn.sendMessage(m.chat, {
      text: `لقد تم تسجيلك بنجاح اذا اردت حذف التسجيل الخاص بك\n\n${usedPrefix}حذف-تسجيل`,
      buttons: [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '📜 العودة إلى القائمة' }, type: 1 },
        { buttonId: `${usedPrefix}حذف-تسجيل`, buttonText: { displayText: '♟️ حذف التسجيل' }, type: 1 }
      ],
      headerType: 1
    }, { quoted: m })
  }

  if (!SelloMistico.test(text)) {
    return m.reply(`『⚠️』 إدخالك غير دقيق...\n\n✧ الصيغة المطلوبة: *${usedPrefix + command} الاسم.العمر*\n✧ مثال: *${usedPrefix + command} ${name2}.18*`)
  }

  let [_, name, __, age] = text.match(SelloMistico)
  age = parseInt(age)

  if (age > 60) {
    return m.reply("عجوز جدآ لا نقبل العجائز🕊️")
  }
  if (age >= 1 && age <= 5) {
    return m.reply("لا يمكن للأطفال ان نقبلها 👺")
  }
  if (isNaN(age) || age < 6) {
    return m.reply("يجب ان يكون عمرك كبير ")
  }

  user.name = `${name}`
  user.age = age
  user.regTime = +new Date()
  user.registered = true

  const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
/*╭─「 🕴️ نظام مورياتي 」─╮
│ ✧ *الاسم:* ${name}
│ ✧ *العمر:* ${age} سنة
│ ✧ *الرمز الفريد:* ${sn}
│
├─ ملاحظة:
│ ♟️ تم إدخالك إلى اللعبة بنجاح.
│ 🧠 استخدم ذكاءك… فكل خطوة محسوبة.
│ 📜 لرؤية ملفك: *.بروفايل*
│
╰─「 Moriarty Network 」─╯*/
  const certificadoPacto = `
╭──⧼ استمارة التسجيل 📁⧽
│┃👤 الاسم • ${name}
│┃⏲️ العمر • ${age} سنة
│┃🍧 رمزك • ${sn}
╰─────────────❏
`.trim()

  await m.react('🧠')

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: certificadoPacto,
    buttons: [
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '📜 القائمة' }, type: 1 },
      { buttonId: `${usedPrefix}profile ${m.sender}`, buttonText: { displayText: '📊 ملفي' }, type: 1 }
    ],
    headerType: 4,
    contextInfo: {
      externalAdReply: {
        title: '𝐑𝐄𝐌 ✰ 𝐁𝐎𝐓',
        body: 'BY : 𝐁𝟕𝐑ｼ',
        thumbnailUrl: pp,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })

  await conn.sendMessage(m.chat, {
    document: { url: 'https://files.catbox.moe/2oj0as.jpg' }, 
    mimetype: 'application/pdf', 
    fileName: 'تم حفظ بياناتك 🔒',
    caption: '『📜』 تم تسجيلك داخل النظام بنجاح...'
  }, { quoted: m })
}

handler.help = ['تسجيل']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'تسجيل', 'register', 'registrar']

export default handler