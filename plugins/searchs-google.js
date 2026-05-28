import fetch from 'node-fetch'

var handler = async (m, { conn, text, args, usedPrefix }) => {
  if (!text) return m.reply(`✩ يرجى إدخال كلمة للبحث في *Google*.\n\nمثال: ${usedPrefix}google قطط مضحكة`)

  await m.react('🕒')

  const apiUrl = `${global.APIs.delirius.url}/search/googlesearch?query=${encodeURIComponent(text)}`
  const maxResults = Number(args[1]) || 3

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('تعذر الاتصال بالـ API')

    const result = await response.json()
    if (!result.status || !Array.isArray(result.data) || !result.data.length) {
      await m.react('✖️')
      return conn.sendMessage(m.chat, { text: 'ꕥ لم يتم العثور على نتائج لهذا البحث.', ...rcanal }, { quoted: m })
    }

    let replyMessage = `「ᜊ」نتائج البحث عن *<${text}>*\n\n`
    result.data.slice(0, maxResults).forEach((item, index) => {
      replyMessage += `> ✐ العنوان » *${index + 1}. ${item.title || 'بدون عنوان'}*\n`
      replyMessage += `> ⴵ الوصف » ${item.description ? `*${item.description}*` : '_بدون وصف_'}\n`
      replyMessage += `> 🜸 الرابط » ${item.url || '_بدون رابط_'}\n\n`
    })

    await conn.sendMessage(m.chat, { text: replyMessage.trim(), ...rcanal }, { quoted: m })
    await m.react('✔️')
  } catch (error) {
    await m.react('✖️')
    await conn.sendMessage(m.chat, { text: `⚠︎ حدث خطأ.\n> استخدم *${usedPrefix}report* للإبلاغ.\n\n${error.message}`, ...rcanal }, { quoted: m })
  }
}

handler.help = ['search']
handler.command = ['بحث', 'جوجل']
handler.group = true
//handler.coin = 15

export default handler