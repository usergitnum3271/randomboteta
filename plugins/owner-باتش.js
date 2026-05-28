import fs from 'fs/promises'; 
import path from 'path'; 

const handler = async (m, {conn, isROwner, usedPrefix, command, text}) => {
	const allowedUsers = [
  '212726312195@s.whatsapp.net'
];

if (!allowedUsers.includes(m.sender)) {
  return m.reply('❌ هذا الأمر مسموح للمطور فقط.');
}
  const ar = Object.keys(plugins);
  const ar1 = ar.map((v) => v.replace('.js', ''));
  
  if (!text) {
    const pluginsList = ar1.map((v) => `*◉* ${v}`).join('\n');
    return m.reply(`*✍️ من فضلك اكتب اسم أي بلجن موجود (ملف)*
 
*—◉ مثال*
*◉ ${usedPrefix + command}* info-infobot

*—◉ قائمة البلجنز (الملفات) الموجودة:*
${pluginsList}`);
  }

  const pluginName = text.replace(/.js$/i, '');
  const pluginFileName = `${pluginName}.js`;
  const pluginPath = path.join('./plugins', pluginFileName);

  if (!ar1.includes(pluginName)) {
    const pluginsList = ar1.map((v) => `*◉* ${v}`).join('\n');
    return m.reply(`*⭕ لم يتم العثور على أي بلجن (ملف) باسم "${text}"، من فضلك أدخل اسم موجود*
 
*==================================*

*—◉ قائمة البلجنز (الملفات) الموجودة:*
${pluginsList}`);
  }

  let fileContent;
  
  try {
    fileContent = await fs.readFile(pluginPath, 'utf8');
    
    const messageResult = await conn.sendMessage(m.chat, {text: fileContent}, {quoted: m});
    
    await conn.sendMessage(
      m.chat, 
      {
        document: Buffer.from(fileContent, 'utf8'),
        mimetype: 'application/javascript', 
        fileName: pluginFileName
      }, 
      {quoted: messageResult}
    );
    
  } catch (error) {
    console.error('Error reading the plugin:', error);
    m.reply(`*❌ خطأ في قراءة الملف*\n\n*تفاصيل الخطأ:*\n${error.message}`);
  }
};

handler.help = ['باتش'].map((v) => v + ' *<اسم الأمر>*');
handler.tags = ['owner'];
handler.command = ['getplugin', 'gp','باتش'];

export default handler;