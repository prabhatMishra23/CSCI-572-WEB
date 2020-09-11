function fetchCategory(selectC) {
  var catValue = selectC.options[selectC.selectedIndex].value;
  // if (catValue == "all") {
  //   changeOptions({});
  // } else {
  fetch('/sourceData?category=' + catValue, {
    method: 'get',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    // body: 'category=' + selectC.options[selectC.selectedIndex].value,
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      changeOptions(data)
    })
    .catch(err => {
      console.log(err)
    })
  // }
}

function changeOptions(data) {
  var sourceEle = document.getElementById('source');
  sourceEle.options.length = 1;
  for (var i = 0; i < data.length; i++) {
    var optElement = document.createElement('option');
    optElement.setAttribute('value', data[i].sourceId);
    var textNode = document.createTextNode(data[i].sourceName);
    optElement.appendChild(textNode);
    sourceEle.appendChild(optElement);
  }
}

function fetchFormData(e) {
  e.preventDefault();
  var formData = new FormData(document.getElementById('searchFormNews'));
  if (validateFormData(formData)) {
    var url = createURL(formData);
    var req = new XMLHttpRequest();
    req.open('GET', '/fetchForForm?' + url, true);
    req.send();
    req.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(req.response);
        if (data.status == "error") {
          alert(data.message);
        } else {
          displaySearchResultData(data);
        }
      }
    }
  } else {
    alert("Incorrect time");
  }
}

function validateFormData(formData) {
  var fDate = new Date(formData.get('fromDate'));
  var tDate = new Date(formData.get('toDate'));
  if (tDate < fDate) {
    return false;
  }
  return true;
}

function createURL(formData) {
  var url = "";
  for (var pair of formData.entries()) {
    url += pair[0] + "=" + pair[1] + "&";
  }
  return url.slice(0, -1);
}

function displaySearchResultData(data) {
  var ele = document.getElementById('searchCards');
  if (ele.children.length != 0) {
    ele.innerHTML = "";
    document.getElementById("showM").style.display = "none";
    document.getElementById("showL").style.display = "none";
  }
  if (data.length == 0) {
    var divNo = document.createElement('div');
    divNo.setAttribute('style', "text-align:center;");
    divNo.innerHTML = "No Results";
    ele.appendChild(divNo);
  } else {
    for (var j = 0; j < data.length; j++) {
      var innerElement = createCard(data[j]);
      if (j >= 5) {
        innerElement.setAttribute('class', 'searchCard moreCards');
        innerElement.style.display = "none";
      }
      ele.appendChild(innerElement);
    }
    if (data.length > 5) {
      document.getElementById("showM").style.display = "block";
    }
  }
}

function createCard(data) {
  var root = document.createElement('div');
  root.setAttribute('class', 'searchCard');
  root.setAttribute('onmouseover', "addClickEventOnCard(this);");
  var ele1 = document.createElement('div');
  ele1.setAttribute('class', 'searchCardcontainer');
  root.appendChild(ele1);
  var anchorEle = document.createElement('a');
  anchorEle.setAttribute('class', "close-classic");
  anchorEle.setAttribute('style', "display: none;");
  anchorEle.textContent = "X";
  ele1.appendChild(anchorEle);
  var cardImageEle = document.createElement('div');
  cardImageEle.setAttribute('class', 'cardCol1');
  var image = document.createElement('img');
  image.setAttribute('src', data.urlToImage);
  image.setAttribute('class', 'imageSearchCard');
  cardImageEle.appendChild(image);
  ele1.appendChild(cardImageEle);
  var cardTextEle = document.createElement('div');
  cardTextEle.setAttribute('class', 'cardCol2');
  var cardTitle = document.createElement('p');
  cardTitle.setAttribute('class', "cardTitle");
  cardTitle.textContent = data.title;
  cardTextEle.appendChild(cardTitle);
  var cardTextData = document.createElement('div');
  cardTextData.setAttribute('class', 'textCard');
  cardTextData.setAttribute('style', 'display: none;');
  var textCardPara1 = document.createElement('p');
  textCardPara1.setAttribute('class', 'textCardPara');
  var textCardspan1 = document.createElement('span');
  textCardspan1.setAttribute('class', "boldText");
  textCardspan1.textContent = "Author: ";
  textCardPara1.appendChild(textCardspan1);
  var textCardspan12 = document.createElement('span');
  textCardspan12.setAttribute('class', "cardText");
  textCardspan12.textContent = data.author;
  textCardPara1.appendChild(textCardspan12);
  var textCardPara2 = document.createElement('p');
  textCardPara2.setAttribute('class', 'textCardPara');
  var textCardspan2 = document.createElement('span');
  textCardspan2.setAttribute('class', "boldText");
  textCardspan2.textContent = "Source: ";
  textCardPara2.appendChild(textCardspan2);
  var textCardspan22 = document.createElement('span');
  textCardspan22.setAttribute('class', "cardText");
  textCardspan22.textContent = data.source.name;
  textCardPara2.appendChild(textCardspan22);
  var textCardPara3 = document.createElement('p');
  textCardPara3.setAttribute('class', 'textCardPara');
  var textCardspan3 = document.createElement('span');
  textCardspan3.setAttribute('class', "boldText");
  textCardspan3.textContent = "Date: ";
  textCardPara3.appendChild(textCardspan3);
  var textCardspan32 = document.createElement('span');
  textCardspan32.setAttribute('class', "cardText");
  textCardspan32.textContent = format(new Date(data.publishedAt.trim()));
  textCardPara3.appendChild(textCardspan32);
  cardTextData.appendChild(textCardPara1);
  cardTextData.appendChild(textCardPara2);
  cardTextData.appendChild(textCardPara3);
  cardTextEle.appendChild(cardTextData);
  var describeOverflow = document.createElement('div');
  describeOverflow.setAttribute('class', "describeOverflow");
  var cardDescription = document.createElement('span');
  cardDescription.setAttribute('class', "cardDescription");
  cardDescription.innerHTML = formatHtml(data.description);
  describeOverflow.appendChild(cardDescription);
  cardTextEle.appendChild(describeOverflow);
  var originalPostLink = document.createElement('a');
  originalPostLink.setAttribute("href", data.url);
  originalPostLink.setAttribute("target", "_blank");
  originalPostLink.setAttribute("style", "display: none;font-size: 10px;margin-top: 2px; margin-bottom: 6px;");
  originalPostLink.textContent = "See Orginal Post";
  cardTextEle.appendChild(originalPostLink);
  ele1.appendChild(cardTextEle);
  return root;
}


function formatHtml(data) {
  if (data.length < 73) {
    return data;
  }
  var res = data.substring(0, 74);
  for (i = 75; i >= 0; i--) {
    if (res[i] == " ") {
      break;
    }
  }
  res = res.substring(0, i) + "<span>" + "..." + "</span>" + "<span style='display:none'>" + data.substring(i) + "</span>";
  return res;
}
function format(date) {
  return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
}

function displayExtraDetails(event) {
  searchCard = event.currentTarget;
  if (event.target.text == "X") {
    this.style.cursor = "pointer";
    searchCard.children[0].style.display = "none";
    searchCard.children[2].children[1].style.display = "none";
    searchCard.children[2].children[3].style.display = "none";
    searchCard.children[2].children[2].children[0].style.whiteSpace = "nowrap";
    if (searchCard.children[2].children[2].children[0].children.length >= 0) {
      searchCard.children[2].children[2].children[0].children[0].style.display = "";
      searchCard.children[2].children[2].children[0].children[1].style.display = "none";
    }
  } else {
    this.style.cursor = "auto";
    searchCard.children[0].style.display = "block";
    searchCard.children[2].children[1].style.display = "block";
    searchCard.children[2].children[3].style.display = "block";
    searchCard.children[2].children[2].children[0].style.whiteSpace = "normal";
    if (searchCard.children[2].children[2].children[0].children.length >= 0) {
      searchCard.children[2].children[2].children[0].children[0].style.display = "none";
      searchCard.children[2].children[2].children[0].children[1].style.display = "";
    }
  }
}


function addClickEventOnCard(card) {
  card.children[0].addEventListener('click', displayExtraDetails)
}

function displayMoreCards() {
  var arr = document.getElementsByClassName('moreCards');
  var minimum = Math.min(arr.length, 10);
  for (var i = 0; i < minimum; i++) {
    arr[i].style.display = "block";
  }
  document.getElementById('showM').style.display = "none";
  document.getElementById('showL').style.display = "block";
}

function displayLessCards() {
  var arr = document.getElementsByClassName('moreCards');
  var minimum = Math.min(arr.length, 10);
  for (var i = 0; i < minimum; i++) {
    arr[i].style.display = "none";
  }
  document.getElementById('showM').style.display = "block";
  document.getElementById('showL').style.display = "none";
}


function removeBorder(input) {
  input.style.border = "none";
}
