const fs = require('fs'),
chalk = require('chalk')

global.owner = '62895415497664@s.whatsapp.net'
global.ownerName = 'ẉ.ceo/Surya ©️'
global.botName = 'Mecha Bot Multi Device'
global.fake = 'Copyright © 2023 ẉ.ceo/Surya'
global.packname = '𝑆𝑡𝑖𝑐𝑘𝑒𝑟 𝑀𝑎𝑘𝑒𝑟 𝑏𝑦 𝑆𝑢𝑟𝑦𝑎シ︎\n𝐶𝑟𝑒𝑎𝑡𝑒𝑑 ❤️ 𝑏𝑦 𝑀𝑒𝑐ℎ𝑎 𝐵𝑜𝑡'
global.mywebs = 'https://bit.ly/3WoS6RZ' // 'https://mywebs.surya2105.repl.co'
global.replyType = 'web'
global.session = 'session'
global.dbName = 'db.json'
global.prefix = '.'
global.self = false
global.autosticker = true
global.anticall = true
global.autoreadsw = true
global.limit = 100
Intervalmsg = 1000

// FUNCTION BUTTON
global.but1 = (id, text) => [{buttonId: id, buttonText: {displayText: text}, type: 1}]
global.but2 = (id1, text1, id2, text2) => [{buttonId: id1, buttonText: {displayText: text1}, type: 1}, {buttonId: id2, buttonText: {displayText: text2}, type: 1}]
global.but3 = (id1, text1, id2, text2, id3, text3) => [{buttonId: id1, buttonText: {displayText: text1}, type: 1}, {buttonId: id2, buttonText: {displayText: text2}, type: 1}, {buttonId: id3, buttonText: {displayText: text3}, type: 1}]

// FAKE REPLY
const ments = (text) => {return text.match('@') ? [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : []}
global.f1 = (a, b) => {let f1 = {key: {remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net'}, message: {orderMessage: {itemCount: 1000000, status: 1, surface: 1, message: a, orderTitle: '', thumbnail: b, sellerJid: '0@s.whatsapp.net'}}};return f1}
global.f2 = (a, b, c, d) => {let f2 = {contextInfo: {mentionedJid: ments(a+d), externalAdReply: {showAdAttribution: true, mediaType: 1, title: a, thumbnail: {url: b}, thumbnailUrl: b, sourceUrl: c, renderLargerThumbnail: true}}};return f2}

// SETTING THUMBNAIL
global.thumb = fs.readFileSync('./thumb.jpeg')
global.ppkosong = 'https://telegra.ph/file/ea7ef3f59921d1821a0d1.jpg'
global.thum = 'https://telegra.ph/file/566686510b639c7d0f2b2.jpg'

global.help = {
menu(pushname){
return `Halo ${pushname}👋🏻

Saya adalah bot WhatsApp autostiker
kirim gambar untuk membuat stiker.`
},
donate(pushname){
return `Halo ${pushname}👋🏻

Kamu bisa mendukung saya agar bot ini tetap up to date dengan:
*⭝ DANA* : 0895415497664 
*⭝ OVO* : 0895415497664
*⭝ PULSA* : 0895415497664
*⭝ GOPAY* : 0895415497664
*⭝ SAWERIA* : https://saweria.co/suryaskylark

Berapapun donasi kamu akan sangat berarti, Arigatou!`
}
}

// MY FUNCTION
const axios = require('axios')

global.getBuffer = async(url, options) => {
try {
options ? options : {}
let res = await axios({method: 'GET', url, headers: {'DNT': 1, 'Upgrade-Insecure-Request': 1}, ...options, responseType: 'arraybuffer'});
return res.data;
} catch (err) {
return err
}
}

global.fetchBuffer = async(url, options) => {
try {
options ? options : {}
let res = await axios({method: 'GET', url, headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36", 'DNT': 1, 'Upgrade-Insecure-Request': 1}, ...options, responseType: 'arraybuffer'})
return res.data;
} catch (err) {
return err
}
}

global.fetchJson = async (url, options) => {
try {
options ? options : {}
const res = await axios({method: 'GET', url: url, headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'}, ...options})
return res.data;
} catch (err) {
return err
}
}

global.makeid = (length) => {
let result = '';
let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let charactersLength = characters.length;
for (let i = 0; i < length; i++) {
result += characters.charAt(Math.floor(Math.random() *
charactersLength));
}
return result;
}

global.isEmoji = (emo) => {
let emoji_ranges = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
let regexEmoji = new RegExp(emoji_ranges, 'gi');
return emo.match(regexEmoji)
}

global.hitungmundur = (tanggal, bulan, tahun) => {
let from = new Date(`${bulan} ${tanggal}, ${tahun} 00:00:00`).getTime();
let now = Date.now();
let distance = from - now;
let days = Math.floor(distance / (1000 * 60 * 60 * 24));
let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
let seconds = Math.floor((distance % (1000 * 60)) / 1000);
return days + ' hari ' + hours + ' jam ' + minutes + ' menit ' + seconds + ' detik'
}

global.FileSize = (number) => {
var SI_POSTFIXES = ["B", " KB", " MB", " GB", " TB", " PB", " EB"]
var tier = Math.log10(Math.abs(number)) / 3 | 0
if(tier == 0) return number
var postfix = SI_POSTFIXES[tier]
var scale = Math.pow(10, tier * 3)
var scaled = number / scale
var formatted = scaled.toFixed(1) + ''
if (/\.0$/.test(formatted))
formatted = formatted.substr(0, formatted.length - 2)
return formatted + postfix
}

global.randomNomor = (min, max = null) => {
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}

global.sort = (property, ascending = true) => {
if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

global.toNumber = (property, _default = 0) => {
if (property) return (a, i, b) => {
return {...b[i], [property]: a[property] === undefined ? _default : a[property]}
}
else return a => a === undefined ? _default : a
}

global.sendKontak = (sur, jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'item1.X-ABLabel:Ponsel\n'
+ 'item2.EMAIL;type=INTERNET:suryaskylark05@gmail.com\n'
+ 'item2.X-ABLabel:Email\nitem3.URL:https://instagram.com/surya_skylark05\n'
+ 'item3.X-ABLabel:Instagram\n'
+ 'item4.ADR:;;Indonesia;;;;\n'
+ 'item4.X-ABLabel:Region\n'
+ 'END:VCARD'
return sur.sendMessage(jid, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []}, {quoted: quoted})
}

global.runtime = function(seconds) {
seconds = Number(seconds);
var d = Math.floor(seconds / (3600 * 24));
var h = Math.floor(seconds % (3600 * 24) / 3600);
var m = Math.floor(seconds % 3600 / 60);
var s = Math.floor(seconds % 60);
var dDisplay = d > 0 ? d + (d == 1 ? " ℎ𝑎𝑟𝑖, " : " ℎ𝑎𝑟𝑖, ") : "";
var hDisplay = h > 0 ? h + (h == 1 ? " 𝑗𝑎𝑚, " : " 𝑗𝑎𝑚, ") : "";
var mDisplay = m > 0 ? m + (m == 1 ? " 𝑚𝑒𝑛𝑖𝑡, " : " 𝑚𝑒𝑛𝑖𝑡, ") : "";
var sDisplay = s > 0 ? s + (s == 1 ? " 𝑑𝑒𝑡𝑖𝑘" : " 𝑑𝑒𝑡𝑖𝑘") : "";
return dDisplay + hDisplay + mDisplay + sDisplay;
}

global.clockString = (ms) => {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

global.sleep = async (ms) => {
return new Promise(resolve => setTimeout(resolve, ms));
}

global.isUrl = (url) => {
return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

// MENGHAPUS CACHE SETELAH UPDATE
function uncache(module = '.'){
return new Promise((resolve, reject) => {
try {
delete require.cache[require.resolve(module)]
resolve()
} catch (e) {reject(e)}
})
}

function nocache(module, cb = () => {}){
console.log(chalk.cyanBright("[ LOAD FILE ]"), chalk.whiteBright(`${module}`))
fs.watchFile(require.resolve(module), async () => {await uncache(require.resolve(module));cb(module)})
}

global.reloadFile = (file, options = {}) => {nocache(file, module => console.log(chalk.greenBright("[ UPDATE ]"), chalk.whiteBright(`${file}`)))}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.greenBright("[ UPDATE ]"), chalk.whiteBright(`${__filename}`) )
delete require.cache[file]
require(file)
})