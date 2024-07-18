import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import tensorflow as tf

from sklearn.feature_extraction.text import CountVectorizer
from keras_preprocessing.text import Tokenizer
from keras_preprocessing.sequence import pad_sequences
from keras.models import Sequential
from keras.layers import Dense, Embedding, LSTM, SpatialDropout1D
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
import re
from keras.models import load_model


data = pd.read_csv('twitter_training.csv')
# Keeping only the neccessary columns
data = data[['text','sentiment']]
data = data[data.sentiment != "Neutral"]
data = data[data.sentiment != "Irrelevant"]
data['text'] = data['text'].apply((lambda x: re.sub('[^a-zA-z0-9]','',str(x))))
data['text'] = data['text'].apply(lambda x: x.lower())

# Load the model
loaded_model = load_model('sentModel.keras')
loaded_model.compile(loss = 'categorical_crossentropy', optimizer='adam',metrics = ['accuracy'])
tokenizer = Tokenizer(num_words=2000, split=' ')
tokenizer.fit_on_texts(data['text'].values)
X = tokenizer.texts_to_sequences(data['text'].values)
X = pad_sequences(X)
Y = pd.get_dummies(data['sentiment']).values
X_train, X_test, Y_train, Y_test = train_test_split(X,Y, test_size = 0.2, random_state = 42)
loaded_model.evaluate(X_test, Y_test, verbose = 0, batch_size = 32)


list = [["this is bad"], ["this is good"], ["nice"]]

for line in list:
    
#vectorizing the tweet by the pre-fitted tokenizer instance
    line = tokenizer.texts_to_sequences(line)
#padding the tweet to have exactly the same shape as `embedding_2` input
    line = pad_sequences(line, maxlen=28, dtype='int32', value=0)
    sentiment = loaded_model.predict(line,batch_size=1,verbose = 0)[0]
    if(np.argmax(sentiment) == 0):
        print("negative")
    elif (np.argmax(sentiment) == 1):
        print("positive")