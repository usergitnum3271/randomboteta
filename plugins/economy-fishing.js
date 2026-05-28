let handler = async (m, { conn, command, usedPrefix }) => {
if (!global.db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌\n\n🛠️ يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:\n» *${usedPrefix}economy on* ✅`)
}
let user = global.db.data.users[m.sender]
if (!user) global.db.data.users[m.sender] = user = { coin: 0, exp: 0, lastFish: 0 }
const cooldown = 12 * 60 * 1000
const ahora = Date.now()
if (ahora < user.lastFish) {
const restante = user.lastFish - ahora
const wait = formatTimeMs(restante)
return conn.reply(m.chat, `⏳ ꕥ لازم تنتظر *${wait}* قبل ما تستخدم الأمر *${usedPrefix + command}* مرة تانية 🔁`, m)
}
user.lastFish = ahora + cooldown
const evento = pickRandom(eventos)
let monedas, experiencia
if (evento.tipo === 'انتصار') {
monedas = Math.floor(Math.random() * 2001) + 11000
experiencia = Math.floor(Math.random() * 61) + 30
user.coin += monedas
user.exp += experiencia
} else {
monedas = Math.floor(Math.random() * 2001) + 5000
experiencia = Math.floor(Math.random() * 31) + 30
user.coin -= monedas
user.exp -= experiencia
if (user.exp < 0) user.exp = 0
if (user.coin < 0) user.coin = 0
}
const resultado = `❀ ${evento.mensaje} *¥${monedas.toLocaleString()} ${currency}*`
await conn.reply(m.chat, resultado, m)
await global.db.write()
}

handler.tags = ['economy']
handler.help = ['صيد']
handler.command = ['صيد', 'fishing','صياد']
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
const eventos = [
  { tipo: 'انتصار', mensaje: '🎣 لقد اصطدت سلمون! طعمه لذيذ، لقد فزت 🥳' },
  { tipo: 'انتصار', mensaje: '🐟 لقد اصطدت تروتة! طازجة وممتازة، لقد فزت 🎉' },
  { tipo: 'انتصار', mensaje: '🦈 لقد أمسكّت سمكة قرش! كانت معركة قوية، لقد فزت 💪' },
  { tipo: 'انتصار', mensaje: '🐋 مذهل! اصطدت حوتًا. كانت تجربة فريدة، لقد فزت 🌊' },
  { tipo: 'انتصار', mensaje: '🐠 لقد أمسكّت سمكة المهرج! ملونة ومرحة، لقد فزت 🌈' },
  { tipo: 'انتصار', mensaje: '🐟 اصطدت ميرو ضخم! الجهد كان يستحق، لقد فزت 🏆' },
  { tipo: 'انتصار', mensaje: '🐙 لقد أمسكّت أخطبوط بحبر أزرق! ذكي ولكنه لك، لقد فزت 🌀' },
  { tipo: 'انتصار', mensaje: '🦢 لقد اصطدت سمكة كارب ملكية! وزنها مثير للإعجاب، لقد فزت 🎯' },
  { tipo: 'انتصار', mensaje: '🐉 لقد حصلت على سمكة تنين! مخلوق أسطوري، لقد فزت 🐲' },
  { tipo: 'انتصار', mensaje: '🦑 لقد اصطدت حبارًا عملاقًا! ذكي وقوي، لقد فزت 🌀' },
  { tipo: 'انتصار', mensaje: '🐬 لقد اصطدت دولفينًا رائعًا! سريع ومرح، لقد فزت 🌊' },
  { tipo: 'انتصار', mensaje: '🐋 لقد اصطدت حوتًا ضخمًا! هائل ومهيب، لقد فزت 🌊' },
    { tipo: 'انتصار', mensaje: '🐡 اصطدت سمكة فُوجو السامة! كانت تجربة مثيرة، لقد فزت ☠️' },
  { tipo: 'انتصار', mensaje: '🦀 التقطت سلطعونًا ضخمًا! مذهل جدًا، لقد فزت 🏆' },
  { tipo: 'انتصار', mensaje: '🦑 اصطدت حبار صغير متلألئ! لونه جميل، لقد فزت ✨' },
  { tipo: 'انتصار', mensaje: '🦞 أمسكّت جراد البحر الأحمر! طعمه لذيذ، لقد فزت 🍴' },
  { tipo: 'انتصار', mensaje: '🐟 اصطدت سمكة ذهبية نادرة! حظ رائع، لقد فزت 🌟' },
  { tipo: 'انتصار', mensaje: '🐠 اصطدت مجموعة من الأسماك الصغيرة الملونة! منظر ممتع، لقد فزت 🌈' },
  { tipo: 'انتصار', mensaje: '🦈 اصطدت قرش صغير! كانت مبارزة سريعة، لقد فزت ⚡' },
  { tipo: 'انتصار', mensaje: '🦭 اصطدت فقمة لطيفة! لطيفة وودودة، لقد فزت 🐾' },
  { tipo: 'انتصار', mensaje: '🐋 اصطدت حوتًا صغيرًا! ضخم وهادئ، لقد فزت 🌊' },
  { tipo: 'انتصار', mensaje: '🦐 اصطدت جمبري كبير! لذيذ جدًا، لقد فزت 🍤' },
  { tipo: 'انتصار', mensaje: '🐙 اصطدت أخطبوط صغير بحبر أزرق، ذكي ولكنه لك، لقد فزت 🌀' },
  { tipo: 'انتصار', mensaje: '🦈 اصطدت سمكة قرش عملاقة! معركة قوية، لقد فزت 💪' },
  { tipo: 'انتصار', mensaje: '🐠 اصطدت سمكة فانتازية ملونة! نادرة وجميلة، لقد فزت 🌈' },
  { tipo: 'انتصار', mensaje: '🦀 التقطت سلطعون أزرق! منظر رائع، لقد فزت 💎' },
  { tipo: 'انتصار', mensaje: '🐡 اصطدت سمكة بلطي كبيرة! طازجة ولذيذة، لقد فزت 🍽️' },
  { tipo: 'انتصار', mensaje: '🦑 اصطدت حبارًا ملونًا! ذكي وحيوي، لقد فزت 🎨' },
  { tipo: 'انتصار', mensaje: '🐋 اصطدت حوت أزرق ضخم! هائل ومهيب، لقد فزت 🌊' },
  { tipo: 'انتصار', mensaje: '🐟 اصطدت تونة كبيرة! قوية وسريعة، لقد فزت 🏃‍♂️' },
  { tipo: 'انتصار', mensaje: '🐠 اصطدت سمكة ملونة نادرة! منظر خلاب، لقد فزت 🌟' },
  { tipo: 'انتصار', mensaje: '🦭 اصطدت فقمة لطيفة ومرحة! لقد فزت 🐾' },
    { tipo: 'هزيمة', mensaje: '🐡 سمكة الفوجو سقطت قبل أن تتمكن من الإمساك بها، خسرت ☠️' },
  { tipo: 'هزيمة', mensaje: '🦀 السلطعون هرب إلى الصخور، خسرت 🏃‍♂️' },
  { tipo: 'هزيمة', mensaje: '🦞 جراد البحر اختفى بين الأعشاب البحرية، خسرت 🌿' },
  { tipo: 'هزيمة', mensaje: '🐠 السمك الصغير تفرق وهرب، خسرت 😢' },
  { tipo: 'هزيمة', mensaje: '🦭 الفقمة غطست بسرعة ولم تتمكن من الإمساك بها، خسرت 🌊' },
  { tipo: 'هزيمة', mensaje: '🎣 الطُعم اختفى بدون أن يمسك أحد السمك، خسرت 😞' },
  { tipo: 'هزيمة', mensaje: '🐟 انفلتت السمكة الكبيرة عند السطح، خسرت 💦' },
  { tipo: 'هزيمة', mensaje: '🦑 الحبار الكبير هرب فجأة، خسرت 🌀' },
  { tipo: 'هزيمة', mensaje: '🦈 القرش العملاق ابتعد بسرعة، خسرت ⚡' },
  { tipo: 'هزيمة', mensaje: '🐋 الحوت هرب بعيدًا إلى الأعماق، خسرت 🌊' },
  { tipo: 'هزيمة', mensaje: '🦐 الجمبري الكبير قفز من الصنارة، خسرت 🍤' },
  { tipo: 'هزيمة', mensaje: '🐟 السمكة الذهبية نادرة جدًا، لكنها أفلتت منك، خسرت 🌟' },
  { tipo: 'هزيمة', mensaje: '🐠 السمكة الملونة اختفت بين الصخور، خسرت 🌈' },
  { tipo: 'هزيمة', mensaje: '🦀 السلطعون الأزرق رجع للبحر، خسرت 💎' },
  { tipo: 'هزيمة', mensaje: '🐡 البلطي الكبير هرب، خسرت 🍽️' },
  { tipo: 'هزيمة', mensaje: '🦑 الحبار الملون اختفى فجأة، خسرت 🎨' },
  { tipo: 'هزيمة', mensaje: '🐋 الحوت الأزرق العملاق غاص بسرعة، خسرت 🌊' },
  { tipo: 'هزيمة', mensaje: '🐟 التونة الكبيرة ابتعدت، خسرت 🏃‍♂️' },
  { tipo: 'هزيمة', mensaje: '🐠 السمكة النادرة هربت قبل الإمساك بها، خسرت 🌟' },
  { tipo: 'هزيمة', mensaje: '🦭 الفقمة اللطيفة اختفت في الماء، خسرت 🐾' },
  { tipo: 'هزيمة', mensaje: '🎣 اصطدت صندوق قديم بدل السمك، خسرت 🗑️' },
  { tipo: 'هزيمة', mensaje: '🐟 خط الصيد انقطع فجأة، خسرت ⚡' },
  { tipo: 'هزيمة', mensaje: '🦈 القرش الصغير هرب عند السطح، خسرت 😢' },
  { tipo: 'هزيمة', mensaje: '🦑 الحبار الكبير انفلت عند محاولة الإمساك به، خسرت 🌀' },
  { tipo: 'هزيمة', mensaje: '🐠 السمكة الملونة هربت بين الصخور، خسرت 🌈' },
  { tipo: 'هزيمة', mensaje: '🐡 البلطي الصغير اختفى فجأة، خسرت 🍽️' },
  { tipo: 'هزيمة', mensaje: '🐟 السمكة الذهبية النادرة ابتعدت، خسرت 🌟' },
  { tipo: 'هزيمة', mensaje: '🦭 الفقمة الصغيرة اختفت بسرعة، خسرت 🐾' },
  { tipo: 'هزيمة', mensaje: '🎣 الطُعم انجذب بعيدًا ولم تصطد أي سمكة، خسرت 😞' },
  { tipo: 'هزيمة', mensaje: '🦈 القرش العملاق ابتعد بعيدًا، خسرت ⚡' },
  { tipo: 'هزيمة', mensaje: '🐋 الحوت العملاق غاص بعيدًا، خسرت 🌊' },
  { tipo: 'هزيمة', mensaje: '🦑 الحبار العملاق هرب إلى الأعماق، خسرت 🌊' },
  { tipo: 'هزيمة', mensaje: '🐬 الدولفين اختفى بين الأمواج، خسرت 🌊' },
  { tipo: 'هزيمة', mensaje: '🐋 الحوت الضخم ابتعد عنك، خسرت 😢' },
  { tipo: 'هزيمة', mensaje: '🗑️ لقد اصطدت قمامة: كيس بلاستيك، خسرت 😢' },
  { tipo: 'هزيمة', mensaje: '🗑️ لقد اصطدت قمامة: علبة قديمة، خسرت 💔' },
  { tipo: 'هزيمة', mensaje: '🌊 لم تصطد شيئًا هذه المرة. الماء هادئ، خسرت 😞' },
  { tipo: 'هزيمة', mensaje: '🎣 خط الصيد انقطع عند الإمساك بشيء ضخم، خسرت ⚡' },
  { tipo: 'هزيمة', mensaje: '🐟 السمكة انفلتت عند الوصول إلى السطح، خسرت 😢' }
]