const db = require('../config/database')

const url = 'https://tse2.mm.bing.net/th/id/OIP.qa9RcfVxdF6n7Gp1_08ZWAHaFN?pid=Api&P=0&h=220'

db.run(
  `UPDATE used_bikes SET images = json_set(COALESCE(images,'[]'), '$[0]', ?) WHERE brand = 'Honda' AND model = 'Activa 5G'`,
  [url],
  function (err) {
    if (err) {
      console.error('Update failed:', err.message)
    } else {
      console.log('Updated rows:', this.changes)
    }
    db.close(() => process.exit(0))
  }
)
