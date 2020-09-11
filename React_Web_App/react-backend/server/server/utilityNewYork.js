var utility = require('./utility.js');

function parseNewYorkSearchData(data, i) {
  return data.map(element => {
    const title = element.headline.main;
    const date = utility.format(new Date(element.pub_date))
    let image = './Nytimes_hq.jpg';
    if (element.multimedia && element.multimedia.length > 0) {
      let multimedia = element.multimedia.filter(data => data.width >= 2000);
      if (multimedia[0])
        image = "https://www.nytimes.com/" + multimedia[0].url;
    }
    const section = element.news_desk;
    const description = element.abstract;
    let detailedCardId = element.web_url;
    let url = element.web_url
    return {
      id: i++,
      title: title,
      image: image,
      section: section,
      date: date,
      detailedCardId: detailedCardId,
      url: url,
      newsType: "NewYorkTimes",
      description: description
    }
  }).filter(data => (data.title && data.date && data.image && data.section && data.description));
}




function parseDetailedCardNewYork(data) {
  let obj = {}
  obj.title = data.headline.main;
  obj.date = utility.format(new Date(data.pub_date));
  obj.url = data.web_url;
  obj.description = data.abstract;
  obj.section = data.news_desk;
  obj.image = './Nytimes_hq.jpg';
  if (data.multimedia && data.multimedia.length > 0) {
    let multimedia = data.multimedia.filter(data => data.width >= 2000);
    if (multimedia[0])
      obj.image = "https://www.nytimes.com/" + multimedia[0].url;
  }
  return obj;
}




function parseNewYorkData(data, i) {
  let parsedArrayObjects = data.map(element => {
    const title = element.title;
    const url = element.url;
    let image = './Nytimes_hq.jpg';
    if (element.multimedia && element.multimedia.length > 0) {
      let multimedia = element.multimedia.filter(data => data.width >= 2000);
      if (multimedia[0])
        image = multimedia[0].url;
    }
    const section = element.section;
    const date = utility.format(new Date(element.published_date));
    const description = element.abstract;
    const detailedCardId = element.url;
    return {
      id: i++,
      title: title,
      url: url,
      image: image,
      section: section,
      date: date,
      description: description,
      detailedCardId: detailedCardId
    }
  }).filter(data => (data.title && data.url && data.image && data.section && data.description));

  return parsedArrayObjects;
}


module.exports = {
  parseNewYorkSearchData: parseNewYorkSearchData,
  parseNewYorkData: parseNewYorkData,
  parseDetailedCardNewYork: parseDetailedCardNewYork

}