import { WAMessageStubType } from '@whiskeysockets/baileys'
import { createCanvas, loadImage } from 'canvas'

export async function before(m, { conn, groupMetadata }) {
  if (!m.isGroup || !m.messageStubType) return true

  const b7r = 'B7R'

  const fkontak = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      contactMessage: {
        vcard:
          `BEGIN:VCARD\n` +
          `VERSION:3.0\n` +
          `FN:${b7r}\n` +
          `TEL;type=CELL;type=VOICE;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\n` +
          `END:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }

  const stubParams = m.messageStubParameters || []
  if (!Array.isArray(stubParams) || !stubParams.length) return true

  let chat = global.db.data.chats[m.chat] || {}
  if (typeof chat.welcome === 'undefined') chat.welcome = true
  if (!chat.welcome) return true

  const userJid = stubParams[0]
  const username = userJid.split('@')[0]
  const mention = '@' + username

  const memberCount =
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
      ? (groupMetadata.participants?.length || 1) - 1
      : groupMetadata.participants?.length || 0

  // صورة البروفايل
  let avatarUrl
  try {
    avatarUrl = await conn.profilePictureUrl(userJid, 'image')
  } catch {
    avatarUrl = 'https://i.imgur.com/8B4QYQY.png'
  }

  // بناء الصورة
  async function buildDiscordImage(type) {
    const W = 900
    const H = 420

    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0, '#1e1f22')
    bg.addColorStop(1, '#111214')

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Card
    const cardX = 40
    const cardY = 40
    const cardW = 820
    const cardH = 340
    const radius = 28

    ctx.fillStyle = '#2b2d31'

    ctx.beginPath()
    ctx.moveTo(cardX + radius, cardY)
    ctx.lineTo(cardX + cardW - radius, cardY)
    ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius)
    ctx.lineTo(cardX + cardW, cardY + cardH - radius)
    ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH)
    ctx.lineTo(cardX + radius, cardY + cardH)
    ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius)
    ctx.lineTo(cardX, cardY + radius)
    ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY)
    ctx.closePath()
    ctx.fill()

    // Top Bar
    ctx.fillStyle =
      type === 'welcome'
        ? '#5865F2'
        : '#ED4245'

    ctx.fillRect(cardX, cardY, cardW, 85)

    // Avatar
    const avatarSize = 150
    const avatarX = 75
    const avatarY = 130

    try {
      const avatarImg = await loadImage(avatarUrl)

      ctx.save()

      ctx.beginPath()
      ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
      )

      ctx.closePath()
      ctx.clip()

      ctx.drawImage(
        avatarImg,
        avatarX,
        avatarY,
        avatarSize,
        avatarSize
      )

      ctx.restore()

      // Neon Border
      ctx.shadowColor = '#5865F2'
      ctx.shadowBlur = 25

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 6

      ctx.beginPath()
      ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2 + 4,
        0,
        Math.PI * 2
      )

      ctx.stroke()

      ctx.shadowBlur = 0

    } catch (e) {
      console.log(e)
    }

    // Status Circle
    ctx.fillStyle = '#23a55a'

    ctx.beginPath()
    ctx.arc(
      avatarX + avatarSize - 18,
      avatarY + avatarSize - 18,
      18,
      0,
      Math.PI * 2
    )

    ctx.fill()

    // Text
    ctx.direction = 'ltr'
    ctx.textAlign = 'left'

    const textX = 280

    // Title
    ctx.font = 'bold 42px Sans'
    ctx.fillStyle = '#ffffff'

    ctx.fillText(
      type === 'welcome'
        ? 'WELCOME'
        : 'GOODBYE',
      textX,
      170
    )

    // Username
    ctx.font = 'bold 34px Sans'
    ctx.fillStyle =
      type === 'welcome'
        ? '#5865F2'
        : '#ED4245'

    ctx.fillText(
      username,
      textX,
      220
    )

    // Server
    ctx.font = '24px Sans'
    ctx.fillStyle = '#dbdee1'

    let groupName = groupMetadata.subject
    if (groupName.length > 28)
      groupName = groupName.slice(0, 28) + '...'

    ctx.fillText(
      `Server: ${groupName}`,
      textX,
      270
    )

    // Members
    ctx.font = '22px Sans'
    ctx.fillStyle = '#949ba4'

    ctx.fillText(
      `Members: ${memberCount}`,
      textX,
      315
    )

    // Footer
    ctx.font = '18px Sans'
    ctx.fillStyle = '#80848e'
    ctx.textAlign = 'center'

    ctx.fillText(
      `Powered by ${b7r}`,
      W / 2,
      H - 25
    )

    return canvas.toBuffer('image/png')
  }

  // Welcome
  if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_INVITE
  ) {

    const defaultWelcome =
      `👋 اهلا يا ${mention}\n\n` +
      `📌 المجموعة: ${groupMetadata.subject}\n` +
      `👥 عدد الاعضاء الان: ${memberCount}\n\n` +
      `استمتع بوقتك معنا ✨`

    const welcomeText = (chat.welcomeText || defaultWelcome)
      .replace('@user', mention)
      .replace('@subject', groupMetadata.subject)

    const img = await buildDiscordImage('welcome')

    await conn.sendMessage(
      m.chat,
      {
        image: img,
        caption: welcomeText,
        mentions: [userJid]
      },
      { quoted: fkontak }
    )
  }

  // Goodbye
  else if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
  ) {

    const defaultBye =
      `👋 مع السلامه ${mention}\n\n` +
      `لا تعود هنا مرة اخرى.\n` +
      `👥 عدد الاعضاء الان: ${memberCount}`

    const byeText = (chat.byeText || defaultBye)
      .replace('@user', mention)
      .replace('@subject', groupMetadata.subject)

    const img = await buildDiscordImage('goodbye')

    await conn.sendMessage(
      m.chat,
      {
        image: img,
        caption: byeText,
        mentions: [userJid]
      },
      { quoted: fkontak }
    )
  }

  return true
}