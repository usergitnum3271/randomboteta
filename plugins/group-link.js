/*
	* Create By Fede Uchiha 
	* GitHub https://github.com/the-xyzz
	* Whatsapp: https://whatsapp.com/channel/0029VbBG4i2GE56rSgXsqw2W
*/

import { generateWAMessageContent, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let fkontak = { 
    "key": { 
        "participants":"0@s.whatsapp.net", 
        "remoteJid": "status@broadcast", 
        "fromMe": false, 
        "id": "Halo" 
    }, 
    "message": { 
        "contactMessage": { 
            "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:Bot\nitem1.TEL;waid=5219991234567:5219991234567\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
        }
    }, 
    "participant": "0@s.whatsapp.net" 
}

var handler = async (m, { conn, args }) => {
    let group = m.chat
    
    try {
        const pp = 'https://files.catbox.moe/v5leic.jpg'
        let inviteCode = await conn.groupInviteCode(group)
        let link = 'https://chat.whatsapp.com/' + inviteCode

        let title = '🔗 لينك دعوة المجموعة'
        let bodyText = `*هذا هو لينك الدعوة:*\n\n> \`لينك:\` ${link}`
        let footerText = 'اضغط على الزر لنسخ اللينك.'

        const buttons = [
            {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({ 
                    display_text: "نسخ اللينك", 
                    copy_code: link 
                })
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({ 
                    display_text: "فتح اللينك", 
                    url: link 
                })
            }
        ];

        const { imageMessage } = await generateWAMessageContent({ 
            image: { url: pp } 
        }, { upload: conn.waUploadToServer })

        const interactive = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({ text: bodyText }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: footerText }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({ 
                            title: title, 
                            hasMediaAttachment: true, 
                            imageMessage 
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ 
                            buttons, 
                            messageParamsJson: '' 
                        })
                    })
                }
            }
        }, { quoted: fkontak });

        await conn.relayMessage(m.chat, interactive.message, { messageId: interactive.key.id })

    } catch (e) {
        console.error("خطأ أثناء إنشاء/إرسال اللينك:", e);
        
        let fallbackLink = 'https://chat.whatsapp.com/' + (await conn.groupInviteCode(group).catch(() => ''))
        let fallbackPP = 'https://files.catbox.moe/v5leic.jpg'
        let fallbackMessage = `*❌ فشل إرسال الرسالة التفاعلية. تأكد أن البوت مشرف.*\n\n*➭ هذا هو اللينك على أي حال:*\n\n> \`لينك:\` ${fallbackLink}`
        
        await conn.sendMessage(group, { image: { url: fallbackPP }, caption: fallbackMessage }, { quoted: m })
    }
}

handler.help = ['لينك']
handler.tags = ['grupo']
handler.command = ['link', 'enlace', 'لينك']
handler.group = true
handler.botAdmin = true

export default handler