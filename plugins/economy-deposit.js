let handler = async (m, { args, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* متعطلة في المجموعة دي ❌

👮‍♂️ ممكن *حد من الأدمنز* يفعلها بالأمر ده:
» *${usedPrefix}economy on* ✅`)
}
let user = global.db.data.users[m.sender]
if (!args[0]) return m.reply(`❀ 💰 ادخل كمية *${currency}* اللي عايز تحطها في الحساب 🏦`)
if ((args[0]) < 1) return m.reply(`ꕥ ادخل قيمة صحيحة من *${currency}* ❌`)
if (args[0] == 'الكل') {
let count = parseInt(user.coin)
user.coin -= count * 1
user.bank += count * 1
await m.reply(`❀ انت حطيت *${count.toLocaleString()} ${currency}* في البنك 💳، ومحدش هيقدر يسرقه منك 🛡️`)
return !0
}
if (!Number(args[0])) return m.reply(`ꕥ لازم تحط مبلغ صحيح للإيداع 💰
> مثال 1 » *${usedPrefix}ايداع 25000*
> مثال 2 » *${usedPrefix}ايداع الكل*`)

let count = parseInt(args[0])
if (!user.coin) return m.reply(`ꕥ معندكش رصيد كافي في المحفظة 💸\n> حاول تضيف فلوس أو استخدم كمية أقل.`);
if (user.coin < count) return m.reply(`✧ معاك بس *¥${user.coin.toLocaleString()} ${currency}* في المحفظة 💰`)
user.coin -= count * 1
user.bank += count * 1
await m.reply(`❀ حضرت *¥${count.toLocaleString()} ${currency}* في البنك 🏦، فلوسك دلوقتي محمية من السرقة 🔒`)
}
handler.help = ['ايداع']
handler.tags = ['economy']
handler.command = ['deposit', 'ايداع-للبنك', 'إيداع', 'ايداع']
handler.group = true

export default handler