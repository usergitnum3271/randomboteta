let handler = async (m, { conn, usedPrefix, command }) => {
if (!m.quoted) {
return conn.reply(m.chat, `ꕤ يجب عليك الرد على ملصق لتحويله إلى صورة.`, m, rcanal)
}
await m.react('🕒')
let xx = m.quoted
let imgBuffer = await xx.download()   
if (!imgBuffer) {
await m.react('✖️')
return conn.reply(m.chat, `✩ تعذر معالجة الملصق.`, m)
}
await conn.sendMessage(m.chat, { image: imgBuffer, caption: '✿ *تفضل :D*' }, { quoted: m })
await m.react('✔️')
}

handler.help = ['لصورة']
handler.tags = ['herramientas']
handler.command = ['لصورة', 'jpg', 'img'] 
//handler.coin = 14

export default handler