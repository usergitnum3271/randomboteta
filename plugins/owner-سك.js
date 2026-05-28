import fs from "fs"
import { execSync } from "child_process"

let handler = async (m, { conn }) => {
try {

const allowedNumbers = [
"212726312195"
];

if (!allowedNumbers.includes(m.sender.replace(/[^0-9+]/g, ''))) {
return m.reply("❌ انت مش مسموحلك تاخد النسخة الاحتياطية");
}

const tempDir = "./tmp"
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
let files = fs.readdirSync(tempDir)
if (files.length > 0) {
for (let file of files) {
fs.unlinkSync(`${tempDir}/${file}`)
}
}
await m.reply("📦جاري ارسال النسخه الاحتياطيه")
const backupName = "rem"
const backupPath = `${tempDir}/${backupName}.zip`
const ls = (await execSync("ls"))
.toString()
.split("\n")
.filter(
(pe) =>
pe !== "node_modules" &&
pe !== "auth" &&
pe !== "package-lock.json" &&
pe !== "yarn.lock" &&
pe !== "pnpm-lock.yaml" &&
pe !== ""
)
await execSync(`zip -r ${backupPath} ${ls.join(" ")}`)
await conn.sendMessage(m.sender, {
document: await fs.readFileSync(backupPath),
fileName: `${backupName}.zip`,
mimetype: "application/zip"
}, { quoted: m })
fs.unlinkSync(backupPath)
if (m.chat !== m.sender) return m.reply("خاصك يا مطوري المظ🫦")
} catch (e) {
console.error(e)
m.reply("❌ فشل إنشاء برنامج النسخ الاحتياطي!")
}
}

handler.help = ["سك"]
handler.tags = ['owner'];
handler.command = /^(سك|bk)$/i
export default handler