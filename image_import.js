const fs = require("fs");
const sqlite3 = require('sqlite3');
const filename = "images.json";

/*
    Madina: I created this script to load in image objects
    into our database. The image objets are loaded in from images.json,
    which is a json object that is created by the script image_cleanup.py 
*/


const db = new sqlite3.Database('./vakhrushi.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the vakhrushi db');
  }
});

function createOrUpdateTable(callback) {
  db.run(`CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY, address TEXT NOT NULL, year INTEGER NOT NULL, imageType TEXT NOT NULL,  filename TEXT NOT NULL, locationId INTEGER NOT NULL, FOREIGN KEY (locationId) REFERENCES locations(id) )`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        callback(filename);
      }
  });
}

function parseJson(filename) {
  let contents = fs.readFileSync(filename);
  let addresses = JSON.parse(contents);
  let rows = [];

  Object.keys(addresses).forEach((address) => {
      addresses[address].forEach((image) => {
          image['address'] = address;
          rows.push(image);
      })
  })
  loadRows(rows);
}

function loadRows (rows) {
  rows.forEach((row) => {
    db.get('SELECT id FROM locations WHERE address_russian = ?', row.address, (err, locationId) => {
      if (err) {
        console.error(err.message, row.page, row.text);
      }
      if (locationId) {
        db.run('INSERT INTO images (address, year, imageType, filename, locationId) VALUES (?, ?, ?, ?, ?)', row.address, row.year, row.type, row.filename, locationId.id, (err) => {
          if (err) {
              console.error(err.message, row.page, row.text);
          }
        });
      }
    });
  });
}

createOrUpdateTable(parseJson);
