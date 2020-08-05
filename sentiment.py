import nltk
import sqlite3
import json

"""
    Madina: I wrote this script to create a rudimentary sentiment analyzer.
    It assigns an integer score to every page
    and then exports all sentiment scores per page to a json object.
    The json object exported can be found in sentiment.json

    Later, the json object created is used to populate a table with
    sentiment ratings per page. This table is used for various visualizations
    in the project.
"""

conn = sqlite3.connect('vakhrushi.db', isolation_level=None)
c = conn.cursor()

class SentimentAnalyzer():

    def __init__(self, positives="text/positive-words.txt", negatives="text/negative-words.txt"):
        # load in positive words
        f = open(positives, "r")
        self.positive = []

        for line in f:
            if not (line[0] == ';' or line[0] == '\n'):
                self.positive.append(line.rstrip())
        f.close()

        # load in negative words
        f = open(negatives, "r")
        self.negative = []

        for line in f:
            if not (line[0] == ';' or line[0] == '\n'):
                self.negative.append(line.rstrip())
        f.close()

    def analyze(self, text):
        tokenizer = nltk.tokenize.TweetTokenizer()
        tokens = tokenizer.tokenize(text)

        score = 0

        for word in tokens:
            if word in self.positive:
                score = score + 1
            if word in self.negative:
                score = score - 1

        return score

def createSentimentPerPage():
    analyzer = SentimentAnalyzer()

    scores = []

    for page in c.execute('SELECT * FROM pages'):
        scores.append({"page": page[0], "score": analyzer.analyze(page[1])})

    return scores

scores = createSentimentPerPage()


j = json.dumps(scores, separators=(',', ':'), ensure_ascii=False)

f = open("sentiment.json", "w")
f.write(j)
f.close()
