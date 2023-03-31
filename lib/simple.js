const { proto, delay, getContentType } = require('@adiwajshing/baileys')
const chalk = require('chalk')
const fs = require('fs')

/**
 * Serialize Message
 * @param {WAConnection} sur 
 * @param {Object} m 
 * @param {store} store 
 */
exports.smsg = (sur, m, store) => {
if (!m) return m
let M = proto.WebMessageInfo
if (m.key) {
m.id = m.key.id
m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
m.from = m.key.remoteJid
m.fromMe = m.key.fromMe
m.isGc = m.from.endsWith('@g.us')
m.isPc = m.from.endsWith('@s.whatsapp.net')
m.sender = sur.decodeJid(m.fromMe && sur.user.id || m.participant || m.key.participant || m.from || '')
if (m.isGc) m.participant = sur.decodeJid(m.key.participant) || ''
}
if (m.message) {
m.content = JSON.stringify(m.message)
m.botNumber = sur.user.id ? sur.user.id.split(":")[0]+"@s.whatsapp.net" : sur.user.jid
m.pushname = m.pushName || 'No Name'
m.type = getContentType(m.message)
m.msg = (m.type == 'viewOnceMessageV2' ? m.message[m.type].message[getContentType(m.message[m.type].message)] : m.message[m.type])
m.budy = (m.type === 'conversation') ? m.message.conversation : (m.type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : '' 
m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.type == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.type == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.type == 'viewOnceMessageV2') && m.msg.caption || m.text
let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
if (m.quoted) {
let type = Object.keys(m.quoted)[0]
m.quoted = m.quoted[type]
if (['productMessage'].includes(type)) {
type = Object.keys(m.quoted)[0]
m.quoted = m.quoted[type]
}
if (typeof m.quoted === 'string') m.quoted = {
text: m.quoted
}
m.quoted.mtype = type
m.quoted.id = m.msg.contextInfo.stanzaId
m.quoted.chat = m.msg.contextInfo.remoteJid || m.from
m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
m.quoted.sender = sur.decodeJid(m.msg.contextInfo.participant)
m.quoted.fromMe = m.quoted.sender === sur.decodeJid(sur.user.id)
m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
m.getQuotedObj = m.getQuotedMessage = async () => {
if (!m.quoted.id) return false
let q = await store.loadMessage(m.from, m.quoted.id, sur)
return exports.smsg(sur, q, store)
}
let vM = m.quoted.fakeObj = M.fromObject({
key: {
remoteJid: m.quoted.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id
},
message: quoted,
...(m.isGc ? { participant: m.quoted.sender } : {})
})
m.quoted.delete = () => sur.sendMessage(m.quoted.chat, { delete: vM.key })
m.quoted.copyNForward = (jid, forceForward = false, options = {}) => sur.copyNForward(jid, vM, forceForward, options)
m.quoted.download = () => sur.downloadMediaMessage(m.quoted)
}
}
if (m.msg.url) m.download = () => sur.downloadMediaMessage(m.msg)
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
m.reply = (text, chatId = m.from, options = {}) => Buffer.isBuffer(text) ? sur.sendteks(chatId, text, m, { ...options }) : sur.sendteks(chatId, text, m, { ...options })
m.copy = () => exports.smsg(sur, M.fromObject(M.toObject(m)))
m.copyNForward = (jid = m.from, forceForward = false, options = {}) => sur.copyNForward(jid, m, forceForward, options)

return m
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.greenBright("[ UPDATE ]"), chalk.whiteBright(`${__filename}`) )
delete require.cache[file]
require(file)
})