var handler = async (m, {conn, groupMetadata }) => {

conn.reply(m.chat, `${await groupMetadata.id}`,   )

}
handler.help = ['dd']
handler.tags = ['dd']
handler.command = /^(m-chat)$/i

handler.group = true
handler.owner = true
export default handler