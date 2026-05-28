import ws from "ws"
import axios from "axios"
import { generateWAMessageContent, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

const handler = async (m, { conn, command, usedPrefix }) => {
  try {
    const users = [
      global.conn.user.jid,
      ...new Set(
        global.conns
          .filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)
          .map((conn) => conn.user.jid)
      )
    ]

    function convertirMsADiasHorasMinutosSegundos(ms) {
      const segundos = Math.floor(ms / 1000)
      const minutos = Math.floor(segundos / 60)
      const horas = Math.floor(minutos / 60)
      const días = Math.floor(horas / 24)
      const segRest = segundos % 60
      const minRest = minutos % 60
      const horasRest = horas % 24
      let resultado = ""
      if (días) resultado += `${días}ي `
      if (horasRest) resultado += `${horasRest}س `
      if (minRest) resultado += `${minRest}د `
      if (segRest) resultado += `${segRest}ث`
      return resultado.trim() || 'أقل من ثانية'
    }

    const subBotsActivos = users.filter(jid => jid !== global.conn.user.jid)

    let cards = []
    let counter = 1

    for (let botJid of subBotsActivos) {
      const v = global.conns.find((conn) => conn.user.jid === botJid)
      const uptime = v?.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : "نشط منذ الآن"
      const mention = botJid.replace(/[^0-9]/g, '')
      const botNumber = botJid.split('@')[0]
      const botName = v?.user?.name || `بوت فرعي ${counter}`

      const imageBuffer = (await axios.get("https://raw.githubusercontent.com/B7R-X/UPLOADS-B7R/main/uploads/file-1774206252035.jpeg", { responseType: 'arraybuffer' })).data
      const { imageMessage } = await generateWAMessageContent({ image: imageBuffer }, { upload: conn.waUploadToServer })

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: `🪴 بوت فرعي ${counter}\n🌱 الاسم: ${botName}\n🍄 مدة التشغيل: ${uptime}` }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "✨ استخدم الزر للتفاعل" }),
        header: proto.Message.InteractiveMessage.Header.fromObject({ title: `ID: wa.me/${botNumber}?text=.menu`, hasMediaAttachment: true, imageMessage }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: "كن بوت فرعي",
                id: ".code"
              })
            },
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "القناة الرسمية",
                url: "https://whatsapp.com/channel/0029Va8Y2DcLY6dENF4Jry0u"
              })
            }
          ]
        })
      })
      counter++
    }

    const messageContent = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({ text: `🌴 البوتات الفرعية النشطة: ${subBotsActivos.length}/20` }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: "اختر بوت فرعي من القائمة 🌿" }),
            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })
          })
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, messageContent.message, { messageId: messageContent.key.id })

  } catch (error) {
    m.reply(`⚠︎ حدث خطأ.\n> تواصل مع المسؤول إذا استمرت المشكلة.\n\nتفاصيل الخطأ: ${error.message}`)
  }
}

handler.tags = ["serbot"]
handler.help = ["فرعي"]
handler.command = ["فرعي", "بوتات", "bots"]

export default handler