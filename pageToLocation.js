const fs = require('fs');
const fName = "text/fulltext.txt";

const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('./vakhrushi.db')

var coordinates = [];

var KEYWORDS = [ 'church', 'monestary', 'synagogue', 'mosque', 'grocery',
'garden','courtyard', 'police station', "fire station", "station", 'city hall',
'library', 'store', 'pharmacy', 'hotel', 'town hall', 'prison', 'office', 'hall',
'school', 'hospital', 'theater', 'warehouse', 'pub', 'bakery', 'meat', 'fish',
'market', 'farm','gym', 'redoubts','fortress', 'encampment','forepost', 'bookstore',
'cordons', 'fort', 'post', 'factory', 'path', 'mine', 'tavern','port',
'bishopric','shop', 'city hall', 'station', 'bar',
'bakery','butcher','cobbler', "cemetery", "gymnasium", "bank", "dentist",
"blacksmith", "sports", "government administration",
"Slobodskoy", "Pushkari", "Vakhrushi",
"Borovitsa", "Omutninsk", "Yaransk", "Slobodskoy",  "Nolinsk",
"Orlov", "Malmyzh", "Urzhum",  "Kirs", "heaven", "hell"];

function getPages() {
  db.all('SELECT * FROM pages ORDER BY page', (err, pagesArr) => {
      buildLocationPageObj(pagesArr);
  })
}

function buildLocationPageObj(pagesArr) {
  var locations = {};
    for (var k = 0; k < KEYWORDS.length; k++) {
      locations[KEYWORDS[k]] = [];
    }
    for (var i = 0; i < pagesArr.length; i++) {
      let pageObj = pagesArr[i];
      let pageNum = pageObj.page;
      let text = pageObj.text;
      for (var j = 0; j < KEYWORDS.length; j++) {
        var keyword = KEYWORDS[j];
        var re = new RegExp(" " + keyword + " ", "g");
        var m = text.match(re);
        if (m) m = m.length;
        if (m > 0) {
          locations[keyword].push(i);
        } else {
          re = new RegExp("." + keyword + " ", "g");
          m = text.match(re);
          if (m) m = m.length;
          if (m > 0) {
            locations[keyword].push(pageNum);
          }
        }
      }

    }
    //console.log(locations);
    buildLocationPagesTable(locations);
}

function buildLocationPagesTable(locations) {
    let keys = Object.keys(locations);
    keys.forEach((location) => {
      locations[location].forEach((page) => {
        //console.log(location, page);

        db.run('INSERT INTO location_pages (location, page) VALUES (?, ?)', location, page, (err) => {
          if (err) {
              console.error(err.message, location, page);
          }
        })
      });
    });
}

function createOrUpdateTable(callback) {
  db.run(`CREATE TABLE IF NOT EXISTS location_pages(location TEXT, page INTEGER, FOREIGN KEY (page) REFERENCES pages(page))`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        callback();
      }
  });
}

createOrUpdateTable(getPages)
