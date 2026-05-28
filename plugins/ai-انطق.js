import fetch from 'node-fetch'
import { spawn } from 'child_process'
function toOpus(buffer) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', 'pipe:0',
      '-vn',
      '-c:a', 'libopus',
      '-b:a', '128k',
      '-f', 'ogg',
      'pipe:1'
    ])

    let data = []
    ffmpeg.stdout.on('data', chunk => data.push(chunk))
    ffmpeg.stderr.on('data', () => {}) 
    ffmpeg.on('close', () => resolve(Buffer.concat(data)))
    ffmpeg.on('error', reject)

    ffmpeg.stdin.write(buffer)
    ffmpeg.stdin.end()
  })
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❌ اكتب الكلام بعد كلمة "انطق"')

  try {
    const channelId = global.config?.cenel?.id || '120363158797567045@newsletter'
    const channelName = global.config?.cenel?.name || '◜𝐑𝐄𝐌┊🎈┊𝐂𝐇𝐀𝐍𝐍𝐄𝐋◞'
    const thumbnailUrl = global.config?.img?.nekobot || 'https://files.catbox.moe/nrxlve.jpg'

    const senderId = m.sender.split('@')[0]

    const fk = {
      key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', id: 'Rem' },
      message: {
        contactMessage: {
          displayName: '𝐑𝐄𝐌 ✰ 𝐁𝐎𝐓',
          vcard: `BEGIN:VCARD
VERSION:3.0
FN:Anya Bot
item1.TEL;waid=${senderId}:${senderId}
END:VCARD`
        }
      }
    }
    let url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ar&client=tw-ob`

    let res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    let buff = await res.buffer()
    let opus = await toOpus(buff)

    await conn.sendMessage(m.chat, {
      audio: opus,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 9999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelId,
          serverMessageId: 20,
          newsletterName: channelName
        },
        externalAdReply: {
          title: "◜𝐑𝐄𝐌┊🇵🇱┊𝐂𝐇𝐀𝐍𝐍𝐄𝐋◞",
          body: "BY : 𝐁𝟕𝐑ｼ",
          thumbnailUrl: thumbnailUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fk })

  } catch (e) {
    console.log(e)
    m.reply('❌ الصوت مشتغلش')
  }
}

handler.command = ['انطق','speak']
handler.help = ['انطق']
handler.tags = ['ai']
export default handler