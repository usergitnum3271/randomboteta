let handler = async (m, { conn, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* معطلة في المجموعة دي ❌

👮‍♂️ ممكن *حد من الأدمنز* يفعلها بالأمر ده:
» *${usedPrefix}economy on* ✅`)
}
let user = global.db.data.users[m.sender]
user.lastcrime = user.lastcrime || 0
user.coin = user.coin || 0
const cooldown = 8 * 60 * 1000
const ahora = Date.now()
if (ahora < user.lastcrime) {
const restante = user.lastcrime - ahora
const wait = formatTimeMs(restante)
return conn.reply(m.chat, `ꕥ لازم تنتظر *${wait}* قبل ما تستخدم الأمر *${usedPrefix + command}* مرة تانية 🔁`, m)
}
user.lastcrime = ahora + cooldown
const evento = pickRandom(crimen)
let cantidad
if (evento.tipo === 'انتصار') {
cantidad = Math.floor(Math.random() * 1501) + 6000
user.coin += cantidad
} else {
cantidad = Math.floor(Math.random() * 1501) + 4000
user.coin -= cantidad
if (user.coin < 0) user.coin = 0
}
await conn.reply(m.chat, `❀ ${evento.mensaje} *¥${cantidad.toLocaleString()} ${currency}*`, m)
}

handler.tags = ['economy']
handler.help = ['جريمه']
handler.command = ['جريمه', 'crime','جريمة']
handler.group = true

export default handler

function formatTimeMs(ms) {
const totalSec = Math.ceil(ms / 1000)
const min = Math.floor(totalSec / 60)
const sec = totalSec % 60
const partes = []
if (min) partes.push(`${min} دقيقة`)
partes.push(`${sec} ثانية`)
return partes.join(' ')
}
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}
const crimen = [
  { tipo: 'انتصار', mensaje: "💻 اخترقت ماكينة صراف آلي باستخدام ثغرة في النظام وسحبت الفلوس بدون ما حد ياخد باله، نجحت!" },
  { tipo: 'انتصار', mensaje: "🏰 تسللت كفني في قصر وسرقت مجوهرات أثناء فحص الشبكة، نجحت!" },
  { tipo: 'انتصار', mensaje: "🏦 عملت تحويل بنكي وهمي وحصلت على الفلوس قبل ما يلغيوا العملية، نجحت!" },
  { tipo: 'انتصار', mensaje: "📦 اعترضت طرد فاخر في استقبال شركة وبعته، نجحت!" },
  { tipo: 'انتصار', mensaje: "🍽️ فرغت محفظة منسية في مطعم بدون ما حد ياخد باله، نجحت!" },
  { tipo: 'انتصار', mensaje: "🛒 دخلت سيرفر متجر رقمي واستعملت خصومات وهمية للحصول على منتجات مجانية، نجحت!" },
  { tipo: 'انتصار', mensaje: "🚚 تظاهرت بأنك ساعي واستولت على طرد مجموعة نادرة بدون ما حد يشك، نجحت!" },
  { tipo: 'انتصار', mensaje: "🖼️ نسخت المفتاح الرئيسي لمعرض فني وبعت تمثال بدون تسجيل، نجحت!" },
  { tipo: 'انتصار', mensaje: "🌐 عملت موقع خيري وهمي وخليت مئات الناس يتبرعوا، نجحت!" },
  { tipo: 'انتصار', mensaje: "💳 تحكمت في قارئ البطاقات في متجر محلي وفرغت حسابات خاصة، نجحت!" },
  { tipo: 'انتصار', mensaje: "🎟️ زوّرت تذاكر VIP لحدث ودخلت منطقة خاصة بأشياء حصرية، نجحت!" },
  { tipo: 'انتصار', mensaje: "🤑 خدعت جامع تحف وبعته نسخة بدل الأصلية، نجحت!" },
  { tipo: 'انتصار', mensaje: "☕ حصلت على كلمة مرور لرجل أعمال في كافيه وحولت الفلوس لحسابك، نجحت!" },
  { tipo: 'انتصار', mensaje: "👴 أقنعت عجوز بالمشاركة في استثمار وهمي وسحبت مدخراته، نجحت!" },
  { tipo: 'انتصار', mensaje: "🛠️ اخترقت نظام أمني لمصنع وسحبت مواد خام نادرة، نجحت!" },
  { tipo: 'انتصار', mensaje: "🎨 سرقت لوحة فنية من معرض أثناء الليل بدون ما حد يشوف، نجحت!" },
  { tipo: 'انتصار', mensaje: "🚗 فتحّت سيارة فارهة باستخدام جهاز إلكتروني وسحبت الأغراض الثمينة، نجحت!" },
  { tipo: 'انتصار', mensaje: "📱 اخترقت هاتف مسؤول وسحبت معلومات قيمة، نجحت!" },
  { tipo: 'انتصار', mensaje: "💎 سرقت مجوهرات من خزنة خاصة أثناء مناسبة اجتماعية، نجحت!" },
  { tipo: 'انتصار', mensaje: "🏪 عبثت بآلة بيع ذكية وسحبت منتجات ثمينة، نجحت!" },
  { tipo: 'انتصار', mensaje: "🎮 سرقت حساب ألعاب نادرة وأعدت بيعه مقابل عملة حقيقية، نجحت!" },
  { tipo: 'انتصار', mensaje: "📦 استولت على طرد يحتوي على أجهزة إلكترونية باهظة، نجحت!" },
  { tipo: 'انتصار', mensaje: "💵 استخدمت ثغرة في تطبيق دفع وسحبت أموال افتراضية، نجحت!" },
  { tipo: 'انتصار', mensaje: "🖥️ اخترقت قاعدة بيانات شركة وحصلت على معلومات ثمينة، نجحت!" },
  { tipo: 'هزيمة', mensaje: "📦 حاولت سرقة طرد، لكن الحارس شاهدك وبلغ الشرطة، خسرت!" },
  { tipo: 'هزيمة', mensaje: "💳 حاولت اختراق جهاز دفع، لكن النظام اكتشف النشاط، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🏢 تسللت لمكتب لكن الكاميرات سجلتك، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🔑 حاولت فتح خزنة، لكن تركتها نصف مفتوحة وتم القبض عليك، خسرت!" },
  { tipo: 'هزيمة', mensaje: "📱 اخترقت هاتف لكن صاحب الهاتف استخدم خاصية التتبع، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🏦 حاولت التحايل على البنك، لكن اكتشفوا العملية وأوقفوك، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🎨 حاولت سرقة لوحة، لكن الحارس أوقفك قبل ما تلمسها، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🚗 سرقت سيارة، لكن المالك رصد الموقع وأبلغ الشرطة، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🖥️ اخترقت سيرفر لكن صاحب السيرفر اكتشف الاختراق وأوقفك، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🏪 حاولت العبث بآلة بيع، لكن الكاميرات سجلتك، خسرت!" },
  { tipo: 'هزيمة', mensaje: "⌚ حاولت تبيع ساعة مقلدة، لكن المشتري اكتشف الخدعة وبلغ عنك، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🏦 اخترقت حساب بنكي، لكن نسيت تخفي الـIP وتم تتبعك، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🎒 سرقت شنطة في حدث، لكن كاميرا خفية رصدت كل شيء، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🏬 تسللت لمتجر فاخر، لكن النظام الصامت فعّل الإنذار، خسرت!" },
  { tipo: 'هزيمة', mensaje: "🏰 تظاهرت بأنك فني في قصر، لكن المالك عرفك واستدعى الأمن، خسرت!" },
  { tipo: 'هزيمة', mensaje: "📄 حاولت تبيع مستندات سرية، لكنها كانت مزيفة وما حد اشترى، خسرت!" }
]