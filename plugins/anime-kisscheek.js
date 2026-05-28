import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;

    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    m.react('❤️');

    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` *قبلها على خدها* \`${name || who}\` 😊💖.`;
    } else if (m.quoted) {
        str = `\`${name2}\` *قبلته على خده* \`${name || who}\` 💕.`;
    } else {
        str = `\`${name2}\` *قبّل نفسه على خده 😊*`.trim();
    }
    
    if (m.isGroup) {
        let videos = [
            'https://files.catbox.moe/0d6p41.mp4',
            'https://files.catbox.moe/q6x7r2.mp4',
            'https://files.catbox.moe/5cavi9.mp4',
            'https://files.catbox.moe/a2w8n2.mp4',
            'https://files.catbox.moe/vwjq3x.mp4',
            'https://files.catbox.moe/t2depk.mp4',
            'https://files.catbox.moe/iis5be.mp4'
        ];
        const video = videos[Math.floor(Math.random() * videos.length)];

        let mentions = [who];
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m });
    }
}

handler.help = ['قبله-خد @tag'];
handler.tags = ['anime'];
handler.command = ['kisscheek','قبله-علي-الخد','بوسه-علي-الخد','قبله-خد'];
handler.group = true;

export default handler;