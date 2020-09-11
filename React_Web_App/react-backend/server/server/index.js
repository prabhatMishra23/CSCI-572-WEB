const express = require('express');
const app = express();
const port = 8081;
const router = express.Router();
const path = require('path');
const cors = require('cors')
const fetch = require("node-fetch");
const ny_api_key = "pKdGSU0EIEE9hcSp1QxWkGY4MvrlC3Ap";
const googleTrends = require('google-trends-api');
const guard_api_key = "6696cdf1-3219-4e5c-bb42-75de3e5c6ea6";
var utilityG = require('./utilityGuardian.js');
var utilityN = require('./utilityNewYork.js');

router.use(cors());

express.static(path.join(__dirname, 'public'));


router.get('/getTrends',(req,res) =>{
var keyword = req.query.trend;
googleTrends.interestOverTime({keyword: keyword,startTime: new Date('2019-06-01')})
 .then(function(results){
  var obj = JSON.parse(results);
  var data = obj.default.timelineData;
  var values = []
  for(var i=0;i<data.length;i++){
         values[i] = data[i].value[0];
  }
  res.send({values});
  })
  .catch(function(err){
    console.error('Oh no there was an error', err);
    res.send(err);
  });

})

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
  fetch(url).then((response) => {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + response.status);
      return;
    }
    return response.json();
  }).then((data) => {
    let guard = utilityG.parseGuardianSearchData(data.response.results);
    res.send(guard);
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

router.get('/science', (req, res) => {
  let url = "";
  if (req.query.type == "Guardian") {
    url = getGuardianUrl("science");
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

router.get('/homeNews', (req, res) => {
  let url = "";
  url = "https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key="+guard_api_key;
  fetch(url).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      return response.json();
    }).then((data) => {
      let dataParsed = utilityG.parseGuardianHomeData(data.response.results);
      res.send(dataParsed.slice(0,10));
    });
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
  }else if(category=="science"){
    url = 'https://content.guardianapis.com/science?api-key='+ guard_api_key + '&show-blocks=all';
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
