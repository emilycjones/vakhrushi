const express = require('express');
const path = require('path')
const sqlite3 = require('sqlite3')
const session = require('express-session')

const app = express()
const port = process.env.PORT || 4000
const db = new sqlite3.Database('./vakhrushi.db')

db.get('PRAGMA foreign_keys = ON')

app.use('/static', express.static('public'))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
    console.log("But its really 3000 working on that..")
})

app.get('/pages', (req, res) => {
  db.all('SELECT * FROM pages ORDER BY page',
      (err, pages) => {
          res.json({pages})
      }
  )
})

app.get('/pagesNoSW', (req, res) => {
  db.all('SELECT * FROM pages_no_stopwords ORDER BY page',
      (err, pages) => {
          res.json({pages})
        }
  )
})

app.get('/locations', (req, res) => {
  db.all('SELECT * FROM locations',
      (err, locations) => {
          res.json({locations})
      }
  )
})

app.get('/images/:locationId', (req, res) => {
  db.all('SELECT * FROM images WHERE locationId = ?', req.params.locationId,
      (err, images) => {
          res.json({images})
      }
  )
})

app.get('/sentiments', (req, res) => {
  db.all('SELECT * FROM sentiments ORDER BY page',
      (err, sentiments) => {
          res.json({sentiments})
      }
  )
})

app.get('/pageslocations', (req, res) => {
  db.all('SELECT * FROM location_pages ORDER BY location',
      (err, pages_locations) => {
          res.json({pages_locations})
      }
  )
})
