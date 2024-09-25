import spacy
import pytextrank
from wordcloud import WordCloud, STOPWORDS
from rake_nltk import Rake
from collections import Counter
from string import punctuation
import nltk
from transformers import AutoModel

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')

def hugging_face_test():
    model = AutoModel.from_pretrained("bupt/keywords_extract", trust_remote_code = True)
    model.extra


def rake_test(text):
    r = Rake()
    r.extract_keywords_from_text(text)
    keywordlist = []
    rankedList = r.get_ranked_phrases_with_scores()
    for keyword in rankedList:
        keyword_updated = keyword[1].split()
        keyword_updated_string = " ".join(keyword_updated[:2])
        keywordlist.append(keyword_updated_string)
        if (len(keywordlist) > 3):
            break
    return keywordlist

def spacy_test(text):
    nlp = spacy.load("en_core_web_sm")
    result = []
    pos_tag = ['PROPN', 'ADJ', 'NOUN']
    doc = nlp(text.lower())
    for token in doc:
        if (token.text in nlp.Defaults.stop_words or token.text in punctuation):
            continue
        if (token.pos_ in pos_tag):
            result.append(token.text)
    result = set(result)
    return [item[0] for item in Counter(result).most_common(3)]

def py_textrank(text):
    nlp = spacy.load("en_core_web_sm")
    nlp.add_pipe("textrank")
    doc = nlp(text)
    return [phrase.text for phrase in doc._.phrases[:3]]

def wordcloud_test(text):
    stopwords = STOPWORDS
    wordcloud = WordCloud(stopwords=stopwords, background_color="white", max_words=1000).generate(text)
    filtered_words = [word for word in text.split() if word not in stopwords]
    counted_words = Counter(filtered_words)
    words = []
    counts = []
    for letter, count in counted_words.most_common(3):
        words.append(letter)
        counts.append(count)

    return words, counts


def main():
    text = input()
    print(f"Keyword list using rake nltk : {rake_test(text)}")
    print(f"Keyword list using spacy : {spacy_test(text)}")
    print(f"Keyword list using pytextrank : {py_textrank(text)}")
    print(f"Keyword list using wordcloud : {wordcloud_test(text)}")

if __name__ == '__main__':
    main()