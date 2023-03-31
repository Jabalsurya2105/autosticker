const fs = require('fs')
const chalk = require('chalk')

module.exports = async (prefix) => {
try {
global.mess = {
wait: 'Mohon tunggu sebentar...',
ok: 'Done!',
limit: `Limit kamu sudah habis! silahkan kirim ${prefix}limit untuk mengecek limit`,
premium: 'Fitur ini hanya dapat diakses oleh Premium!',
owner: 'Fitur ini hanya dapat diakses oleh Owner!',
group: 'Fitur ini hanya dapat diakses di dalam group!',
private: 'Fitur ini hanya dapat diakses di private chat!',
admin: 'Fitur ini hanya dapat diakses oleh admin group!',
botAdmin: 'Bot bukan admin, tidak dapat mengakses fitur tersebut!',
bot: 'Fitur ini hanya dapat diakses oleh Bot',
error: {
Iv: 'Link yang kamu berikan tidak valid', 
api: 'Maaf terjadi kesalahan'
},
block: {
owner: `Fitur tersebut sedang di block oleh owner!`,
system: `Fitur tersebut sedang di block oleh system karena terjadi error!`
},
query: 'Masukan query',
search: 'Searching...',
scrap: '*Scrapping...*',
wrongFormat: 'Format salah, coba liat lagi di menu'
}

} catch (err) {console.log(err)}
}

global.reloadFile(__filename)