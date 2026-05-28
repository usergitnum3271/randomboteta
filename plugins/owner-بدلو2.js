import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prepareWAMessageMedia } from '@whiskeysockets/baileys'

// لتحديد المسار الحالي
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// كاش مؤقت لتخزين بيانات التبديل
const replaceCache = {}

let handler = async (m, { conn, text }) => {
  const allowedNumbers = [
"212726312195"
]

const sender = m.sender.replace(/[^0-9]/g, '')

if (!allowedNumbers.includes(sender)) {
  return m.reply('❌ هذا الأمر المطور فقط.')
}

  if (!text.includes('|'))
    return m.reply('❌ الصيغة خطأ.\nاستخدم: `.بدلو2 الكلمة القديمة | الكلمة الجديدة`')

  const [oldText, newText] = text.split('|').map(t => t.trim())
  if (!oldText || !newText)
    return m.reply('⚠️ تأكد أنك كتبت الكلمتين مفصولتين بـ |')

  const pluginsDir = path.join(__dirname, '../plugins')
  const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'))

  let matchedFiles = []
  for (const file of files) {
    const filePath = path.join(pluginsDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    if (content.includes(oldText)) matchedFiles.push(file)
  }

  if (matchedFiles.length === 0)
    return m.reply(`😕 لم يتم العثور على "${oldText}" في أي ملف.`)

  replaceCache[m.sender] = { oldText, newText }

  const imageUrl = 'https://files.catbox.moe/bff50y.jpg'
  const media = await prepareWAMessageMedia(
    { image: { url: imageUrl } },
    { upload: conn.waUploadToServer }
  )

  const sectionRows = matchedFiles.map(file => ({
    header: '📂 ملف قابل للتعديل',
    title: file,
    id: `.نفذ_التبديل ${file}`
  }))

  const menu = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: `✨ تم العثور على ${matchedFiles.length} ملف يحتوي على "${oldText}"\nاختر الملف الذي تريد تعديل الكلمة فيه 🔧`
          },
          footer: { text: 'toola' },
          header: {
            hasMediaAttachment: true,
            imageMessage: media.imageMessage
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                  title: '📁 الملفات المطابقة',
                  sections: [
                    {
                      title: 'اختر الملف الذي تريد التبديل فيه 🛠️',
                      highlight_label: '✉️',
                      rows: sectionRows
                    }
                  ]
                })
              }
            ]
          }
        }
      }
    }
  }

  await conn.relayMessage(m.chat, menu, {})
}

handler.command = /^بدلو2$/i
handler.help = ['بدلو2 الكلمة القديمة | الكلمة الجديدة']
handler.tags = ['owner'];

export default handler

//-------------------------------------------------------//
// أمر التنفيذ الفعلي
//-------------------------------------------------------//

let execHandler = async (m, { conn, args }) => {
  const fileName = args[0]
  if (!fileName) return m.reply('⚠️ لم يتم تحديد الملف.')

  const data = replaceCache[m.sender]
  if (!data) return m.reply('❌ لا توجد بيانات محفوظة. استخدم .بدلو2 أولاً.')

  const { oldText, newText } = data
  const filePath = path.join(__dirname, '../plugins', fileName)

  if (!fs.existsSync(filePath))
    return m.reply('❌ الملف غير موجود.')

  let content = fs.readFileSync(filePath, 'utf8')
  if (!content.includes(oldText))
    return m.reply('😕 لا توجد الكلمة في هذا الملف.')

  content = content.replaceAll(oldText, newText)
  fs.writeFileSync(filePath, content, 'utf8')
  delete replaceCache[m.sender]

  const msg = `
╔═══⊱💖⊰═══╗
💫 تم تنفيذ التبديل بنجاح 💫
╚═══⊱💖⊰═══╝

📂 *الملف:* ${fileName}
🔄 *من:* ${oldText}
➡️ *إلى:* ${newText}
`
  await m.reply(msg)
}

execHandler.command = /^نفذ_التبديل$/i


// نسجّل الأمر الثاني ضمن النظام
global.plugins = global.plugins || {}
global.plugins['exec_replace'] = execHandler