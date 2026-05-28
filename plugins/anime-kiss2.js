import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
  let who

  if (m.mentionedJid.length > 0) {
    who = m.mentionedJid[0]
  } else if (m.quoted) {
    who = m.quoted.sender
  } else {
    who = m.sender
  }

  let name = conn.getName(who)
  let name2 = conn.getName(m.sender)
  m.react('🏳️‍🌈')

  let str
  if (m.mentionedJid.length > 0) {
    str = `\`${name2}\` *أقبّل بحماس* \`${name || who}\`.`
  } else if (m.quoted) {
    str = `\`${name2}\` *قبلة عاطفية* \`${name || who}\`.`
  } else {
    str = `\`${name2}\` *بيقبل/بتقبل نفس الجنس عشان هو/ي شاذ/ه.*`.trim()
  }

  if (m.isGroup) {
    // قائمة الفيديوهات المتاحة
    const videos = [
      'https://files.catbox.moe/0p0gsn.mp4',
      'https://files.catbox.moe/me6rsr.mp4',
      'https://files.catbox.moe/untes1.mp4',
      'https://files.catbox.moe/8af0gd.mp4',
      'https://files.catbox.moe/z27nnd.mp4',
      'https://files.catbox.moe/c5fxap.mp4',
      'https://files.catbox.moe/2c3ejd.mp4'
    ]

    // اختيار عشوائي
    const video = videos[Math.floor(Math.random() * videos.length)]

    let mentions = [who]
    await conn.sendMessage(
      m.chat,
      { video: { url: video }, gifPlayback: true, caption: str, mentions },
      { quoted: m }
    )
  }
}

handler.help = ['قبله2 @tag']
handler.tags = ['anime']
handler.command = ['kiss2', 'besar2','قبله2','قبلها2','قبل2','بوسه2','بوس2','بوسها2']
handler.group = true

export default handler