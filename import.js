const fs = require('fs');
const sqlite3 = require('sqlite3');
const fileName = "text/fulltext.txt";
const lineReader = require('line-reader');
const stopword = require('stopword')


/*
  Madina: I created this script to load in data into the pages and
  pages_no_stopwords tables.

  I used the stopword package (https://www.npmjs.com/package/stopword)
  to strip text of words without meaning & avoid wordclouds becoming cluttered
  with  words such as "the", "of", etc.
*/

const db = new sqlite3.Database('./vakhrushi.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the vakhrushi db');
  }
});

function createOrUpdateTable(callback) {
  db.run(`CREATE TABLE IF NOT EXISTS pages(page INTEGER PRIMARY KEY, text TEXT NOT NULL)`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        callback(fileName);
      }
  });
}

function createUpdateNoStopwordsTable(callback) {
  db.run(`CREATE TABLE IF NOT EXISTS pages_no_stopwords(page INTEGER PRIMARY KEY, text TEXT NOT NULL)`, (err) => {
      if (err) {
        console.error(err.message);
      }
  });

  callback(fileName, true);
}

function parseTxt(fileName, noStopwords = false) {
  let rows = [];
  let txt = "";
  let lineNum = 0;
  let notFirst = false;

  lineReader.eachLine(fileName, function(line) {
      if (line.includes('_______') && txt) {
      	if (notFirst) {
	        let row = {
	          page: lineNum,
	          text: txt
	        }
	        rows.push(row);
	    }
        lineNum = line.replace(/\D/g, "");
        notFirst = true;
        txt = "";
      } else {
          if (line.length > 10) {
            if (noStopwords) {
              let text = line.replace("ѣ", "");
              let no_sw = stopword.removeStopwords(text.split(' '));
              txt += no_sw.join(' ');
            } else {
              txt += line.replace("ѣ", "");
            }
          }
      }
    }, function (err) {
      if (err) throw err;
      loadRows(rows, noStopwords);
  });
}

function loadRows (rows, noStopwords) {
  if (noStopwords) {
    rows.forEach((row) => {
        db.run('INSERT INTO pages_no_stopwords (page, text) VALUES (?, ?)', row.page, row.text, (err) => {
          if (err) {
              console.error(err.message, row.page, row.text);
          }
        });
    });
  } else {
    rows.forEach((row) => {
        db.run('INSERT INTO pages (page, text) VALUES (?, ?)', row.page, row.text, (err) => {
          if (err) {
              console.error(err.message, row.page, row.text);
          }
        });
    });
  }
}

createOrUpdateTable(parseTxt);
createUpdateNoStopwordsTable(parseTxt);
