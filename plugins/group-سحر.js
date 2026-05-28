let handler = async (m, { conn, usedPrefix, command, text }) => {
    let target = m.mentionedJid[0] 
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : text
        ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        : false

    if (!target)
        return m.reply(
            `✋ *من فضلك رد على رسالة الشخص أو اعمله منشن!* \n\n📌 مثال:\n${usedPrefix + command} @${m.sender.split("@")[0]}`,
            false,
            { mentions: [m.sender] }
        )

    if (target == m.sender)
        return m.reply("❌ لا يمكنك طرد نفسك!")

    const steps = [
        "✨🎩 *مرحبًا بكم في عرض السحر لهذه الليلة!* 🎩✨",
        "🔮 *اليوم سنقوم بفعل شيء مذهل...* 🔮",
        "🧙‍♂️ *استعدوا جيدًا... ركزوا أنظاركم هنا...* 🧙‍♂️",
        "✨ *سيم سلابيم... سنجعل أحدهم يختفي...* ✨",
        "🎩 *ابراكادابرا... شاهدوا بأعينكم... شيء عجيب سيحدث...* 🎩",
        "🪄 *هوكوس بوكوس... حان وقت الاختفاء...* 🪄",
        "✨ *استعدوا... في لمح البصر سيختفي...* ✨",
        "🌟 *والآن...!* 🌟",
        "💥 *بوف!* لقد اختفى هذا العضو من المجموعة... 💥"
    ]


    let sent = await conn.sendMessage(m.chat, { text: steps[0] }, { quoted: m })


    for (let i = 1; i < steps.length; i++) {
        await delay(1500)
        await conn.sendMessage(m.chat, { edit: sent.key, text: steps[i] })
    }

    await delay(1500)

    await conn.groupParticipantsUpdate(m.chat, [target], 'remove')

    await conn.sendMessage(m.chat, {
        text: `✅ *تم طرد @${target.split("@")[0]} من المجموعة بنجاح 🧙‍♂️✨*`,
        mentions: [target]
    })
}

handler.help = ['سحر']
handler.tags = ['group']
handler.command = /^(سحر|سحر_الطرد|سحر_الاختفاء)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true
export default handler

let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))