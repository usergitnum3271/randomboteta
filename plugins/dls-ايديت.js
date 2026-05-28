import axios from 'axios';
import fetch from 'node-fetch';
import { fileTypeFromBuffer } from 'file-type';
import baileys from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, generateWAMessageContent, proto } = baileys;

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("❀ من فضلك أدخل كلمة للبحث عن الايديت الخاص بك.");

  try {
    const searchQuery = `${text} edit`;
    const { data } = await axios.get(
      "https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=" + encodeURIComponent(searchQuery)
    );
    const results = data.data;

    if (!results || results.length === 0)
      return m.reply("❌ لم يتم العثور على نتائج.");

    const randomResults = results.sort(() => 0.5 - Math.random()).slice(0, 3);

    const fakeContact = {
      key: {
        participants: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: 'RemBot'
      },
      message: {
        contactMessage: {
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:rem;bot;;;\nFN:rem bot\nitem1.TEL;waid=201060391321:201060391321\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    };
// 201060391321
    const forwardedInfo = {
      forwardingScore: 9999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363158797567045@newsletter',
        serverMessageId: 888,
        newsletterName: '◜𝐑𝐄𝐌┊🌷┊𝐂𝐇𝐀𝐍𝐍𝐄𝐋◞'
      }
    };

    await conn.sendMessage(
      m.chat,
      {
        text: '✧ جارٍ البحث عن النتائج...\n\n> لا تكتب الأمر مرة أخرى 🐦',
        contextInfo: forwardedInfo
      },
      { quoted: fakeContact }
    );

    async function createVideo(url) {
      const res = await fetch(url);
      const buffer = Buffer.from(await res.arrayBuffer());
      const fileInfo = await fileTypeFromBuffer(buffer);
      const mime = fileInfo ? fileInfo.mime : 'video/mp4';
      const { videoMessage } = await generateWAMessageContent(
        { video: buffer, mimetype: mime },
        { upload: conn.waUploadToServer }
      );
      return videoMessage;
    }

    const cards = [];
    let index = 1;

    for (const vid of randomResults) {
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `🎬 *العنوان:* ${vid.title || 'بدون عنوان'}`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: '*BY : 𝐑𝐄𝐌シ* 🎧'
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: `ايديت ${index++}`,
          hasMediaAttachment: true,
          videoMessage: await createVideo(vid.nowm)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: "cta_url",
              buttonParamsJson: `{"display_text":"عرض على TikTok","url":"${vid.play || vid.nowm}"}`
            }
          ]
        })
      });
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: "✨ *تم تحميل الايديتات المطلوبة بنجاح!*"
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '*𝐑𝐄𝐌🔰𝐁𝐎𝐓*'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards
            })
          })
        }
      }
    }, { quoted: fakeContact });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (err) {
    console.error(err);
    m.reply(`⚠︎ حدث خطأ أثناء جلب النتائج:\n${err.message}`);
  }
};

handler.help = ["ايديت <كلمة>"];
handler.tags = ["محرك بحث"];
handler.command = ["ايديت"];
handler.register = true;
handler.group = false;

export default handler;