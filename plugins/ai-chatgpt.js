import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) {
        let helpMsg =
        `🧠 *قيادة الذكاء الاصطناعي (GPT)*\n\n` +
        `❖ *استخدم:*\n` +
        `اكتب سؤالك بعد الأمر.\n\n` +
        `❖ *أمثلة:*\n` +
        `▸ ${usedPrefix + command} أعطني خطة لتعلم اللغة الإنجليزية في شهر واحد\n` +
        `▸ ${usedPrefix + command} اكتب لي بعض التعليمات البرمجية لموقع ويب بسيط\n` +
        `▸ ${usedPrefix + command} أخبرني نكتة`

        return conn.sendMessage(m.chat, { text: helpMsg }, { quoted: m })
    }

    try {
        await conn.sendPresenceUpdate('composing', m.chat)

        try {
            await conn.sendMessage(m.chat, { react: { text: '🧠', key: m.key } })
        } catch (e) {}

        let username = m.pushName || "صديق"
        let systemPrompt = `
        أنت مساعد ذكي ومفيد على واتساب.
        اسمك: ChatGPT.
        يُطلق على المستخدم الذي يتحدث إليك اسم: ${username}.
        أجب باللغة العربية بوضوح ولطف ومباشرة..
        `.trim()

        let apiUrl = `https://text.pollinations.ai/${encodeURIComponent(text)}?model=openai&system=${encodeURIComponent(systemPrompt)}`
        let req = await fetch(apiUrl)
        let response = await req.text()

        if (!response) throw new Error('لم يتم الحصول على أي استجابة من الخادم.')

        const fkontak = {
            key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'ChatGPT' },
            message: {
                locationMessage: {
                    name: 'ChatGPT • Premiun 👑',
                    jpegThumbnail: await (await fetch('https://files.catbox.moe/bff50y.jpg')).buffer(),
                    vcard:
                        'BEGIN:VCARD\n' +
                        'VERSION:3.0\n' +
                        'N:;ChatGPT;;;\n' +
                        'FN:ChatGPT\n' +
                        'ORG:OpenAI\n' +
                        'TITLE:Asistente IA\n' +
                        'item1.TEL;waid=00000000000:+0 000 000 0000\n' +
                        'item1.X-ABLabel:IA\n' +
                        'X-WA-BIZ-DESCRIPTION:إجابات سريعة وواضحة ودقيقة.\n' +
                        'X-WA-BIZ-NAME:ChatGPT\n' +
                        'END:VCARD'
                }
            },
            participant: '0@s.whatsapp.net'
        }

        await conn.sendMessage(
            m.chat,
            { text: response.trim() },
            { quoted: fkontak }
        )

        try {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } catch (e) {}

    } catch (error) {
        console.error(error)

        try {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        } catch (e) {}

        await conn.sendMessage(m.chat, { text: '❌ *حدث خطأ أثناء الاتصال بالخادم..*' }, { quoted: m })
    }
}

handler.command = /^(openai|chatgpt|ia|ai|chatgpt2|ia2|شات|جيبيتي|جبتي|صناعي)$/i
handler.help = ['جيبيتي <سؤال>']
handler.tags = ['ai']
handler.group = true

export default handler