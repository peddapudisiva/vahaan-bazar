const db = require('../config/database')

const url = 'https://imgcdn.oto.com/large/gallery/exterior/92/3300/suzuki-access-125-slant-front-view-full-image-535575.jpg'

db.run(
  `UPDATE used_bikes SET images = json_set(COALESCE(images,'[]'), '$[0]', ?) WHERE brand = 'Suzuki' AND model = 'Access 125'`,
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
