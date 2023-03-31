"use strict";
require('./settings')

const { generateWAMessageFromContent, prepareWAMessageMedia, proto, downloadContentFromMessage, getContentType } = require('@adiwajshing/baileys')
const { exec } = require('child_process')
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');
const util = require('util');
const path = require('path');
const moment = require('moment-timezone');
const db = require('./lib/database');

module.exports = async(mecha, m, update, store) => {
const { pushname, botNumber, content, from, fromMe, isGc, isPc, sender, isBaileys, type, budy } = m
if (msg.key && msg.key.remoteJid === 'status@broadcast') return
const Tnow = (new Date()/1000).toFixed(0)
const seli = Tnow - m.messageTimestamp.low
if (seli > Intervalmsg) return m.reply(`Pesan ${Intervalmsg} detik yang lalu diabaikan agar tidak nyepam`, global.owner)
//console.log(new ReferenceError(`Pesan ${Intervalmsg} detik yang lalu diabaikan agar tidak nyepam`))
try {
/*FUNCTION WAKTU*/
let d = new Date
let gmt = new Date(0).getTime() - new Date('1 Januari 2023').getTime()
const weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
const week = d.toLocaleDateString('id', { weekday: 'long' })
const calender = d.toLocaleDateString('id', { day: 'numeric', month: 'long', year: 'numeric' })
const jam = moment().tz('Asia/Jakarta').format('HH:mm:ss')
/*WATERMARK STICKER*/
const packName = global.packname+'\n\n'+week+', '+calender //+'\n'+jam+' WIB'

/*UCAPAN WAKTU*/
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const salam = 'Selamat '+dt.charAt(0).toUpperCase() + dt.slice(1)

/*DATABASE*/
const users = db.user

const body = (type === 'conversation') ? m.message.conversation : (type == 'imageMessage') ? m.message.imageMessage.caption : (type == 'videoMessage') ? m.message.videoMessage.caption : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId) : '' //(type == 'stickerMessage') && (stikercmd[m.message.stickerMessage.fileSha256.toString('base64')] !== null && stikercmd[m.message.stickerMessage.fileSha256.toString('base64')] !== undefined) ? stikercmd[m.message.stickerMessage.fileSha256.toString('base64')].text : ''
const geturl = budy.trim().split(/ +/).slice(0)[0]
let prefix = global.prefix
//let prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '!'
let no = 1
const isCmd = body.startsWith(prefix)
const isCommand = isCmd ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : ""
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const q1 = q.split('|')[0]
const q2 = q.split('|')[1]
const q3 = q.split('|')[2]
const isOwner = owner.includes(sender) || botNumber.includes(sender)
const command = isOwner ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : isCommand
const comand = prefix+command

const quoted = m.quoted ? m.quoted : m
const qm = (m.quoted || m)
const _quoted = (qm.type == 'buttonsMessage') ? qm[Object.keys(qm)[1]] : (qm.type == 'templateMessage') ? qm.hydratedTemplate[Object.keys(qm.hydratedTemplate)[1]] : (qm.type == 'product') ? qm[Object.keys(qm)[0]] : m.quoted ? m.quoted : m
const mime = (_quoted.msg || _quoted).mimetype || ''
const qmsg = (_quoted.msg || _quoted)
const isMedia = /image|video|sticker|audio/.test(mime)

//Bot hanya merespon jika button miliknya saja yang di tekan 
if (isGc && (type == 'buttonsResponseMessage' && m.message.buttonsResponseMessage.contextInfo.participant !== botNumber || type == 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.contextInfo.participant !== botNumber || type == 'listResponseMessage' && m.message.listResponseMessage.contextInfo.participant !== botNumber)) {return}
require('./mess')(prefix)

const selectedButton = (m.type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : ''
const resbut = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.text ? m.text : '')
const froms = m.quoted ? m.quoted.sender : q ? q.replace(/[^0-9]/g, '')+'@s.whatsapp.net' : false

// GROUP
/*const groupMetadata = isGc ? await mecha.groupMetadata(from).catch(e => {}) : false
const groupName = groupMetadata ? groupMetadata.subject : 'Tidak diketahui'
const participants = groupMetadata ? groupMetadata.participants : []
const groupMembers = (groupMetadata ? await groupMetadata.participants : []) || []
const groupAdmins = isGc ? await findAdmin(participants) : ''
const isBotAdmins = isGc ? groupAdmins.includes(botNumber) : false
const isAdmins = isGc ? groupAdmins.includes(sender) : false
*/

// Auto Read Chats
if (isPc) {mecha.readMessages([m.key])}
// Presence Online
if (isCmd){mecha.sendPresenceUpdate('composing', from)} else {mecha.sendPresenceUpdate('available', from)}

// DATABASE USER
try {
let user = db.user[sender]
if (user) {
if (typeof user !== 'object') users[sender] = {}
if (!('name' in user)) user.name = pushname
if (!('date' in user)) user.date = calender
if (!('stiker' in user)) user.stiker = 0
if (!('banned' in user)) user.banned = false
if (!('premium' in user)) user.premium = false
} else users[sender] = {
name: pushname,
date: calender,
stiker: 0,
banned: false,
premium: false,
}
} catch (err) {console.error(err)}

// DATA USER
const isUser = users[sender] ? true : false
const isBanned = isUser ? users[sender].banned : false
const isPremium = isUser ? users[sender].premium : false
// MEDIA
const isImage = (type === 'imageMessage')
const isVideo = (type === 'videoMessage')
const isSticker = (type == 'stickerMessage')
const isAudio = (type == 'audioMessage')
const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')

const but1 = (id, text) => [{buttonId: id, buttonText: { displayText: text }, type: 1}]
const but2 = (id1, text1, id2, text2) => [{buttonId: id1, buttonText: { displayText: text1 }, type: 1}, {buttonId: id2, buttonText: { displayText: text2 }, type: 1}]
const but3 = (id1, text1, id2, text2, id3, text3) => [{buttonId: id1, buttonText: { displayText: text1 }, type: 1}, {buttonId: id2, buttonText: { displayText: text2 }, type: 1}, {buttonId: id3, buttonText: { displayText: text3 }, type: 1}]
const sendbut = async(id, text, footer, buttons = [], quoted) => {mecha.sendMessage(id, {text: text, footer: footer, buttons: buttons, headerType: 2, mentions: mecha.ments(text, footer)}, {quoted: quoted})}
const sendaudio = async(id, audio, ptt, quoted) => {mecha.sendMessage(id, {audio: {url: audio}, mimetype: 'audio/mpeg', ptt: ptt}, {quoted: quoted})}
const pickRandom = (arr) => {return arr[Math.floor(Math.random() * arr.length)]};
const allchat = await store.chats.all().filter((v) => v.id.endsWith('@s.whatsapp.net')).map((v) => v.id)
const sendAllPc = (teks) => {for (let i of allchat) {mecha.sendMessage(i, {text: teks })}}

const fteks = (teks) => {return {key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? {remoteJid: "status@broadcast"} : {})}, message: {extendedTextMessage: {text: teks}}}}
const ments = (teks) => {return teks.match('@') ? [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : [sender]}
const replys = async(id, teks, quoted) => mecha.sendMessage(id, {text: teks, mentions: ments(`${teks}`), contextInfo: {mentionedJid: ments(`${teks}`), externalAdReply: {showAdAttribution: true, title: `${salam} ${pushname}`, body: fake, previewType: 'PHOTO', thumbnail: global.thumb, sourceUrl: 'https://wa.me/'+owner.split('@')[0] }}}, {quoted})
const replyf = async(id, teks) => mecha.sendMessage(id, {text: teks, mentions: ments(`${teks}`), contextInfo: {mentionedJid: ments(`${teks}`), externalAdReply: {showAdAttribution: true, title: `${salam} ${pushname}`, body: fake, previewType: 'PHOTO', thumbnail: global.thumb, sourceUrl: global.gcs, renderLargerThumbnail: true}}}, {quoted:m})
const fpayment = {key: {remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Multi Device', participant: '0@s.whatsapp.net'}, message: {requestPaymentMessage: {currencyCodeIso4217: "USD", amount1000: 2023, requestFrom: '0@s.whatsapp.net', noteMessage: {extendedTextMessage: {text: 'Copyright © 2023 Surya Skylark, AI. Mecha-Bot'}}, expiryTimestamp: 2023, amount: {value: 1000000000000000, offset: 1000, currencyCode: "USD"}}}}
const reply = async(teks) => {mecha.sendMessage(from, {text: teks, mentions: ments(`${teks}`)}, {quoted:m})}

const onlyOwner = async() => {reply(global.mess.owner)};
const onlyAdmin = async() => {reply(global.mess.admin)};
const onlyGroup = async() => {reply(global.mess.group)};
const botAdmin = async() => {reply(global.mess.botAdmin)};
const onlyWait = async() => {reply(global.mess.wait)};

if (body && isPc && !isOwner) {
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
mecha.sendteks(owner, `• WhatsApp\nFrom: @${sender.split('@')[0]}\nChat: ${body}`)
}

// SELF MODE
if (global.self && update.type === 'notify' && !isOwner) return

// BANNED USER BY SURYA
if (isCmd && isBanned) return
if (isBanned) return

if (isCmd && !isPremium && !isOwner) return reply(global.help.menu(pushname))

// FUNCTION AUTO STICKER BY SURYA
if (global.autosticker && isPc && !isCmd) {
if (users[sender].stiker > global.limit && !isPremium) return reply(`Limit stiker kamu sudah mencapai batas!\nsetiap user hanya diberikan ${limit} limit stiker\nsilahkan upgrade ke premium untuk meningkatkan jumlah batas limit stiker!`)
if (isImage) {
var media = await mecha.downloadAndSaveMediaMessage(quoted, makeid(10))
mecha.mediaToSticker(from, media, m, {packname: packName, author: global.author})
users[sender].stiker += 1
//await fs.unlinkSync(media)
} else if (isVideo) {
if (m.message.videoMessage.seconds > 10) return reply('Maksimal 10 detik!')
var media = await mecha.downloadAndSaveMediaMessage(quoted, makeid(10))
mecha.mediaToSticker(from, media, m, {packname: packName, author: global.author})
users[sender].stiker += 1
//await fs.unlinkSync(media)
}
}

if (isCmd && isGc) {console.log(chalk.bold.rgb(255, 178, 102)('\x1b[1;31m~\x1b[1;37m> [\x1b[1;32mCMD\x1b[1;37m]'), chalk.bold.rgb(153, 255, 153)(command), chalk.bold.rgb(204, 204, 0)("from"), chalk.bold.rgb(153, 255, 204)(pushname), chalk.bold.rgb(204, 204, 0)("in"), chalk.bold.rgb(255, 178, 102)("Group Chat"))}
if (isCmd && !isGc) {console.log(chalk.bold.rgb(255, 178, 102)('\x1b[1;31m~\x1b[1;37m> [\x1b[1;32mCMD\x1b[1;37m]'), chalk.bold.rgb(153, 255, 153)(command), chalk.bold.rgb(204, 204, 0)("from"), chalk.bold.rgb(153, 255, 204)(pushname), chalk.bold.rgb(204, 204, 0)("in"), chalk.bold.rgb(255, 178, 102)("Private Chat"))}

switch(command) {
// INFO MENU
case 'menu':
let menu = `${salam} ${pushname}

Hitung Mundur Idul Fitri 🌙 
${hitungmundur(22, 4, 2023)}

*BOT INFO*
 • Creator : ${ownerName}
 • Bot Name : ${botName}
 • Time : ${jam}
 • Date : ${calender}
 • Runtime : ${global.runtime(process.uptime())}

*USER INFO*
 • Name : ${pushname}
 • Status : ${isOwner ? 'Owner' : isPremium ? 'Premium' : 'Gratisan'}
 • Total Stiker : ${users[sender].stiker}
 
*MAIN MENU*
 • ${prefix}menu
 • ${prefix}test
 • ${prefix}donate
 • ${prefix}listban
 • ${prefix}listprem
 • ${prefix}totalstiker
 
*CONVERTER/TOOLS*
 • ${prefix}self
 • ${prefix}public
 • ${prefix}autosticker
 • ${prefix}anticall
 • ${prefix}autoreadsw

*OWNER MENU*
 • ${prefix}banned
 • ${prefix}unbanned
 • ${prefix}addprem
 • ${prefix}delprem
 • ${prefix}sampah
 • ${prefix}delsampah
 • ${prefix}block
 • ${prefix}unblock
 • ${prefix}listblock
 • ${prefix}delchat
 • ${prefix}join
 • ${prefix}leave

*CONVERTER/TOOLS*
 • ${prefix}sticker
 • ${prefix}swm
`
reply(menu)
break
case 'test':
let test = `Quick Test Done! ${pushname}\n*Runtime:* ${runtime(process.uptime())}`
reply(test)
break
case 'donate':
reply(global.help.donate(pushname))
break
case 'listban': 
let ubanned = Object.entries(users).filter(ubanned => ubanned[1].banned).map(([key, value]) => {return { ...value, jid: key }})
let sortedban = ubanned.map(toNumber('banned')).sort(sort('banned'))
reply(`*LIST USER BANNED*\nTotal : *${ubanned.length}*
${sortedban.slice(0, 10).map(({ jid, name }, i) => `\n*▸ ID:* @${jid.split('@')[0]}\n*▸ Name:* ${name}`).join`\n`}`.trim())
break
case 'listprem': 
let uprem = Object.entries(users).filter(uprem => uprem[1].premium).map(([key, value]) => {return { ...value, jid: key }})
let sortedprem = uprem.map(toNumber('premium')).sort(sort('premium'))
reply(`*LIST USER PREMIUM*\nTotal : *${uprem.length}*
${sortedprem.slice(0, 10).map(({ jid, name }, i) => `\n*▸ ID:* @${jid.split('@')[0]}\n*▸ Name:* ${name}`).join`\n`}`.trim())
break
case 'totalstiker': case 'ts':
let total = 0
for (let i of Object.keys(users)) {
total += +users[i].stiker
}
reply(`Total stiker yang telah dibuat oleh bot ini adalah *${Number(total)}* stiker`)
break
// BOT MANAGEMENT
case 'self':
if (!isOwner) return onlyOwner()
if (global.self) return reply('Udah di mode self kak')
global.self = true
reply('Berhasil berubah ke mode self')
break
case 'public': case 'publik':
if (!isOwner) return onlyOwner()
if (!global.self) return reply('Udah di mode public kak')
global.self = false
reply('Berhasil berubah ke mode public')
break
case 'autosticker': case 'autostiker':
if (!isOwner) return onlyOwner()
if (args[0] == 'on'){
if (global.autosticker) return reply('UDAH ON!')
global.autosticker = true
reply('Fitur auto sticker telah di aktifkan')
} else if (args[0] == 'off'){
if (!global.autosticker) return reply('UDAH OFF!')
global.autosticker = false
reply('Fitur auto sticker telah di matikan')
} else sendbut(from, `MODE AUTO STICKER`, `Silahkan pilih salah satu`, but2(`${prefix+command} on`, 'ON', `${prefix+command} off`, 'OFF'), m)
break
case 'anticall':
if (!isOwner) return onlyOwner()
if (args[0] == 'on'){
if (global.anticall) return reply('UDAH ON!')
global.anticall = true
reply('Fitur auto reject telah di aktifkan')
} else if (args[0] == 'off'){
if (!global.anticall) return reply('UDAH OFF!')
global.anticall = false
reply('Fitur auto reject telah di matikan')
} else sendbut(from, `MODE ANTI CALL AUTO REJECT`, `Silahkan pilih salah satu`, but2(`${prefix+command} on`, 'ON', `${prefix+command} off`, 'OFF'), m)
break
case 'autoreadsw':
if (!isOwner) return onlyOwner()
if (args[0] == 'on'){
if (global.autoreadsw) return reply('UDAH ON!')
global.autoreadsw = true
reply('Fitur auto read sw telah di aktifkan')
} else if (args[0] == 'off'){
if (!global.autoreadsw) return reply('UDAH OFF!')
global.autoreadsw = false
reply('Fitur auto read sw telah di matikan')
} else sendbut(from, `MODE AUTO REJECT`, `Silahkan pilih salah satu`, but2(`${prefix+command} on`, 'ON', `${prefix+command} off`, 'OFF'), m)
break
// OWNER MENU
case 'banned': case 'ban':
if (!isOwner) return onlyOwner()
if (m.quoted || q) {
if (!(froms in users)) return reply('User tidak terdaftar didalam DATABASE!')
if (users[froms].banned) return reply('Udah banned!')
users[froms].banned = true
reply(`Berhasil banned *${users[froms].name}*`)
} else reply('Tag atau reply pesan target!')
break
case 'unbanned': case 'unban':
if (!isOwner) return onlyOwner()
if (m.quoted || q) {
if (!(froms in users)) return reply('User tidak terdaftar didalam DATABASE!')
if (!users[froms].banned) return reply('Udah unbanned!')
users[froms].banned = false
reply(`Berhasil menghapus *${users[froms].name}* dari daftar banned`)
} else reply('Tag atau reply pesan target!')
break
case 'addprem':
if (!isOwner) return onlyOwner()
if (m.quoted || q) {
if (!(froms in users)) return reply('User tidak terdaftar didalam DATABASE!')
if (users[froms].premium) return reply('Udah premium!')
users[froms].premium = true
reply(`Berhasil premium *${users[froms].name}*`)
} else reply('Tag atau reply pesan target!')
break
case 'delprem':
if (!isOwner) return onlyOwner()
if (m.quoted || q) {
if (!(froms in users)) return reply('User tidak terdaftar didalam DATABASE!')
if (!users[froms].premium) return reply('Belom premium!')
users[froms].premium = false
reply(`Berhasil menghapus *${users[froms].name}* dari daftar premium`)
} else reply('Tag atau reply pesan target!')
break
case 'sampah':
if (!isOwner) return onlyOwner()
let all = await fs.readdirSync('./sampah')
var teks = `JUMLAH SAMPAH SYSTEM\n\n`
teks += `Total : ${all.filter(v => v.endsWith("gif") || v.endsWith("png") || v.endsWith("mp3") || v.endsWith("mp4") || v.endsWith("jpg") || v.endsWith("jpeg") || v.endsWith("webp") || v.endsWith("webm") ).map(v=>v).length} Sampah\n\n`
teks += all.filter(v => v.endsWith("gif") || v.endsWith("png") || v.endsWith("mp3") || v.endsWith("mp4") || v.endsWith("jpg") || v.endsWith("jpeg") || v.endsWith("webp") || v.endsWith("webm") ).map(o=>`${o}\n`).join("");
reply(teks)
break
case 'delsampah':{
if (!isOwner) return onlyOwner()
let directoryPath = path.join('./sampah') //path.join();
fs.readdir(directoryPath, async function (err, files) {
if (err) {
return reply('Tidak dapat memindai direktori: ' + err);
} 
let filteredArray = await files.filter(item => item.endsWith("gif") || item.endsWith("png") || item.endsWith("mp3") || item.endsWith("mp4") || item.endsWith("jpg") || item.endsWith("jpeg") || item.endsWith("webp") || item.endsWith("webm") || item.endsWith("bin")  )
var teks = `Terdeteksi ${filteredArray.length} file sampah\n\n`
if (filteredArray.length == 0) return reply(teks)
filteredArray.map(function(e, i){
teks += (i+1)+`. ${e}\n`
})
reply(teks)
await sleep(2000)
reply("Menghapus file sampah...")
await filteredArray.forEach(function (file) {
fs.unlinkSync(`./sampah/${file}`)
});
await sleep(2000)
reply("Berhasil menghapus semua sampah")
});
}
break
case 'block': case 'blok':
if (!isOwner) return onlyOwner()
if (!q) return reply(`Masukkan nomor target!`)
let blok = q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
mecha.updateBlockStatus(blok, 'block')
reply(`Sukses block @${blok.split('@')[0]}`)
break
case 'unblock': case 'unblok':
if (!isOwner) return onlyOwner()
if (!q) return reply(`Masukkan nomor target!`)
let unblok = q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
mecha.updateBlockStatus(unblok, 'unblock')
reply(`Sukses unblock @${unblok.split('@')[0]}`)
break
case 'listblock': case 'listblok':
if (!isOwner) return onlyOwner()
let listblok = await mecha.fetchBlocklist()
reply('*LIST BLOCK*\n' + `Total: ${listblok == undefined ? '*0* Diblokir' : '*' + listblok.length + '* Diblokir'}\n\n` + listblok.map(v => '» @' + v.replace(/@.+/, '')).join`\n`)
break
case 'delchat':
if (!isOwner) return onlyOwner()
var teks = q ? q : from
await mecha.chatModify({delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }]}, teks)
reply(mess.ok)
break
case 'join':
if (!isOwner) return onlyOwner()
if (m.quoted || q) {
var url = m.quoted ? m.quoted.text : args[0]
url = url.split('https://chat.whatsapp.com/')[1]
var data = await mecha.groupAcceptInvite(url)
reply(String(data))
} else reply(`Kirim perintah ${comand} _linkgrup_`)
break
case 'leave':
if (!isOwner) return onlyOwner()
var teks = q ? q : from
reply('Siap Tuan🫡')
setTimeout(() => {mecha.groupLeave(teks)}, 3000)
break
case 'sticker': case 'stiker': case 's': {
if (/image/.test(mime)) {
let media = await mecha.downloadAndSaveMediaMessage(quoted, makeid(5))
mecha.mediaToSticker(from, media, m, {packname: packName, author: global.author})
} else if (/video/.test(mime)) {
onlyWait()
if (quoted.seconds > 11) return m.reply('Maksimal 10 detik!')
let media = await mecha.downloadAndSaveMediaMessage(quoted, makeid(5))
mecha.vidToSticker(from, media, m, { packname: packName, author: global.author })
} else if (/sticker/.test(mime)) {
let media = await mecha.downloadAndSaveMediaMessage(quoted, makeid(5))
mecha.mediaToSticker(from, media, m, {packname: packName, author: global.author})
} else reply(`Kirim atau reply gambar dengan caption ${comand}`)
}
break
case 'swm':
if (!q) return reply('Teksnya mana om?')
if (/image|video|sticker/.test(mime)) {
var media = await mecha.downloadAndSaveMediaMessage(quoted, makeid(5))
mecha.mediaToSticker(from, media, m, {packname: q.split('|')[0], author: q.split('|')[1]})
}
break
default:
if (budy.startsWith('> ') && isOwner) {
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
await m.reply(String(err))
}
}

if (budy.startsWith('$ ') && isOwner) {
exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) return m.reply(stdout)
})
}

} // akhir dari switch command
} catch (err){
let e = String(err)
console.log(chalk.redBright('[ ERROR ]'), chalk.whiteBright(util.format(err)))
if (e.includes('Cannot convert undefined or null to object')){ return }
//m.reply(`───「 *SYSTEM-ERROR* 」───\n\n${e}`)
if (m.isGc) {mecha.sendMessage(global.owner, {text: `${util.format(err)}`})} else {mecha.sendMessage(global.owner, {text: `───「 *SYSTEM-ERROR* 」───\n\nIn chat: @${m.sender.split('@')[0]}\n\n${e}`, mentions: [m.sender]})}
}
}

global.reloadFile(__filename)