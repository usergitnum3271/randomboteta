import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { conn, args }) => {
let loadingMsg = null

try {
if (!args[0]) {
await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
return m.reply('📌 الرابط غير صالح')
}

let pinterestUrl = args[0]

await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } })
loadingMsg = await m.reply('جاري التحميل...')

const forwardedInfo = {
forwardingScore: 9999,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: '120363158797567045@newsletter',
serverMessageId: 777,
newsletterName: '◜𝐑𝐄𝐌┊🎈┊𝐂𝐇𝐀𝐍𝐍𝐄𝐋◞'
}
}

let senderId = m.sender.replace(/[^0-9]/g, '')
const fk = {  
key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', id: 'rem' },  
message: {  
contactMessage: {  
displayName: '◜𝐑𝐄𝐌┊🍓┊𝐁𝐎𝐓◞',  
vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:rem Bot\nitem1.TEL;waid=${senderId}:${senderId}\nEND:VCARD`  
}  
}  
}

let { csrfToken, cookies } = await getSnappinToken()
let { data } = await axios.post('https://snappin.app/', { url: pinterestUrl }, {
headers: {
'Content-Type': 'application/json',
'x-csrf-token': csrfToken,
Cookie: cookies,
Referer: 'https://snappin.app',
Origin: 'https://snappin.app',
'User-Agent': 'Mozilla/5.0'
}
})

let $ = cheerio.load(data)
let downloadLinks = $('a.button.is-success').map((_, el) => $(el).attr('href')).get()

if (!downloadLinks.length) {
await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
if (loadingMsg) await conn.sendMessage(m.chat, { delete: loadingMsg.key })
return m.reply('📌 الرابط غير صالح')
}

let mediaUrl = null
for (let link of downloadLinks) {
let fullLink = link.startsWith('http') ? link : 'https://snappin.app' + link
let head = await axios.head(fullLink).catch(() => null)
let contentType = head?.headers?.['content-type'] || ''

if (contentType.includes('video')) {
mediaUrl = { url: fullLink, type: 'video' }
break
} else if (contentType.includes('image')) {
mediaUrl = { url: fullLink, type: 'image' }
}
}

if (!mediaUrl) {
await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
if (loadingMsg) await conn.sendMessage(m.chat, { delete: loadingMsg.key })
return m.reply('📌 الرابط غير صالح')
}

if (mediaUrl.type === 'video') {
await conn.sendMessage(m.chat, { 
video: { url: mediaUrl.url }, 
caption: 'تم تحميل الفيديو 📽️',
contextInfo: forwardedInfo
}, { quoted: fk })
} else {
await conn.sendMessage(m.chat, { 
image: { url: mediaUrl.url }, 
caption: 'تم تحميل الصورة 🖼️',
contextInfo: forwardedInfo
}, { quoted: fk })
}

await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
if (loadingMsg) await conn.sendMessage(m.chat, { delete: loadingMsg.key })

} catch (e) {
await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
if (loadingMsg) await conn.sendMessage(m.chat, { delete: loadingMsg.key })
m.reply('حصل خطأ ❌\n\n' + e.message)
}
}

async function getSnappinToken() {
let { headers, data } = await axios.get('https://snappin.app/')
let cookies = headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || ''
let $ = cheerio.load(data)
let csrfToken = $('meta[name="csrf-token"]').attr('content') || ''
return { csrfToken, cookies }
}

handler.help = ['بينتر <رابط الفيد\لصوره>']
handler.command = ['بينتر','Pinter']
handler.tags = ['download']
export default handler