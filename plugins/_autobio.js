const moment = require('moment-timezone')

module.exports = {
  before: async function all(m) {
    if (global.autobio) {
      setInterval(async () => {
        let timeEG = moment().tz("Africa/Cairo").format("hh:mm:ss A")

        let bio = `🤖 𝐑𝐄𝐌 𝐌𝐃: 🕒 ${timeEG} | 💌 by: 𝐁𝟕𝐑`

        await this.updateProfileStatus(bio).catch(_ => _)
      }, 60000)
    }
  }
}