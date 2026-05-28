let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'))

let handler = async (m, { conn, usedPrefix }) => {
let quoted = m.quoted
if (!quoted) return conn.reply(m.chat, `> ❐ يرجى الرد على رسالة عرض لمرة واحدة "ViewOnce" لعرض محتواها.`, m)
try {
await m.react('🕒')
let viewOnceMessage = quoted.viewOnce ? quoted : quoted.mediaMessage?.imageMessage || quoted.mediaMessage?.videoMessage || quoted.mediaMessage?.audioMessage
let messageType = viewOnceMessage.mimetype || quoted.mtype
let stream = await downloadContentFromMessage(viewOnceMessage, messageType.split('/')[0])    
if (!stream) return conn.reply(m.chat, `✦ عذرًا، تعذر تحميل المحتوى.`, m)  
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
if (messageType.includes('video')) {
await conn.sendMessage(m.chat, { video: buffer, caption: viewOnceMessage.caption || '', mimetype: 'video/mp4' }, { quoted: m })
} else if (messageType.includes('image')) {
await conn.sendMessage(m.chat, { image: buffer, caption: viewOnceMessage.caption || '' }, { quoted: m })
} else if (messageType.includes('audio')) {
await conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: viewOnceMessage.ptt || false }, { quoted: m })  
}
await m.react('✔️')
} catch (e) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ حدثت مشكلة.\n> استخدم *${usedPrefix}report* للإبلاغ عنها.\n\n${e.message}`, m)
}}

handler.help = ['فضح']
handler.tags = ['herramientas']
handler.command = ['افضحو', 'افضحوهم', 'افضحهم', 'فضح']
//handler.coin = 52

export default handler