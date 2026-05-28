import fetch from 'node-fetch';

const gemini = {
getNewCookie: async function () {
const response = await fetch(
'https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=maGuAc&source-path=%2F&bl=boq_assistant-bard-web-server_20250814.06_p1&f.sid=-7816331052118000090&hl=en-US&_reqid=173780&rt=c',
{
headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
body: 'f.req=%5B%5B%5B%22maGuAc%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&',
method: 'POST'
}
);
const cookieHeader = response.headers.get('set-cookie');
if (!cookieHeader) throw new Error('لم يتم العثور على ملف تعريف الارتباط في الاستجابة.');
return cookieHeader.split(';')[0];
},

ask: async function (prompt, previousId = null) {
if (typeof prompt !== 'string' || !prompt?.trim()?.length)
throw new Error('الرسالة المقدمة غير صالحة.');

let resumeArray = null;  
let cookie = null;  
if (previousId) {  
  try {  
    const decoded = atob(previousId);  
    const data = JSON.parse(decoded);  
    resumeArray = data.newResumeArray;  
    cookie = data.cookie;  
  } catch (e) {  
    console.error('تعذر تحليل المعرف السابق، بدء محادثة جديدة.', e);  
    previousId = null;  
  }  
}  

const headers = {  
  'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',  
  'x-goog-ext-525001261-jspb': '[1,null,null,null,"9ec249fc9ad08861",null,null,null,[4]]',  
  cookie: cookie || (await this.getNewCookie())  
};  

const requestBody = [[prompt], ['es-ES'], resumeArray];  
const payload = [null, JSON.stringify(requestBody)];  
const formData = new URLSearchParams({ 'f.req': JSON.stringify(payload) });  

const response = await fetch(  
  'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20250729.06_p0&f.sid=4206607810970164620&hl=es-ES&_reqid=2813378&rt=c',  
  {  
    headers: headers,  
    body: formData,  
    method: 'post'  
  }  
);  

if (!response.ok)  
  throw new Error(  
    response.status + ' ' + response.statusText + ' ' + ((await response.text()) || '(Respuesta vacía)')  
  );  

const responseText = await response.text();  
const matches = responseText.matchAll(/^\d+\n(.+?)\n/gm);  
const lines = Array.from(matches, (m) => m[1]);  

let answerText, newResumeArray, found = false;  
for (const line of lines.reverse()) {  
  try {  
    const parsed = JSON.parse(line);  
    const data = JSON.parse(parsed[0][2]);  
    if (data && data[4] && data[4][0] && data[4][0][1] && typeof data[4][0][1][0] === 'string') {  
      newResumeArray = [...data[1], data[4][0][0]];  
      answerText = data[4][0][1][0].replace(/\*\*(.+?)\*\*/g, '*$1*');  
      found = true;  
      break;  
    }  
  } catch (e) {}  
}  

if (!found)  
  throw new Error('تعذر تفسير استجابة واجهة برمجة التطبيقات. ربما يكون الهيكل قد تغير.');  

const newId = btoa(JSON.stringify({ newResumeArray: newResumeArray, cookie: headers.cookie }));  
return { text: answerText, id: newId };

}
};

const geminiSessions = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) {
return conn.sendMessage(m.chat, {
text: `✨ أدخل *استفسار*.\n\n*مثال:* ${usedPrefix + command} ما هي عاصمة أستراليا؟\n\n*الأوامر المتاحة:*\n• ${usedPrefix + command} [سؤال] - سؤال جيميناي\n• ${usedPrefix + command} --reset - إعادة تعيين المحادثة\n• ${usedPrefix + command} --help - عرض المساعدة`,
...global.rcanal
}, { quoted: m });
}

if (text.toLowerCase() === '--reset' || text.toLowerCase() === '--restart' || text === 'إعادة') {
  delete geminiSessions[m.sender];
  return conn.sendMessage(m.chat, {
    text: '✅ تم إعادة تعيين سجل المحادثة.',
    ...global.rcanal
  }, { quoted: m });
}

if (text.toLowerCase() === '--help' || text === 'مساعدة') {
return conn.sendMessage(m.chat, {
text: `🆘 *مساعدة جيميناي الذكي*\n\n*الأوامر:*\n• ${usedPrefix + command} [سؤال] - سؤال الذكاء الاصطناعي\n• ${usedPrefix + command} إعادة - إعادة تعيين المحادثة\n• ${usedPrefix + command} مساعدة - عرض هذه الرسالة\n\n*ملاحظات:*\n• يدعم المحادثة المستمرة\n• يمكن استخدامه في المجموعات والخاص\n• يدعم اللغة العربية والإنكليزية\n• للإجابة الطويلة: انتظر قليلاً`,
...global.rcanal
}, { quoted: m });
}

await m.react('🤔');
try {
const sessionId = geminiSessions[m.sender];
const result = await gemini.ask(text, sessionId);
geminiSessions[m.sender] = result.id;
await conn.sendMessage(m.chat, { text: result.text, ...global.rcanal }, { quoted: m });
await m.react('✔️');
} catch (err) {
console.error(err);
await m.react('❌');
await conn.sendMessage(
m.chat,
{ text: '✘ حدث خطأ أثناء معالجة طلبك.\n\nالخطأ: ' + err.message, ...global.rcanal },
{ quoted: m }
);
}
};

handler.tags = ['ai'];
handler.help = ['جيميناي'];
handler.command = ['gemini', 'جيميناي', 'جيميني', 'جيمي', 'صناعي', 'جمي'];

export default handler;