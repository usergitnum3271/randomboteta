import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

let allowedNumbers = ['201116880068','212726312195']

let handler = async (m, { conn, text, participants }) => {
    if (!allowedNumbers.includes(m.sender.split('@')[0]))
        return m.reply('⚠️ انت مش مسموحلك تستخدم الأمر ده')

    if (!m.quoted && !text) return m.reply('⚠️ رد ع أي رسالة أو حط نص بعد الأمر')

    let pesan = text ? text : m.quoted?.text || ''
    if (!pesan) return m.reply('⚠️ ضع نص الرسالة')

    // Fake contact
    const fakeContact = {
        key: {
            participants: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            fromMe: false,
            id: 'Anyabot'
        },
        message: {
            contactMessage: {
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:anya;bot;;;\nFN:rem bot\nitem1.TEL;waid=201116880068:201060391321\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        participant: '0@s.whatsapp.net'
    }

    const delay = time => new Promise(res => setTimeout(res, time))
    const maxRetries = 3
    const maxChats = 1000
    let startTime = Date.now()

    // جلب كل الشاتات (جروبات + خاصة)
    let chats = Object.entries(conn.chats)
        .filter(([jid, chat]) => (jid.endsWith('@g.us') || jid.endsWith('@s.whatsapp.net')) && chat.isChats)
        .map(([jid, chat]) => ({ id: jid, name: chat.name || jid }))

    let chatsToSend = chats.slice(0, maxChats)

    let successfulGroups = []
    let successfulPrivates = []

    for (let { id, name } of chatsToSend) {
        await delay(500) // تأخير بسيط بين الرسائل
        let sent = false
        let attempts = 0

        while (!sent && attempts < maxRetries) {
            try {
                // جمع كل المشاركين للمنشن المخفي (للجروبات فقط)
                let mentioned = []
                if (id.endsWith('@g.us') && participants)
                    mentioned = participants.map(u => conn.decodeJid(u.id))

                const forwardedInfo = {
                    forwardingScore: 9999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363158797567045@newsletter',
                        serverMessageId: 777,
                        newsletterName: '◜𝐑𝐄𝐌┊🌸┊𝐂𝐇𝐀𝐍𝐍𝐄𝐋◞'
                    },
                    mentionedJid: mentioned
                }

                await conn.sendMessage(id, {
                    text: `––––––『 *إذاعة* 』––––––\n\n${pesan}\n\n*💌 هذا بيان رسمي من مالك البوت*`,
                    contextInfo: forwardedInfo
                }, { quoted: fakeContact })

                if (id.endsWith('@g.us')) successfulGroups.push(name)
                else successfulPrivates.push(name)

                sent = true
            } catch (e) {
                attempts++
                console.error(`خطأ في إرسال الرسالة إلى ${name} (محاولة ${attempts} من ${maxRetries}):`, e)
                await delay(1000)
            }
        }

        if (!sent) console.error(`فشل إرسال الرسالة إلى ${name} بعد ${maxRetries} محاولات.`)
    }

    let endTime = Date.now()
    let time2 = ((endTime - startTime) / 1000).toFixed(2)

    let groupsCount = successfulGroups.length
    let privatesCount = successfulPrivates.length
    let totalCount = groupsCount + privatesCount

    let message = `*📑 الرسالة اتبعتت لـ ${totalCount} شاتات*\n\n`
    message += `*عدد المجموعات: ${groupsCount}*\n`
    message += `*عدد الشاتات الخاصة: ${privatesCount}*\n`
    message += `*الوقت الكلي للإرسال: ${time2} ثواني*`

    await m.reply(message)
}

handler.help = ['broadcastall', 'bcall'].map(v => v + ' <نص>')
handler.tags = ['owner']
handler.command = /^broadcast(all|group|gc|private)|نشر|بث|اذاعه|ذيع|انشردا|انشرها$/i
handler.owner = true

export default handler