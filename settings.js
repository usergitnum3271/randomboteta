import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

global.botNumber = "" //هسيبو فاضي عشان بيقرفني

global.owner = [
["212726312195", "B7R DEVX", true],
["963949597160", "WILLIAM", true],
["201116880068", "7ARB", true], 
["201017274961", "HEMA", true]
]

global.mods = []
global.suittag = ["212726312195"] 
global.prems = []


global.libreria = "Baileys Multi Device"
global.vs = "^1.3.2"
global.nameqr = "𝑸𝑹"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.MichiJadibts = true

global.botname = "◜𝐑𝐄𝐌┊💕┊𝐁𝐎𝐓◞"
global.textbot = "𝚁𝚎𝚖 𝙱𝚘𝚝"
global.dev = "© ʙ𝟽ʀ"
global.author = "© mᥲძᥱ ᑲᥡ ᑲ𝟕ᖇ"
global.etiqueta = "ⁱᵃᵐ,ᵇ⁷ʳ"
global.currency = "عمله"
global.michipg = './src/img/img1.jpg'
global.icono = "./src/img/img4.jpg"
global.catalogo = fs.readFileSync('./lib/catalogo.jpg')


global.group = "https://chat.whatsapp.com/Lxu1TDQlXQh5lRBKWJJVrH"
global.community = "https://chat.whatsapp.com/IwfIPGmt9Tv2hgJEXnQ1Fy"
global.channel = "https://whatsapp.com/channel/0029Va8Y2DcLY6dENF4Jry0u"
global.github = "https://github.com"
global.gmail = "minexdt@gmail.com"
global.ch = {
ch1: "120363158797567045@newsletter",
ch2: "120363158797567045@newsletter"
}


global.APIs = {
vreden: { url: "https://api.vreden.web.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
zenzxz: { url: "https://api.zenzxz.my.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null },
adonix: { url: "https://api-adonix.ultraplus.click", key: null }
}


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'settings.js'"))
import(`${file}?update=${Date.now()}`)
})
