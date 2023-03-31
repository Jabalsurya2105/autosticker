require('../settings')
const fs = require('fs')
const chalk = require('chalk')
const { join, dirname } = require('path')

const dirr = join(__dirname, '../database')
const data = {
user: join(dirr, 'user.' + dbName),
};

// database user
try {
fs.accessSync(data.user) //check is file
} catch (e) {
fs.writeFileSync(data.user, JSON.stringify({}, null, 2)) //write default
}

let db = {
user: JSON.parse(fs.readFileSync(data.user)),
}

setInterval(async() => {
fs.writeFileSync(data.user, JSON.stringify(db.user, null, 2)); //Write from read file db user 
}, 990);

module.exports = db

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.greenBright("[ UPDATE ]"), chalk.whiteBright(`${__filename}`) )
delete require.cache[file]
require(file)
})