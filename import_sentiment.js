const fs = require("fs");
const sqlite3 = require('sqlite3');
const filename = "sentiment.json";

/*
    Madina: I created this file to import sentiment information from the
    model created in sentiment.py to classify all pages in the database.

    Unfortunately, MonkeyLearn has a usage limit on its API for free accounts
    and we were limited to process only ~300 pages. For that reason,
    I created our own simple model; it can be found in sentiment.py
*/


const db = new sqlite3.Database('./vakhrushi.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the vakhrushi db');
  }
});

function createOrUpdateTable(callback) {
  db.run(`CREATE TABLE IF NOT EXISTS sentiments (id INTEGER PRIMARY KEY, page INTEGER NOT NULL, score INTEGER NOT NULL)`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        callback(filename);
      }
  });
}

function parseJson(filename) {
  let contents = fs.readFileSync(filename);
  let sentiments = JSON.parse(contents);

  loadRows(sentiments);
}

function loadRows (rows) {
  rows.forEach((row) => {
      db.run('INSERT INTO sentiments (page, score) VALUES (?, ?)', row.page, row.score, (err) => {
        if (err) {
            console.error(err.message, row.page, row.text);
        }
      })
  });
}

createOrUpdateTable(parseJson);
