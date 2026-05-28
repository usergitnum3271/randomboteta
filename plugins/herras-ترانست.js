import translate from '@vitalets/google-translate-api'

var handler = async (m, { conn, usedPrefix, command, args }) => {
try {
let text = args.join(' ') || m.quoted?.text
if (!text) return conn.reply(m.chat, '⌬ لا شيء يُترجم من العدم... اكتب نصًا أو اقتبس رسالة.', m)

const buttons = [
  { buttonId: `${usedPrefix + command} ar ${text}`, buttonText: { displayText: '🇸🇦 العربية' }, type: 1 },
  { buttonId: `${usedPrefix + command} en ${text}`, buttonText: { displayText: '🇺🇸 الإنجليزية' }, type: 1 },
  { buttonId: `${usedPrefix + command} es ${text}`, buttonText: { displayText: '🇪🇸 الإسبانية' }, type: 1 },
  { buttonId: `${usedPrefix + command} pt ${text}`, buttonText: { displayText: '🇧🇷 البرتغالية' }, type: 1 },
  { buttonId: `${usedPrefix + command} fr ${text}`, buttonText: { displayText: '🇫🇷 الفرنسية' }, type: 1 },
  { buttonId: `${usedPrefix + command} it ${text}`, buttonText: { displayText: '🇮🇹 الإيطالية' }, type: 1 },
  { buttonId: `${usedPrefix + command} de ${text}`, buttonText: { displayText: '🇩🇪 الألمانية' }, type: 1 }
]

if (args[0] && args[0].length === 2) {
  let lang = args[0]
  let content = args.slice(1).join(' ') || m.quoted?.text
  await m.react('🕒')
  const result = await translate(content, { to: lang, autoCorrect: true })
  await conn.reply(m.chat, `⌬ الترجمة إلى (${lang}):\n\n${result.text}`, m)
  return await m.react('✔️')
}

await conn.sendMessage(
  m.chat,
  {
    text: '⌬ اختر اللغة... ودع الباقي عليّ.',
    footer: 'Moriarty Protocol ☬',
    buttons,
    headerType: 1
  },
  { quoted: m }
)

} catch (e) {
await m.react('✖️')
conn.reply(
  m.chat,
  `⚠︎ حدث خلل في الخطة...\n⌁ ${usedPrefix + command}\n\n${e.message}`,
  m
)
}}

handler.help = ['ترانست']
handler.tags = ['utils']
handler.command = ['ترانست']

export default handler