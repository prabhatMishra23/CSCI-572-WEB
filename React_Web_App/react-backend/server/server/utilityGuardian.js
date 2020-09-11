var utility = require('./utility.js');

function parseDetailedCardGuardian(data) {
    let obj = {};
    obj.title = data.webTitle;
    obj.image = '';
    if (data.blocks.main) {
      var multimedia = data.blocks.main.elements[0].assets
      for(var i=0;i<multimedia.length;i++){
        if(multimedia[i].typeData.width>=200 && multimedia[i].typeData.width<=3000){
          obj.image = multimedia[i].file;
        }
      }
    }
    obj.date = data.webPublicationDate;
    let description = "";
    var bodyC = data.blocks.body;
    for(var i=0;i<bodyC.length;i++){
       description+= bodyC[i].bodyHtml;
    }
    obj.description = description;
    //obj.description = data.blocks.body[0].bodyTextSummary;
    obj.url = data.webUrl;
    obj.section = data.sectionName;
    return obj;
  }

  function parseGuardianHomeData(data){
    let parsedArrayObjects = data.map(element => {
      const title = element.webTitle;
      const url = element.webUrl;
      const detailedCardId = element.id;
      let image = "";
      if(element.fields.thumbnail){
        image = element.fields.thumbnail;
      }
      const date = element.webPublicationDate;
      const section = element.sectionName;
      return {
        title: title,
        image: image,
        section: section,
        date: date,
        url: url,
        articleId: detailedCardId
      }
    });
  
    return parsedArrayObjects;

  }

  function parseGuardianData(data,i) {
    let parsedArrayObjects = data.map(element => {
      const title = element.webTitle;
      const url = element.webUrl;
      const detailedCardId = element.id;
      let image = '';
      if (element.blocks.main) {
        var multimedia = element.blocks.main.elements[0].assets
        for(var i=0;i<multimedia.length;i++){
          if(multimedia[i].typeData.width>=500 && multimedia[i].typeData.width<=2000 && !image){
            image = multimedia[i].file;
          }
        }
      }
      const section = element.sectionName;
      const date = element.webPublicationDate;
      const description = element.blocks.body[0].bodyTextSummary;
      return {
        title: title,
        image: image,
        section: section,
        date: date,
        url: url,
        detailedCardId: detailedCardId
      }
    }).filter(data => (data && data.title && data.url && data.section));
  
    return parsedArrayObjects;
  
  }

  function parseGuardianSearchData(data) {
    var i = 0;
    return data.map(element => {
      const title = element.webTitle;
      let image = '';
      if (element.blocks.main) {
        var multimedia = element.blocks.main.elements[0].assets
        for(var i=0;i<multimedia.length;i++){
          if(multimedia[i].typeData.width>=500 && multimedia[i].typeData.width<=2000 && !image){
            image = multimedia[i].file;
          }
        }
      }
      const section = element.sectionName;
      const detailedCardId = element.id;
      const url = element.webUrl;
      const description = element.blocks.body[0].bodyTextSummary;
      const date = element.webPublicationDate;
      return {
        title: title,
        image: image,
        section: section,
        date: date,
        newsType: "Guardian",
        url: url,
        detailedCardId: detailedCardId,
        description : description
      }
    })
  }

module.exports = {
    parseDetailedCardGuardian : parseDetailedCardGuardian,
    parseGuardianData : parseGuardianData,
    parseGuardianSearchData : parseGuardianSearchData,
    parseGuardianHomeData : parseGuardianHomeData

}