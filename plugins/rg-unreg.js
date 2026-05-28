let handlerUnreg = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  const pp = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://files.catbox.moe/v5leic.jpg')

  if (!user.registered) {
    return m.reply('『⚠️』 لا يوجد أي نظام مرتبط بك...')
  }

  user.registered = false
  user.name = ''
  user.age = 0

  // رسالة بأسلوب مورياتي
  await conn.sendMessage(m.chat, {
    text: `🗑️ تم حذفك من النظام...`,
    contextInfo: {
      externalAdReply: {
        title: '𝐑𝐄𝐌 ✰ 𝐁𝐎𝐓',
        body: 'BY : 𝐁𝟕𝐑ｼ',
        thumbnailUrl: pp,
        sourceUrl: 'https://whatsapp.com/channel/0029Va8Y2DcLY6dENF4Jry0u',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })

  // مستند بأسلوب مورياتي
  await conn.sendMessage(m.chat, {
    document: { url: 'https://files.catbox.moe/4vjomv.jpg' },
    mimetype: 'application/pdf',
    fileName: '🚮 ملف محذوف',
    caption: '『📜』 تم حذف السجل من النظام بالكامل...'
  }, { quoted: m })
}

handlerUnreg.help = ['حذف-تسجيل']
handlerUnreg.tags = ['rg']
handlerUnreg.command = ['حذف-تسجيل', 'borrarregistro', 'delreg']

export default handlerUnreg