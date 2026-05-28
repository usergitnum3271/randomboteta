var handler = async (m, { conn, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`❌《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة 😴\n\n🛠️ يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:\n» *${usedPrefix}economy on* ✅`)
}
const user = global.db.data.users[m.sender]
if (!user) return
user.lastmine = user.lastmine || 0
user.coin = user.coin || 0
user.exp = user.exp || 0
user.health = user.health || 100
user.pickaxedurability = user.pickaxedurability || 100
if (user.health < 5)
return conn.reply(m.chat, `⚠️ ꕥ صحتك مش كفاية عشان ترجع *تتنقّب* ⛏️.\n> استخدم *${usedPrefix}عالج* 💊 عشان تعالج نفسك.`, m)
const gap = 10 * 60 * 1000
const now = Date.now()
if (now < user.lastmine) {
const restante = user.lastmine - now
return conn.reply(m.chat, `⏳ ꕥ لازم تنتظر *${formatTime(restante)}* قبل ما تستخدم الأمر *${usedPrefix + command}* مرة تانية 🔁`, m)
}
user.lastmine = now + gap
const evento = pickRandom(eventos)
let monedas, experiencia, salud
if (evento.tipo === 'انتصار') {
monedas = Math.floor(Math.random() * 2001) + 7000
experiencia = Math.floor(Math.random() * 91) + 10
salud = Math.floor(Math.random() * 3) + 1
user.coin += monedas
user.exp += experiencia
user.health -= salud
} else {
monedas = Math.floor(Math.random() * 2001) + 3000
experiencia = Math.floor(Math.random() * 41) + 10
salud = Math.floor(Math.random() * 5) + 1
user.coin -= monedas
user.exp -= experiencia
user.health -= salud
if (user.coin < 0) user.coin = 0
if (user.exp < 0) user.exp = 0
}
if (user.health < 0) user.health = 0
const mensaje = `❀ ${evento.mensaje} *¥${monedas.toLocaleString()} ${currency}*`
await conn.reply(m.chat, mensaje, m)
}

handler.help = ['تنقيب']
handler.tags = ['economy']
handler.command = ['تنقيب', 'miming', 'نقب']
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
const eventos = [
  { tipo: 'انتصار', mensaje: '🪙 لقد اكتشفت وريد ذهب بين صخور غير مستقرة وتمكنت من استخراجه بنجاح، لقد فزت 🥳' },
  { tipo: 'انتصار', mensaje: '💎 لقد وجدت غرفة سرية مليئة بالجواهر المخفية لقرون، لقد فزت 🎉' },
  { tipo: 'انتصار', mensaje: '⛏️ صادفت عامل منجم عجوز شاركك أدواته ومعرفته القيمة، لقد فزت 💪' },
  { tipo: 'انتصار', mensaje: '🏺 حفرت نفقًا منسيًا ووجدت صندوقًا يحتوي على معادن نادرة، لقد فزت 🏆' },
  { tipo: 'انتصار', mensaje: '🔮 وجدت كهفًا مضاءً بالبلورات الطبيعية يكشف عن كنز مخفي، لقد فزت ✨' },
  { tipo: 'انتصار', mensaje: '🗿 تمكّن تمثال غولم حجري من منحك الوصول إلى غرفة من الزمرد بعد حل لغزه، لقد فزت 🌟' },
  { tipo: 'انتصار', mensaje: '👷 تنقّبت مع مستكشفين آخرين وشاركوك فوائد مصدر سحري، لقد فزت 🌈' },
  { tipo: 'انتصار', mensaje: '🌕 بعد ساعات من الحفر، وجدت غرفة مختومة مليئة بحجارة القمر، لقد فزت 🌙' },
  { tipo: 'انتصار', mensaje: '💰 ضرب معولك سطحًا معدنيًا: كان صندوقًا يحتوي على عملات قديمة ذات قيمة كبيرة، لقد فزت 💎' },
  { tipo: 'انتصار', mensaje: '📜 باتباع خريطة بالية، وصلت إلى تجويف مليء بالياقوت، لقد فزت 🔴' },
  { tipo: 'انتصار', mensaje: '🪨 اكتشفت معدن فضي نادر بين الصخور، لقد فزت 🥳' },
  { tipo: 'انتصار', mensaje: '🧭 وجدت خريطة قديمة تؤدي إلى كنز مخفي، لقد فزت 🎉' },
  { tipo: 'انتصار', mensaje: '🔦 اكتشفت نفقًا مظلمًا مليئًا بالزمرد، لقد فزت 💎' },
  { tipo: 'انتصار', mensaje: '🛡️ تعاونت مع مجموعة من المستكشفين لتأمين كنز قديم، لقد فزت 🏆' },
  { tipo: 'انتصار', mensaje: '🔥 وجدت فوهة بركانية تحتوي على معادن نادرة، لقد فزت ✨' },
  { tipo: 'انتصار', mensaje: '🪓 صنعت أداة تعدين جديدة ساعدتك في استخراج الكنوز، لقد فزت 🌟' },
  { tipo: 'انتصار', mensaje: '🏔️ تسلقت جبلًا واكتشفت مغارة مليئة بالذهب، لقد فزت 🌈' },
  { tipo: 'انتصار', mensaje: '🌌 اكتشفت حجر نيزكي نادر، لقد فزت 🌙' },
  { tipo: 'انتصار', mensaje: '💎 اكتشفت قلادة قديمة مزينة بالأحجار الكريمة، لقد فزت 💎' },
  { tipo: 'انتصار', mensaje: '📦 عثرت على صندوق مهجور يحتوي على كنوز قديمة، لقد فزت 🔴' },
  { tipo: 'هزيمة', mensaje: '💨 انهيار أرضي صغير أفقدك بعض المعادن الثمينة، خسرت 😢' },
  { tipo: 'هزيمة', mensaje: '🔥 اندلعت شرارة في النفق وأحرقت بعض الكنوز، خسرت 💔' },
  { tipo: 'هزيمة', mensaje: '🌊 تسربت مياه في الكهف وغرقت بعض المعادن، خسرت 😞' },
  { tipo: 'هزيمة', mensaje: '🕷️ تعرضت لهجوم عنكبوت ضخم ومنعك من إكمال التنقيب، خسرت ⚡' },
  { tipo: 'هزيمة', mensaje: '💨 ريح قوية دفعتك بعيدًا عن مدخل الكهف، خسرت 🩸' },
  { tipo: 'هزيمة', mensaje: '🛠️ انكسرت أدواتك قبل اكتشاف وريد ثمين، انسحبت ويديك فارغتان، خسرت 😢' },
  { tipo: 'هزيمة', mensaje: '💥 فجأة انفجر غاز وفقدت جزءًا من الغنيمة أثناء الهروب، خسرت 💔' },
  { tipo: 'هزيمة', mensaje: '🪨 انهار جزء من الكهف ودفنت معادنك، خسرت 😞' },
  { tipo: 'هزيمة', mensaje: '🦇 هاجموك الخفافيش العمياء وأصبت ولم تكمل جمع المعادن، خسرت ⚡' },
  { tipo: 'هزيمة', mensaje: '⚠️ فخ قديم انطلق وأتلف حقيبتك، فقدت عدة جواهر، خسرت 🩸' }
]