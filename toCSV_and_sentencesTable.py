import csv
import sqlite3
from nltk.tokenize import sent_tokenize

"""
    Madina: I created this script to tokenize each page based on sentences, as
    determined by the nltk (Natural Language Toolkit) package. It will then export
    each sentence, with the original page number and sentence # within page
    to a csv file.

    I am using the CSV file to train a custom model for classifying individual
    sentences in the diary. I hope to use the average sentiment of all the sentences
    on a page to compute a single page's sentiment rank.
"""

conn = sqlite3.connect('vakhrushi.db', isolation_level=None)
c = conn.cursor()

c.execute('''DROP TABLE IF EXISTS sentences''')
c.execute('''CREATE TABLE sentences(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page INTEGER,
                sentenceNum INTEGER NOT NULL,
                sentence TEXT NOT NULL,
                FOREIGN KEY (page) REFERENCES pages(page))
         ''')

data_for_sentences_db = []

with open('training_data_for_sentiment_analysis.csv', mode='w') as training_data:
    data_writer = csv.writer(training_data, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

    for row in c.execute('SELECT * FROM pages'):
        s = 0
        for sentence in sent_tokenize(row[1]):
            data_writer.writerow([row[0], s, sentence])

            data_for_sentences_db.append([row[0], s, sentence])
            s += 1

for row in data_for_sentences_db:
    c.execute('INSERT INTO sentences (page, sentenceNum, sentence) VALUES (?, ?, ?)', row)
