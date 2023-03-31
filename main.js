process.on('uncaughtException', console.error)
require('./settings')
//berikut adalah kode uptime robot untuk replit (buat yang paham aja)
//require("http").createServer((_, res) => res.end("Uptime!")).listen(8080)

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const FileType = require('file-type')
const fs = require('fs')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExif, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg } = require('./lib/simple')
const { toBuffer, toDataURL } = require('qrcode')
const express = require('express')
let app = express()
let _qr = 'invalid'
let PORT = process.env.PORT
const path = require('path')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

async function connect() {
const { state, saveCreds } = await useMultiFileAuthState(`./${global.session}`)
const { version, isLatest } = await fetchLatestBaileysVersion()

const mecha = makeWASocket({
version,
logger: pino({ level: 'silent' }),
printQRInTerminal: true,
browser: ['Mecha Multi Device', 'Safari', '1.0.0'],
auth: state,
patchMessageBeforeSending: (message) => {
const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
if (requiresPatch) {message = {viewOnceMessage: {message: {messageContextInfo: { deviceListMetadataVersion: 2, deviceListMetadata: {}}, ...message }}}}
return message;
}
})

store.bind(mecha.ev)

mecha.ev.on('messages.upsert', async update => {
//console.log(JSON.stringify(update, undefined, 2))
try {
msg = update.messages[0]
if (!msg.message) return
msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
if (global.autoreadsw && msg.key.remoteJid === 'status@broadcast') {mecha.readMessages([msg.key])}
if (msg.key.id.startsWith('BAE5') && msg.key.id.length === 16) return
m = smsg(mecha, msg, store)
require('./mecha')(mecha, m, update, store, msg)
} catch (err) {
console.log(err)
}
})

mecha.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect, qr } = update 
if (qr) {
app.use(async (req, res) => {
res.setHeader('content-type', 'image/png')
res.end(await toBuffer(qr))
})
app.use(express.static(path.join(__dirname, 'views')))
app.listen(PORT, () => {
console.log('App listened on port', PORT)
})
}
if (connection === 'close') {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode
if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); mecha.logout(); }
else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); connect(); }
else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); connect(); }
else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, reconnecting..."); connect(); }
else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); mecha.logout(); }
else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); connect(); }
else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); connect(); }
else if (reason === DisconnectReason.Multidevicemismatch) { console.log("Multi device mismatch, please scan again"); mecha.logout(); }
else mecha.end(`Unknown DisconnectReason: ${reason}|${connection}`)
}
if (update.connection == 'open' || update.receivedPendingNotifications == 'true') {
console.log(`Connected to = ` + JSON.stringify(mecha.user, null, 2))
await store.chats.all()
await mecha.sendteks(global.owner, 'Bot telah tersambung ke koneksi Server WhatsApp Web', global.f1('Notifikasi Connection', global.thumb))
}
})

mecha.ev.on('call', async(json) => {
try {
const { from, id, status } = json[0]
//if (from == owner) return
if (global.anticall && status == 'offer') {
const stanza = {
tag: 'call',
attrs: {
from: mecha.user.id,
to: from,
id: mecha.generateMessageTag(),
},
content: [{
tag: 'reject',
attrs: {
'call-id': id,
'call-creator': from,
count: '0',
},
content: undefined,
},
],
}
await mecha.query(stanza)
if (from !== owner) return mecha.sendbut(global.owner, `Terdeteksi @${from.split('@')[0]} telah menelfon bot`, 'klik tombol untuk memblokir', but1(`${global.prefix}block ${from.split('@')[0]}`, 'Blokir'), global.f1('Notifikasi Keamanan Bot!', global.thumb))
//await mecha.sendMessage(from, {text: `*ANTI CALL AUTO REJECT*\n\nCall detected from @${from.split('@')[0]}\nPlease Don't Call Bots!`, mentions: [from] }, {quoted: global.f1('Notifikasi Keamanan Bot!', global.thumb)})
}
} catch (e){console.log(e)}
})

mecha.ev.on('creds.update', saveCreds)

mecha.ments = (teks) => {
return teks.match('@') ? [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : []
}

mecha.sendbut = async(chatId, text, footer, buttons = [], quoted) => {
mecha.sendMessage(chatId, {text: text, footer: footer, buttons: buttons, headerType: 2, mentions: mecha.ments(text)}, {quoted: quoted})
}

mecha.sendteks = async(chatId, text, quoted = '', opts = {}) => {
mecha.sendMessage(chatId, {text: text, mentions: await mecha.ments(text), ...opts}, {quoted:quoted})
}

mecha.resize = async(buff) => {
const jimp = await Jimp.read(buff);
const crop = jimp.crop(0, 0, (await jimp.getWidth()), (await jimp.getHeight()));
return {img: await crop.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),preview: await crop.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG)}
}

mecha.createprofile = async(chatId, buff) => {
const { img } = await mecha.resize(buff);
return mecha.query({ tag: 'iq', attrs: { to: chatId, type:'set', xmlns: 'w:profile:picture' }, content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }] })
}

// Setting
mecha.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

mecha.ev.on('contacts.update', update => {
for (let contact of update) {
let id = mecha.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

mecha.getName = (jid, withoutContact = false) => {
id = mecha.decodeJid(jid)
withoutContact = mecha.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = mecha.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === mecha.decodeJid(mecha.user.id) ?
mecha.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

mecha.sendContact = async (jid, kon, quoted = '', opts = {}) => {
let list = []
for (let i of kon) {
list.push({
displayName: await mecha.getName(i + '@s.whatsapp.net'),
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await mecha.getName(i + '@s.whatsapp.net')}\nFN:${await mecha.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:email@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://youtube.com/\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
})
}
mecha.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
}

mecha.setStatus = (status) => {
mecha.query({
tag: 'iq',
attrs: {
to: '@s.whatsapp.net',
type: 'set',
xmlns: 'status',
},
content: [{
tag: 'status',
attrs: {},
content: Buffer.from(status, 'utf-8')
}]
})
return status
}

mecha.serializeM = (m) => smsg(mecha, m, store)

mecha.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
let type = await mecha.getFile(path, true)
let { res, data: file, filename: pathFile } = type
if (res && res.status !== 200 || file.length <= 65536) {
try {
throw {
json: JSON.parse(file.toString())
}
}
catch (e) {
if (e.json) throw e.json
}
}
let opt = { filename }
if (quoted) opt.quoted = quoted
if (!type) options.asDocument = true
let mtype = '',
mimetype = type.mime,
convert
if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
else if (/video/.test(type.mime)) mtype = 'video'
else if (/audio/.test(type.mime))(
convert = await toAudio(file, type.ext),
file = convert.data,
pathFile = convert.filename,
mtype = 'audio',
mimetype = 'audio/ogg; codecs=opus'
)
else mtype = 'document'
if (options.asDocument) mtype = 'document'

delete options.asSticker
delete options.asLocation
delete options.asVideo
delete options.asDocument
delete options.asImage

let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype, fileName: filename || pathFile.split('/').pop() }
let m
try {
m = await mecha.sendMessage(jid, message, { ...opt, ...options
})
}
catch (e) {
//console.error(e)
m = null
}
finally {
if (!m) m = await mecha.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
file = null
return m
}
}

mecha.imgToSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await mecha.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

mecha.mediaToSticker = async (jid, path, quoted, options = {}) => {
let { ext, mime, data } = await mecha.getFile(path)
let media = {}
let buffer
media.data = data
media.mimetype = mime
if (options && (options.packname || options.author)) {
buffer = await writeExif(media, options)
} else {
buffer = /image/.test(mime) ? await imageToWebp(data) : /video/.test(mime) ? await videoToWebp(data) : ""
}
await mecha.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

mecha.vidToSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await mecha.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

mecha.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await mecha.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

mecha.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
let trueFileName = attachExtension ? ('./sampah/' + filename + '.' + type.ext) : './sampah/' + filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

mecha.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
} 

mecha.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await mecha.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
}

mecha.sendVideo = async (jid, path, gif = false, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await mecha.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
}

mecha.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
let types = await mecha.getFile(path, true)
let { mime, ext, res, data, filename } = types
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }
}
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'
}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await mecha.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)
}

mecha.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}}

let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await mecha.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
return waMessage
}

mecha.cMod = (jid, copy, text = '', sender = mecha.user.id, options = {}) => {
//let copy = message.toJSON()
let mtype = Object.keys(copy.message)[0]
let isEphemeral = mtype === 'ephemeralMessage'
if (isEphemeral) {
mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
}
let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
let content = msg[mtype]
if (typeof content === 'string') msg[mtype] = text || content
else if (content.caption) content.caption = text || content.caption
else if (content.text) content.text = text || content.text
if (typeof content !== 'string') msg[mtype] = {
...content,
...options
}
if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
copy.key.remoteJid = jid
copy.key.fromMe = sender === mecha.user.id

return proto.WebMessageInfo.fromObject(copy)
}

mecha.getFile = async (PATH, returnAsFilename) => {
let res, filename
const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
const type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'
}
if (data && returnAsFilename && !filename) (filename = path.join(__dirname, '../sampah/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
return { res, filename, ...type, data, deleteFile() {return filename && fs.promises.unlink(filename)} }
}

return mecha
}

connect()