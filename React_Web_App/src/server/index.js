const express = require('express');
const app = express();
const port = 8081;
const router = express.Router();
const path = require('path');
const cors = require('cors')
const fetch = require("node-fetch");
const ny_api_key = "#######";
const guard_api_key = "######";
var utilityG = require('./utilityGuardian.js');
var utilityN = require('./utilityNewYork.js');

router.use(cors());

express.static(path.join(__dirname, 'public'));

router.get('/article', (req, res) => {
  let url = "";
  if (req.query.newsType == "Guardian") {
    url = 'https://content.guardianapis.com/' + req.query.id + '?api-key=' + guard_api_key + '&show-blocks=all';
  } else {
    url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + req.query.id + '")&api-key=' + ny_api_key;
  }
  fetch(url).then((response) => {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + response.status);
      return;
    }
    return response.json();
  }).then((data) => {
    let responseObj = {};
    if (req.query.newsType == "Guardian") {
      responseObj = utilityG.parseDetailedCardGuardian(data.response.content);
      responseObj.newsType = "Guardian";
    } else {
      responseObj = utilityN.parseDetailedCardNewYork(data.response.docs[0]);
      responseObj.newsType = "NewYorkTimes";
    }
    res.send(responseObj);
  });

}
)

router.get('/search', (req, res) => {
  let url = "https://content.guardianapis.com/search?q=" + req.query.q + '&api-key=' + guard_api_key + '&show-blocks=all';
  cardArray = []
  fetch(url).then((response) => {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + response.status);
      return;
    }
    return response.json();
  }).then((data) => {
    let guard = utilityG.parseGuardianSearchData(data.response.results);
    cardArray = cardArray.concat(guard.slice(0, 5))
    url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + req.query.q + '&api-key=' + ny_api_key;
    console.log(url);
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((dataNY) => {
      let dataParsed = utilityN.parseNewYorkSearchData(dataNY.response.docs, cardArray.length);
      cardArray = cardArray.concat(dataParsed.slice(0, 5));
      res.send(JSON.stringify(cardArray));
    });
  });

});


router.get('/home', (req, res) => {
  let url = "";
  if (req.query.type == "Guardian") {
    url = getGuardianUrl("home");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityG.parseGuardianData(data.response.results,0);
      res.send(dataParsed);
    });
  } else {
    url = getNewYorkUrl("home");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityN.parseNewYorkData(data.results,0);
      res.send(dataParsed);
    });
  }
});

router.get('/world', (req, res) => {
  let url = "";
  if (req.query.type == "Guardian") {
    url = getGuardianUrl("world");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityG.parseGuardianData(data.response.results,0);
      res.send(dataParsed.slice(0,10));
    });
  } else {
    url = getNewYorkUrl("world");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityN.parseNewYorkData(data.results,0);
      res.send(dataParsed.slice(0,10));
    });
  }
});

router.get('/politics', (req, res) => {
  let url = "";
  if (req.query.type == "Guardian") {
    url = getGuardianUrl("politics");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityG.parseGuardianData(data.response.results,0);
      res.send(dataParsed.slice(0,10));
    });
  } else {
    url = getNewYorkUrl("politics");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityN.parseNewYorkData(data.results,0);
      res.send(dataParsed.slice(0,10));
    });
  }
});

router.get('/business', (req, res) => {
  let url = "";
  if (req.query.type == "Guardian") {
    url = getGuardianUrl("business");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityG.parseGuardianData(data.response.results,0);
      res.send(dataParsed.slice(0,10));
    });
  } else {
    url = getNewYorkUrl("business");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityN.parseNewYorkData(data.results,0);
      res.send(dataParsed.slice(0,10));
    });
  }
});

router.get('/technology', (req, res) => {
  let url = "";
  if (req.query.type == "Guardian") {
    url = getGuardianUrl("technology");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityG.parseGuardianData(data.response.results,0);
      res.send(dataParsed.slice(0,10));
    });
  } else {
    url = getNewYorkUrl("technology");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityN.parseNewYorkData(data.results,0);
      res.send(dataParsed.slice(0,10));
    });
  }
});

router.get('/sports', (req, res) => {
  let url = "";
  if (req.query.type == "Guardian") {
    url = getGuardianUrl("sports");
    console.log(url);
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityG.parseGuardianData(data.response.results,0);
      res.send(dataParsed.slice(0,10));
    });
  } else {
    url = getNewYorkUrl("sports");
    fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityN.parseNewYorkData(data.results,0);
      res.send(dataParsed.slice(0,10));
    });
  }
});



function getGuardianUrl(category) {
  let url = "";
  if (category == "home") {
    url = 'https://content.guardianapis.com/search?api-key=' + guard_api_key + '&section=(sport|business|technology|politics)&show-blocks=all';
  }else if(category== "world"){
    url = 'https://content.guardianapis.com/world?api-key='+ guard_api_key + '&show-blocks=all';
  }else if(category== "business"){
    url = 'https://content.guardianapis.com/business?api-key='+ guard_api_key + '&show-blocks=all';
  }else if(category== "politics"){
    url = 'https://content.guardianapis.com/politics?api-key='+ guard_api_key + '&show-blocks=all';
  }else if(category== "sports"){
    url = 'https://content.guardianapis.com/sport?api-key='+ guard_api_key + '&show-blocks=all';
  }else if(category== "technology"){
    url = 'https://content.guardianapis.com/technology?api-key='+ guard_api_key + '&show-blocks=all';
  }
  return url.trim();
}

function getNewYorkUrl(category) {
  let url = "";
  if (category == "home") {
    url = 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' + ny_api_key;
  }else if(category == "world"){
    url = "https://api.nytimes.com/svc/topstories/v2/world.json?api-key="+ny_api_key;
  }else if(category == "politics"){
    url = "https://api.nytimes.com/svc/topstories/v2/politics.json?api-key="+ny_api_key;
  }else if(category == "business"){
    url = "https://api.nytimes.com/svc/topstories/v2/business.json?api-key="+ny_api_key;
  }else if(category == "sports"){
    url = "https://api.nytimes.com/svc/topstories/v2/sports.json?api-key="+ny_api_key;
  }else if(category == "technology"){
    url = "https://api.nytimes.com/svc/topstories/v2/technology.json?api-key="+ny_api_key;
  }
  return url.trim();
}

app.use('/', router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
