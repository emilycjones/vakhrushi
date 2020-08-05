from sys import argv
from collections import Counter
from string import punctuation

script, filename = argv

text_file = open(filename, 'r')

word_freq = Counter([word.strip(punctuation) for line in text_file for word in line.split()])

#~ for word, count in word_freq.items():
    #~ print word, count

key_words = ['church', 'monestary', 'synagogue', 'grocery', 'garden', 'police',
             'station', 'library', 'store', 'pharmacy', 'hotel', 'meat',
             'fish', 'town hall', 'pub', 'bakery', 'theater', 'fire station',
             'prison','hospital','office','school','warehouse','farm','gym','city hall',
             'mosque','redoubts','fortress','encampment','forepost','cordons','fort',
             'post', 'factory', 'path', 'mine', 'tavern','port','bishopric','shop',
             'station','bar','saloon','market','tobaconist','bakery','butcher','cobbler']

for word in key_words:
    if word in word_freq:
        print word, word_freq[word]
