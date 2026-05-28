let fetch = require('node-fetch');

// دالة للحصول على أوقات الصلاة لليوم الحالي من البيانات المسترجعة
function getPrayerTimes(jsonData) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const todayString = `${day}-${month}-${year}`;

    for (const item of jsonData.result.data) {
        if (item.date.gregorian.date === todayString) {
            return item;
        }
    }
    return null;
}

// معالج الأوامر الرئيسي
let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `استخدم مثال: ${usedPrefix}${command} القاهرة`;

    try {
        // جلب بيانات أوقات الصلاة من API
        const res = await (await fetch(`https://api.botcahx.eu.org/api/tools/jadwalshalat?kota=${text}&apikey=${btc}`)).json();
        
        // التحقق من صحة الاستجابة
        if (!res.status || res.result.code !== 200) {
            throw 'خطأ: استجابة API غير صالحة';
        }

        // الحصول على أوقات الصلاة لليوم الحالي
        const prayerTimes = getPrayerTimes(res);
        
        if (prayerTimes) {
            let timings = prayerTimes.timings;
            // تنسيق أوقات الصلاة
            let jadwalSholat = Object.entries(timings)
                .map(([name, time]) => `*${name}:* ${time}`)
                .join('\n');
            
            let message = `
أوقات الصلاة لمدينة *${text}*
${jadwalSholat}
`.trim();
            
            m.reply(message);
        } else {
            throw 'خطأ: لا توجد بيانات لليوم الحالي';
        }
    } catch (error) {
        m.reply('حدث خطأ: ' + error);
    }
};

// إعدادات المساعدة والوسوم
handler.help = ['salat <منطقة>'];
handler.tags = ['islam'];
handler.command = /^(jadwal)?s(a|o|ha|ho)lat$/i;
handler.limit = true;

module.exports = handler;