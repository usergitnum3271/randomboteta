const handler = async (m, { conn, isOwner, isAdmin, text }) => {
  const maxWarn = 3;

  // التأكد من الصلاحيات
  if (!isOwner && !isAdmin) {
    return conn.sendMessage(m.chat, { text: "🚫 *الأمر مخصص للمشرفين فقط*" }, { quoted: m });
  }

  // تحديد العضو
  let target = m.mentionedJid?.[0] || m.quoted?.sender;
  if (!target) {
    return conn.sendMessage(m.chat, { text: " *منشن العضو أو رد على رسالته*" }, { quoted: m });
  }

  // تجهيز قاعدة البيانات
  global.db.data.users = global.db.data.users || {};
  global.db.data.users[target] = global.db.data.users[target] || { warn: 0 };

  // إضافة إنذار
  let userData = global.db.data.users[target];
  userData.warn += 1;

  // تنظيف السبب
  let reason = text.replace(/@\d+/g, '').trim() || 'غير محدد';
/*┏┅ ━━━━━━━━━━━━━━━ ┅ ━┣*
┃╻❗╹↵ ※ لقد تلقيت انذار! ※ ↯
┣┅ ━━━━━━━━━━━━━━━ ┅ ━┣
┃╻👤╹↵ المستخدم ⇦ ❮@${target.split('@')[0]}❯
┃╻❓╹↵ السبب ⇦ ❮${reason}❯
┃╻🏆╹↵ عدد الانذارات ⇦ ❮${userData.warn}/${maxWarn}❯
┣┅ ━━━━━━━━━━━━━━━ ┅ ━┣
┃╻🔕╹↵ ❮.الغاء-الانذار❯
┗┅ ━━━━━━━━━━━━━━━ ┅ ━┛*/
  // الرسالة
  const caption = `*
╭──⧼ ❗ لقد تلقيت انذار! ⧽
│┃👤 المـستـخـدم • @${target.split('@')[0]}
│┃❓ بسبب • ${reason}
│┃🎟️ عدد الانذارات • ${userData.warn}/${maxWarn}
╰─────────────❏*`;

  // رياكشن
  await conn.sendMessage(m.chat, {
    react: { text: '⚠️', key: m.key }
  });

  // إرسال الرسالة
  await conn.sendMessage(m.chat, {
    text: caption,
    mentions: [target]
  }, { quoted: m });

  // الطرد
  if (userData.warn >= maxWarn) {
    await conn.sendMessage(m.chat, {
      text: `*تم طرد العضو لتجاوزه ${maxWarn} إنذارات*`,
      mentions: [target]
    }, { quoted: m });

    await conn.groupParticipantsUpdate(m.chat, [target], "remove");

    userData.warn = 0;
  }
};

// الأوامر
handler.command = ['انذار', 'warn'];

// ✅ هذا المهم عشان يظهر في المنيو
handler.help = [
  'انذار @شخص <سبب>',
  'انذار (بالرد)'
];

// 📂 التصنيف
handler.tags = ['group'];

// شروط التشغيل
handler.group = true;
handler.admin = true;

export default handler;