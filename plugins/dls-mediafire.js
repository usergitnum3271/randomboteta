import fetch from 'node-fetch'
import { lookup } from 'mime-types'
import * as cheerio from "cheerio"

// 💞 دالة استخراج المعلومات من Mediafire (الكود الأول)
async function mediafireInfo(url) {
    const $ = cheerio.load(await (await fetch(url.trim())).text());
    const title = $("meta[property='og:title']").attr("content")?.trim() || "Unknown";
    const size = /Download\s*\(([\d.]+\s*[KMGT]?B)\)/i.exec($.html())?.[1] || "Unknown";
    const dl = $("a.popsok[href^='https://download']").attr("href")?.trim() ||
        $("a.popsok:not([href^='javascript'])").attr("href")?.trim() ||
        (() => { throw new Error("Download URL not found.") })();

    return {
        name: title,
        filename: title,
        size,
        download: dl,
        link: url.trim(),
    };
}

// 💞 الهاندلر الرئيسي (الكود الثاني معدل)
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw m.reply(`*❀ حـط لـيـنـك مـيـديـا فـايـر ☘️*
> *مــثــال:* ${usedPrefix}${command} https://www.mediafire.com/file/2v2x1p0x58qomva/WhatsApp_Messenger_2.24.21.8_beta_By_WhatsApp_LLC.apk/file`);
    if (!/^https:\/\/www\.mediafire\.com\//i.test(text)) return conn.reply(m.chat, '💞 *رابط مش صحيح* ⚠️', m)
    
    try {
        await m.react('🕒')
        
        // 💞 استخراج المعلومات أولاً
        const fileInfo = await mediafireInfo(text)
        const filename = fileInfo.filename
        const filesize = fileInfo.size
        const dl_url = fileInfo.download
        const mimetype = lookup(filename.split('.').pop()) || 'application/octet-stream'

        // 💞 إنشاء زر تحميل
        const caption = `*اެݪاســم:* ${filename}
*الـحـجـم:* ${filesize}
*وصـف:* ${mimetype}`
        
        // 💞 إرسال الملف مع الزر
        await conn.sendMessage(m.chat, { 
            document: { url: dl_url }, 
            fileName: filename, 
            mimetype, 
            caption 
        }, { quoted: m })
        
        await m.react('✅')
        
    } catch (e) {
        await m.react('❌')
        // 💞 إذا فشل الكود الأول، جرب API الخارجي
        try {
            const res = await fetch(`${global.APIs.delirius.url}/download/mediafire?url=${encodeURIComponent(text)}`)
            const json = await res.json()
            const data = json.data
            
            if (json.status && data?.filename && data?.link) {
                const filename = data.filename
                const filesize = data.size || 'مجهول'
                const mimetype = data.mime || lookup(data.extension?.toLowerCase()) || 'application/octet-stream'
                const dl_url = data.link.includes('u=') ? decodeURIComponent(data.link.split('u=')[1]) : data.link
                
                const caption = `*اެݪاســم:* ${filename}
*الـحـجـم:* ${filesize}
*وصـف:* ${mimetype}`
                
                await conn.sendMessage(m.chat, { 
                    document: { url: dl_url }, 
                    fileName: filename, 
                    mimetype, 
                    caption 
                }, { quoted: m })
                await m.react('✅')
            } else {
                throw e
            }
        } catch (error) {
            return conn.reply(m.chat, `💞 *يا رفيقي* ⚠️\n\nما قدرت أحمل الملف\nجرب رابط ثاني أو حاول لاحقاً`, m)
        }
    }
}

handler.help = ['ميديافاير <رابط التحميل>']
handler.tags = ['download']
handler.command = /^(ميديافاير|ميديا-فاير|mf|mediafire)$/i
handler.group = true
handler.premium = false
handler.register = false
export default handler