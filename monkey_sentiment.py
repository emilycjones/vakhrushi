from monkeylearn import MonkeyLearn
import sqlite3
import json

"""
    Madina: initially, I created this script to generate sentiment scores
    for each page using a custom MonkeyLearn sentiment classification model.
    150 elements from the data were used to train that model.

    Unfortunately, MonkeyLearn has a usage limit on its API for free accounts
    and we were limited to process only ~300 pages. For that reason,
    a rudimentary model was created. It can be found in sentiment.py
"""


conn = sqlite3.connect('vakhrushi.db')
c = conn.cursor()

data = []
n = 1
for row in c.execute('SELECT * FROM pages'):
    data.append(row[1])

    if n > 294:
        break
    n += 1

ml = MonkeyLearn('fdf41757c671a9aae1131cb2cc455c5cdbdc2933')
model_id = 'cl_sa7qZ3mN'
result = ml.classifiers.classify(model_id, data)

print(result.body)

j = json.dumps(result.body, separators=(',', ':'), ensure_ascii=False)

f = open("sentiment.json", "a")
f.write(j)
f.close()
