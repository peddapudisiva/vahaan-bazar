const db = require('../config/database')

const url = 'https://tse1.mm.bing.net/th/id/OIP.kiLdqkSpWSja8jFL_1PRjAHaEK?pid=Api&P=0&h=220'

db.run(
  `UPDATE used_bikes SET images = json_set(COALESCE(images,'[]'), '$[0]', ?) WHERE brand = 'Yamaha' AND model = 'FZ-S V2'`,
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
