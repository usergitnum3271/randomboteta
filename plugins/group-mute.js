import fetch from 'node-fetch';

const handler = async (m, { conn, command, text, isAdmin }) => {
  if (!isAdmin) {
    return conn.reply(
      m.chat,
      `⚠️ *ليس لديك صلاحيات كافية*\n\n> فقط المشرف يمكنه استخدام هذا الأمر.`,
      m
    );
  }

  let user = m.mentionedJid?.[0] || m.quoted?.sender || text;
  if (!user) {
    return conn.reply(
      m.chat,
      command === 'كتم'
        ? '🕯️ *منشن الشخص الذي تريد كتمه*'
        : '🕯️ *منشن الشخص الذي تريد فك الكتم عنه*',
      m
    );
  }

  if (!/@s\.whatsapp\.net$/.test(user)) {
    user = user.replace(/[^\d]/g, '');
    if (user.length > 5) user = `${user}@s.whatsapp.net`;
  }

  if (user === conn.user.jid) return conn.reply(m.chat, '🚩 لا يمكنك كتم البوت', m);

  const ownerNumber = global.owner[0][0] + '@s.whatsapp.net';
  if (user === ownerNumber) return conn.reply(m.chat, '🚩 لا يمكنك كتم مالك البوت', m);

  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupOwner = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  if (user === groupOwner) return conn.reply(m.chat, '🚩 لا يمكنك كتم مالك المجموعة', m);

  if (!global.db.data.users[user]) global.db.data.users[user] = {};
  const userData = global.db.data.users[user];

  const fkontak = {
    key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: {
      locationMessage: {
        name: command === 'كتم' ? 'تم كتم المستخدم 🔇' : 'تم فك الكتم 🔊',
        jpegThumbnail: await (await fetch(
          command === 'كتم'
            ? 'https://telegra.ph/file/f8324d9798fa2ed2317bc.png'
            : 'https://telegra.ph/file/aea704d0b242b8c41bf15.png'
        )).buffer(),
        vcard:
          'BEGIN:VCARD\nVERSION:3.0\nN:;William;;;\nFN:William\nORG:William Bot\nEND:VCARD'
      }
    },
    participant: '0@s.whatsapp.net'
  };

  if (command === 'كتم') {
    if (userData.mute === true) return conn.reply(m.chat, '🚩 هذا المستخدم مكتوم بالفعل', m);
    global.db.data.users[user].mute = true;
    return conn.reply(m.chat, '❄️ تم كتم المستخدم', fkontak, null, { mentions: [user] });
  }

  if (command === 'فك') {
    if (userData.mute !== true) return conn.reply(m.chat, '🚩 هذا المستخدم غير مكتوم', m);
    if (user === m.sender) return conn.reply(m.chat, '🚩 لا يمكنك فك الكتم عن نفسك', m);

    global.db.data.users[user].mute = false;
    return conn.reply(m.chat, '✨ تم فك الكتم عن المستخدم', fkontak, null, { mentions: [user] });
  }
};

// حذف رسائل المكتوم
handler.before = async function (m, { conn }) {
  if (!m.isGroup) return;
  const sender = m.sender;
  const userData = global.db.data.users[sender];

  if (userData && userData.mute === true) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key });
    } catch (e) {
      console.error("خطأ أثناء حذف رسالة المكتوم:", e);
    }
  }
};

handler.command = ['كتم', 'فك'];
handler.help = ['كتم @منشن', 'فك @منشن'];
handler.tags = ['grupo'];
handler.group = true;
handler.admin = true;

export default handler;