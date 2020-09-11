from flask import Flask,render_template
from newsapi import NewsApiClient
from flask import jsonify
from flask import request
from collections import Counter
from datetime import datetime
import re

application = Flask(__name__)
newsapi = NewsApiClient(api_key='43ca2e4433b74906b156a63979618eeb')

@application.route('/index.html')
def root():
    return application.send_static_file('index.html')

@application.route("/generalHeadlines")
def view():
    top_headlines_gen = newsapi.get_top_headlines(page_size=30)['articles']
    #top_headlines_fox = newsapi.get_top_headlines(sources="fox",page_size=30)['articles']
    top_headlines_gen = filter(top_headlines_gen,5)
    #render_template("index.html",head_gen=top_headlines_gen,head_cnn=top_headlines_cnn)
    return jsonify(top_headlines_gen)

@application.route("/headlines_cnn")
def viewCNN():
    top_headlines_cnn = newsapi.get_top_headlines(sources="cnn",page_size=30)['articles']
    top_headlines_cnn = filter(top_headlines_cnn,4)
    return jsonify(top_headlines_cnn)

@application.route("/headlines_fox")
def viewFOX():
    top_headlines_fox = newsapi.get_top_headlines(sources="fox-news",page_size=30)['articles']
    top_headlines_fox = filter(top_headlines_fox,4)
    return jsonify(top_headlines_fox)


@application.route("/sourceData",methods=["GET","POST"])
def fetchSourceData():
    if request.method == "GET":
        data = request.args['category']
        if(data=="all"):
            sources = newsapi.get_sources(language='en',country='us')
        else:
            sources = newsapi.get_sources(category=data,language='en',country='us')
        jsonArr = []
        dataArray = sources['sources'][0:10]
        for source in dataArray:
            ja = dict()
            if(source['id']!=None and str(source['id'])!='' and str(source['id'])!='null'):
                ja['sourceId'] = source['id']
                ja['sourceName'] = source['name']
                jsonArr.append(ja)
        return jsonify(jsonArr)
        
@application.route("/fetchForForm",methods=["GET","POST"]) 
def fetchForForm():
    if request.method == "GET":
        keyword = request.args['searchKeyword']
        fromDate = request.args['fromDate']
        toDate = request.args['toDate'] 
        source = request.args['source']
        try:
            if(source=="all"):
                everyThingData = newsapi.get_everything(q=keyword,from_param=fromDate, to=toDate, language='en', sort_by='publishedAt', page_size=30)['articles']  
            else:
                everyThingData = newsapi.get_everything(q=keyword, sources=source,from_param=fromDate, to=toDate, language='en', sort_by='publishedAt', page_size=30)['articles']
            everyThingData = filter(everyThingData,15)
            return jsonify(everyThingData)
        except Exception as e:
            return jsonify(e.exception)



@application.route("/getWordCloudData",methods=["GET","POST"])
def wordCloud():
    articles = newsapi.get_top_headlines(page_size=30)['articles']
    wordCount = dict()
    stopfile = open("./static/stopwords_en.txt", "r")
    stopWords = [x.rstrip("\n").lower() for x in stopfile]
    l=[]
    for article in articles:
        populateDictionary(wordCount,article['title'],stopWords) 
    mostCommon = Counter(wordCount)   
    mostCommon = mostCommon.most_common(30) 
    for w in mostCommon:
        x={}
        x['word'] = w[0]
        if(w[1]==1):
            x['size'] = str(w[1]*8)
        elif(w[1]<=4):
            x['size'] = str(w[1]*5) 
        elif(w[1]<=10):
            x['size'] = str(w[1]*4)
        else:
            x['size'] = str(w[1]*2)
        l.append(x)
    return jsonify(l)


def populateDictionary(wordCount,title,stopWords):
    words = re.findall(r"[A-Za-z\.\’]+",title)
    for word in words:
        w = word.lower()
        if(w not in stopWords):
            if(w in wordCount):
                wordCount[w]+=1
            else:
                wordCount[w]=1
    


def filter(headlines, size):
    l=[]
    for x in headlines:
        if(len(l)==size):
            return l
        if((x['author']==None or x['description']==None or x['title']==None or x['url']==None or x['urlToImage']==None or x['publishedAt']==None) \
        or str(x['author'])=='' or str(x['description'])=='' or str(x['urlToImage']) =='' or str(x['publishedAt'])=='' or str(x['title'])=='' \
        or str(x['author'].lower())=='null' or str(x['description'].lower())=='null' or str(x['urlToImage'].lower()) =='null' or str(x['publishedAt'].lower())=='null' or str(x['title'].lower())=='null'):
                    continue
        else:
            flag = True
            for val in x['source']:
                value = x['source'][val]
                if(value==None or str(value)==''):
                    flag=False
                    continue
            if(flag):
                l.append(x)
    return l

if __name__ == '__main__' :
    application.run(debug=True,use_reloader=False)