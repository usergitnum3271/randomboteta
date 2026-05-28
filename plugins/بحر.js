/*╭━━━〔 𝑼𝑷𝑳𝑶𝑨𝑫 𝑭𝑰𝑳𝑬𝑺 〕━━━╮
│ 👑 الـمـطـور ↜ 𝐁𝟕𝐑ｼ
│ 🌾 قــنــاة الــمــطـور ↜ https://whatsapp.com/channel/0029Va8Y2DcLY6dENF4Jry0u
╰━━━━━━━━━━━━━━━━━━╯
*/
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_OWNER = "B7R-V"
const REPO_NAME = "UPLOADS-B7R"
const ENCODED_TOKEN = "Z2hwX2p3SkZEYUw5NVJQekNZdktjRGVJYldoVkF2Q1ExcDJUc3J3WQ=="
const GITHUB_TOKEN = Buffer.from(ENCODED_TOKEN, 'base64').toString('utf-8')

function generateRandomFileName(ext) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return `${result}.${ext}`
}

async function ensureUploadsFolder() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/uploads`
    const res = await fetch(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    })
    
    if (res.status === 404) {
        const createRes = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/uploads/.gitkeep`,
            {
                method: "PUT",
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: "Create uploads folder",
                    content: Buffer.from("# Uploads folder").toString("base64")
                })
            }
        )
        if (!createRes.ok) {
            throw new Error("فشل إنشاء مجلد uploads")
        }
    }
}

async function uploadToGithub(filePath, githubPath) {
    const content = fs.readFileSync(filePath, { encoding: "base64" })

    const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${githubPath}`,
        {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Upload ${githubPath}`,
                content
            })
        }
    )

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "فشل الرفع")
    }

    return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${githubPath}`
}

let handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply("⚠️ اعمل ريبلاي على صورة أو ملف عشان أرفعه.")

    const media = m.quoted
    const buffer = await media.download()
    const mime = media.mimetype || "application/octet-stream"
    const ext = mime.split("/")[1] || "bin"
    
    const fileName = generateRandomFileName(ext)
    const tempPath = path.join(__dirname, fileName)
    
    fs.writeFileSync(tempPath, buffer)

  //  await m.reply("⏳ جاري الرفع...")

    try {
        await ensureUploadsFolder()
        const link = await uploadToGithub(tempPath, `uploads/${fileName}`)
        fs.unlinkSync(tempPath)
        m.reply(`📮 *الـرابـط :*\n\`\`\`• ${link}\`\`\``)
    } catch (err) {
        fs.unlinkSync(tempPath)
        m.reply(`❌ فشل الرفع: ${err.message}`)
    }
}

handler.help = ["B 7 R"]
handler.tags = ["B 7 R"]
handler.command = ["لرابط"]

export default handler