var utility = require('./utility.js');

function parseDetailedCardGuardian(data) {
    let obj = {};
    obj.title = data.webTitle;
    obj.image = './fallback-logo.png';
    if (data.blocks.main) {
      let multimedia = data.blocks.main.elements[0].assets.filter(dataG => dataG.typeData.width >= 2000);
      if (multimedia[0]) {
        obj.image = multimedia[0].file;
      }
    }
    obj.date = utility.format(new Date(data.webPublicationDate));
    obj.description = data.blocks.body[0].bodyTextSummary;
    obj.url = data.webUrl;
    obj.section = data.sectionId;
    return obj;
  }

  function parseGuardianData(data,i) {
    let parsedArrayObjects = data.map(element => {
      const title = element.webTitle;
      const url = element.webUrl;
      const detailedCardId = element.id;
      let image = './fallback-logo.png';
      if (element.blocks.main) {
        let multimedia = element.blocks.main.elements[0].assets.filter(data => data.typeData.width >= 2000);
        if (multimedia[0]) {
          image = multimedia[0].file;
        }
      }
      const section = element.sectionId;
      const date = utility.format(new Date(element.webPublicationDate));
      const description = element.blocks.body[0].bodyTextSummary;
      return {
        id: i++,
        title: title,
        image: image,
        section: section,
        date: date,
        description: description,
        url: url,
        detailedCardId: detailedCardId
      }
    }).filter(data => (data.title && data.url && data.image && data.section && data.description));
  
    return parsedArrayObjects;
  
  }

  function parseGuardianSearchData(data) {
    var i = 0;
    return data.map(element => {
      const title = element.webTitle;
      let image = './fallback-logo.png';
      if (element.blocks.main) {
        let multimedia = element.blocks.main.elements[0].assets.filter(data => data.typeData.width >= 2000);
        if (multimedia[0]) {
          image = multimedia[0].file;
        }
      }
      const section = element.sectionId;
      const detailedCardId = element.id;
      const url = element.webUrl;
      const description = element.blocks.body[0].bodyTextSummary;
      const date = utility.format(new Date(element.webPublicationDate));
      return {
        id: i++,
        title: title,
        image: image,
        section: section,
        date: date,
        newsType: "Guardian",
        url: url,
        detailedCardId: detailedCardId,
        description : description
      }
    }).filter(data => (data.title && data.image && data.section && data.date && data.description))
  }

module.exports = {
    parseDetailedCardGuardian : parseDetailedCardGuardian,
    parseGuardianData : parseGuardianData,
    parseGuardianSearchData : parseGuardianSearchData

}