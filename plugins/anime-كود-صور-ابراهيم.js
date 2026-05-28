import axios from "axios"
import fs from 'fs'
import path from 'path'

let handler = async (m, { command, conn }) => {
  try {
    // ✦ جلب صور الأنمي
    let res = (await axios.get(`https://raw.githubusercontent.com/davidprospero123/api-anime/main/BOT-JSON/anime-${command}.json`)).data
    
    // ✦ اختيار صورة عشوائية
    let image = res[Math.floor(Math.random() * res.length)]
    
    // ✦ مجموعة أوصاف فاخرة بأسلوب 𝑊𝐼𝐿𝐿𝐼𝐴𝑀
    let captions = [
      `✧ ${command} ✧\n\n༺ سحرُ الأنمي يتجلّى هنا… حيثُ تلتقي الروعة بالفخامة ༻\n✦ اختيارٌ فاخر بتوقيع 𝑊𝐼𝐿𝐿𝐼𝐴𝑀 👑✨`,
      
      `『 ${command} 』\n\n༺ مشهدٌ من عالمٍ يفوق الخيال… ༻\nتجسيدٌ للجمال بأسلوبٍ راقٍ يحمل توقيع 𝑊𝐼𝐿𝐿𝐼𝐴𝑀 👑`,
      
      `✦ ${command} ✦\n\nتحفة أنمي مختارة بعناية… بذوقٍ يليق بعظمة 𝑊𝐼𝐿𝐿𝐼𝐴𝑀 👑`,
      
      `✧ ${command} ✧\n\n༺ سحر الأنمي في أبهى صوره… ༻\nلمسة فنية فاخرة من 𝑊𝐼𝐿𝐿𝐼𝐴𝑀 ✨`,
      
      `『 ${command} 』\n\nلقطة آسرة تخطف الأنفاس…\nتُقدَّم لك بذوقٍ ملكي من 𝑊𝐼𝐿𝐿𝐼𝐴𝑀 👑`
    ]

    // ✦ اختيار وصف عشوائي
    let caption = captions[Math.floor(Math.random() * captions.length)]

    // ✦ إعداد الصور المصغّرة
    let imgFolder = path.join('./src/img')
    let imgFiles = fs.existsSync(imgFolder)
      ? fs.readdirSync(imgFolder).filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      : []

    let thumbnail = null

    if (imgFiles.length > 0) {
      let imgPath = path.join(imgFolder, imgFiles[Math.floor(Math.random() * imgFiles.length)])
      thumbnail = fs.readFileSync(imgPath)
    }

    // ✦ إرسال الرسالة بأسلوب فاخر
    await conn.sendMessage(
      m.chat,
      {
        image: { url: image },
        caption,
        contextInfo: thumbnail
          ? {
              externalAdReply: {
                mediaType: 2,
                title: "Anime Gallery",
                body: "By 𝑊𝐼𝐿𝐿𝐼𝐴𝑀 👑",
                thumbnail
              }
            }
          : {}
      },
      { quoted: m }
    )

  } catch (e) {
    await conn.sendMessage(
      m.chat,
      { text: `⚠️ تعذّر جلب صور *${command}* حالياً… حاول لاحقاً.` },
      { quoted: m }
    )
    console.error(e)
  }
}

// ✦ الأوامر
handler.command = handler.help = [
  'alisa','aihoshino','remcham','akira','akiyama','anna','asuna','ayuzawa','boruto','chiho','chitoge',
  'deidara','erza','elaina','eba','emilia','hestia','hinata','inori','isuzu','itachi','itori','kaga',
  'kagura','kaori','keneki','kotori','kurumitokisaki','madara','mikasa','miku','minato','naruto',
  'nezuko','sagiri','sasuke','sakura'
]

// ✦ التصنيف
handler.tags = ['anime']

// ✦ يتطلب تسجيل
handler.register = true

export default handler