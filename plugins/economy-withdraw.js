let handler = async (m, { args, usedPrefix, command }) => {
    const chat = global.db.data.chats[m.chat]
    if (!chat.economy && m.isGroup) {
        return m.reply(
  `《✦》أوامر *الاقتصاد* متعطلة في المجموعة دي ❌\n\n` +
  `👮‍♂️ يقدر أي *أدمن* يفعلها بالأمر ده:\n` +
  `» *${usedPrefix}economy on* ✅`
        )
    }

    let user = global.db.data.users[m.sender]
    const currency = global.currency || "¥"

    if (!args[0]) {
        return m.reply(
            `❀ ادخل كمية ${currency} اللي عايز تسحبها 💸💰\n\n` +
            `📌 مثال:\n` +
            `» ${usedPrefix + command} 25000\n` +
            `» ${usedPrefix + command} الكل`
        )
    }

    if (args[0].toLowerCase() === 'الكل') {
        let count = user.bank
        if (count <= 0) return m.reply(`ꕥ معندكش ${currency} في البنك 🏦💸`)

        user.bank -= count
        user.coin += count

       return m.reply(
            `❀ سحبت *${count.toLocaleString()} ${currency}* من البنك 🏦💸\n` +
            `دلوقتي تقدر تستخدمهم… بس برضه ممكن يتسرقوا منك ⚠️🕵️‍♂️`)
    };

    if (isNaN(args[0])) {
        return m.reply(
            `ꕥ لازم تسحب كمية صحيحة ❌\n\n` +
            `📌 مثال:\n` +
            `» ${usedPrefix + command} 25000\n` +
            `» ${usedPrefix + command} الكل`
        )
    }

    let count = parseInt(args[0])

    if (user.bank <= 0) return m.reply(`ꕥ معندكش ${currency} كفاية في البنك 🏦💸`)
    if (user.bank < count) {
        return m.reply(
            `ꕥ معندكش غير *${count.toLocaleString()} ${currency}* في البنك 🏦💰`
        )
    }

    user.bank -= count
    user.coin += count

    return m.reply(
        `❀ سحبت *${count.toLocaleString()} ${currency}* من البنك 🏦💰.\n` +
        `دلوقتي تقدر تستخدمه… بس خد بالك ممكن حد يسرقه منك 😅💸`
);
}

handler.help = ['سحب']
handler.tags = ['economy']
handler.command = ['withdraw', 'سحب', 'اسحب']
handler.group = true

export default handler