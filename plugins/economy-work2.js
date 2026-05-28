let handler = async (m, { conn, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`)

}
let user = global.db.data.users[m.sender]
user.lastslut = user.lastslut || 0
const cooldown = 5 * 60 * 1000
if (Date.now() < user.lastslut) {
const restante = user.lastslut - Date.now()
const tiempoRestante = formatTime(restante)
return conn.reply(m.chat, `⏳ لازم تستنى *${tiempoRestante}* قبل ما تستخدم الأمر *${usedPrefix + command}* مرة تانية.`, m)
}
user.lastslut = Date.now() + cooldown
const evento = pickRandom(slut)
let cantidad
if (evento.tipo === 'نجاح') {
cantidad = Math.floor(Math.random() * 1501) + 4000
user.coin += cantidad
} else {
cantidad = Math.floor(Math.random() * 1001) + 3000
user.coin -= cantidad
if (user.coin < 0) user.coin = 0
}
const mensaje = `❀ ${evento.mensaje} *¥${cantidad.toLocaleString()} ${currency}*`
await conn.reply(m.chat, mensaje, m)
}

handler.help = ['عمل2']
handler.tags = ['economy']
handler.command = ['work2', 'اعمل2', 'اشتغل2', 'عمل2']
handler.group = true

export default handler

function formatTime(ms) {
const totalSec = Math.ceil(ms / 1000)
const minutes = Math.floor((totalSec % 3600) / 60)
const seconds = totalSec % 60
const parts = []
if (minutes > 0) parts.push(`${minutes} دقيقة`)
parts.push(`${seconds} ثانية`)
return parts.join(' ')
}
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}
const slut = [
  { tipo: 'نجاح', mensaje: "تداعب قضيب عميل معتاد وتربح. 🍆👋💵" },
  { tipo: 'نجاح', mensaje: "يقذف الأدمن في فمك، تربح. 🤤💦👑" },
  { tipo: 'نجاح', mensaje: "يتلمس الأدمن ثدييك، تربح. 🤲🍈💵" },
  { tipo: 'نجاح', mensaje: "يلبسونك زي نيكو كواي في الأماكن العامة، تربح. 🐱👗💰" },
  { tipo: 'نجاح', mensaje: "تتظاهر بأنك لولي الأدمن ليوم واحد، تربح. 🎀👧💵" },
  { tipo: 'نجاح', mensaje: "تسمح لغريب بلمسك مقابل المال، تربح. 💸👐😐" },
  { tipo: 'نجاح', mensaje: "أنت خادمة الأدمن ليوم واحد، تربح. 🧹👗💰" },
  { tipo: 'نجاح', mensaje: "يدفع لك مثلي الجنس لتفعله معه، تربح. 🏳️‍🌈💵🍆" },
  { tipo: 'نجاح', mensaje: "تموت أمك السكرية، تربح. 🩸💰" },
  { tipo: 'نجاح', mensaje: "يموت أبوك السكري، تربح. 🩸💰" },
  { tipo: 'نجاح', mensaje: "تسمح لغريب بلمس مؤخرتك مقابل المال، تربح. 🍑👐💵" },
  { tipo: 'نجاح', mensaje: "تسمح لغريب بلمس مؤخرتك مقابل المال، تربح. 🍑👐💵" },
  { tipo: 'نجاح', mensaje: "يضع لك شخص مقودًا وتكون حيوانه الأليف الجنسي لمدة ساعة، تربح. 🐶🔗💵" },
  { tipo: 'نجاح', mensaje: "يلبسونك زي تلميذة في الأماكن العامة، تربح. 🎒👧💰" },
  { tipo: 'نجاح', mensaje: "يلبسونك زي امرأة مثيرة في الأماكن العامة، تربح. 👠💋💰" },
  { tipo: 'نجاح', mensaje: "يستخدمك أعضاء المجموعة ككيس للمني، تربح. 💦👥💰" },
  { tipo: 'نجاح', mensaje: "أنت عاهرة الأدمن ليوم واحد، تربح. 🐕👑💵" },
  { tipo: 'نجاح', mensaje: "يختطفك كائنات فضائية ويستخدمونك كأداة جنسية، تربح. 👽🔫💵" },
  { tipo: 'نجاح', mensaje: "ينيكك قزم في ساقك، تربح. 🧌🍆💵" },
  { tipo: 'هزيمة', mensaje: "تحاول تحصيل المال من العميل الخطأ فيبلغون عنك، تخسر. 🚫💰😭" },
  { tipo: 'هزيمة', mensaje: "يحظرك الأدمن بعد الخدمة، تخسر. 🔒😢" },
  { tipo: 'هزيمة', mensaje: "ترتدي الزي دون أن يدفع لك أحد، تخسر. 👗💸😭" },
  { tipo: 'هزيمة', mensaje: "تتركك أمك السكرية من أجل وايفو جديدة، تخسر. 💔👧😢" },
  { tipo: 'هزيمة', mensaje: "يسرق غريب زيك قبل الحدث، تخسر. 👤🦹‍♂️😭" },
  { tipo: 'هزيمة', mensaje: "يلمسوك دون أن يدفعوا شيئًا، تخسر. 👐💸😢" },
  { tipo: 'هزيمة', mensaje: "يتراجع المثلي في الثانية الأخيرة، تخسر. 🏳️‍🌈⏱️😭" },
  { tipo: 'هزيمة', mensaje: "يعيدك الكائنات الفضائية بصدمة نفسية، تخسر. 👽😱😭" }
];