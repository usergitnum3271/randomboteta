let handler = async (m, { conn, usedPrefix}) => {
  try {
    const apiKey = 'yVQTbMhSEqbcGv7q5Z8AfeQL7kbmT45mH7RjYh0hPz7WGnusXpLsn2AZ';
    const total = 20; // عدد النتائج التي يتم الاختيار من بينها عشوائياً
    const res = await fetch(`https://api.pexels.com/v1/search?query=cosplay&per_page=${total}`, {
      headers: { Authorization: apiKey}
});

    const json = await res.json();
    if (!json.photos || json.photos.length === 0) throw new Error("لم يتم العثور على أي صور");

    const randomIndex = Math.floor(Math.random() * json.photos.length);
    const cosplayUrl = json.photos[randomIndex].src.large;

    await conn.sendMessage(m.chat, { react: { text: "🎭", key: m.key}});

    const buttons = [
      {
        buttonId: `${usedPrefix}cosplay`,
        buttonText: { displayText: "🎭 زي تنكري آخر"},
        type: 1,
},
      {
        buttonId: `${usedPrefix}waifu`,
        buttonText: { displayText: "💘 وايفو عشوائي"},
        type: 1,
},
    ];

    const msg = {
      image: { url: cosplayUrl},
      caption: `✨ إليك جرعتك من الكوسبلاي يا أخي.\nهل تريد رؤية واحدة أخرى؟ اضغط على الزر 👇`,
      footer: "🧬 مولد الأزياء التنكرية",
      buttons: buttons,
      headerType: 4,
};

    await conn.sendMessage(m.chat, msg, { quoted: m});
} catch (e) {
    console.error("❌ خطأ في الأمر cosplay:", e);
    await conn.sendMessage(m.chat, {
      text: "❎ لم يتم الحصول على صورة زي التنكر. حاول مرة أخرى لاحقاً."
}, { quoted: m});
}
};

handler.help = ['كوسبلاي'];
handler.tags = ['anime'];
handler.command = ['cosplay','كوسبلاي','زي-تنكري'];
handler.register = true;

export default handler;