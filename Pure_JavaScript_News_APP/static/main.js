function slideShow() {
    var i = 0;
    var loopCount = 0;
    var req = new XMLHttpRequest();
    req.open('GET', '/generalHeadlines', true);
    req.send();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(req.response);
            function slider() {
                if (i < data.length) {
                    document.getElementById("mySlideImage").src = data[i].urlToImage;
                    document.getElementById("imageLink").href = data[i].url;
                    document.getElementById("slideImageContent").textContent = data[i].title;
                    document.getElementById("slideImagePara").textContent = data[i].description;
                    i++;
                } else {
                    i = 0;
                    //loopCount++;
                    // if(loopCount == 3){
                    //     slideShow();
                    // }
                }
                setTimeout(slider, 5000);
            }
            slider();
        }
    }
}

function cardDisplay(str) {
    var req = new XMLHttpRequest();
    if (str == 'cnn') {
        req.open('GET', '/headlines_cnn', true);
    } else {
        req.open('GET', '/headlines_fox', true);
    }
    req.send();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(req.response);
            var ele = null;
            if (str == 'cnn') {
                ele = document.getElementById('cnn');
            }
            else {
                ele = document.getElementById('fox');
            }
            for (var i = 0; i < data.length; i++) {
                var anchorTag = document.createElement("a");
                anchorTag.setAttribute('class', 'cardAnchor');
                anchorTag.setAttribute('href', data[i].url);
                anchorTag.setAttribute('target', '_blank');
                var newDiv = document.createElement("div");
                newDiv.setAttribute('class', 'card');
                anchorTag.appendChild(newDiv);
                var cardContainer = document.createElement("div");
                cardContainer.setAttribute('class', 'cardContainer');
                newDiv.appendChild(cardContainer);
                var newImg = document.createElement("img");
                newImg.setAttribute('src', data[i].urlToImage);
                newImg.setAttribute('class', 'cardImage');
                cardContainer.appendChild(newImg);
                var newHead = document.createElement("p");
                newHead.setAttribute('class', 'heading');
                var newContent = document.createTextNode(data[i].title);
                newHead.appendChild(newContent);
                cardContainer.appendChild(newHead);
                var newparagraph = document.createElement("p");
                newparagraph.setAttribute('class', 'description');
                newContent = document.createTextNode(data[i].description.substring(0, 265));
                newparagraph.appendChild(newContent);
                cardContainer.appendChild(newparagraph);
                ele.appendChild(anchorTag);
            }

        }
    }
}

function displaySearch() {
    var div1 = document.querySelector('.searchForm');
    var div2 = document.querySelector('.main');
    var googleButton = document.querySelector(".button.google");
    var searchButton = document.querySelector(".button.search");
    document.getElementById('searchCards').innerHTML = "";
    resetForm();
    div2.style.display = "none";
    div1.style.display = "block";
    searchButton.style.backgroundColor = "rgb(105, 103, 103)";
    searchButton.style.color = "white";
    googleButton.style.backgroundColor = "rgb(226, 226, 226)";
    googleButton.style.color = "black";

}
function resetForm() {
    var sourceEle = document.getElementById('source');
    sourceEle.options.length = 1;
    document.getElementById("searchFormNews").reset();
    document.getElementById("keyword").style = "border-radius:2px; width: 105px; border:1px solid #e46a6a;";
    var ele = document.getElementById('searchCards');
    fetchCategory(document.getElementById("category"));
    if (ele.children.length != 0) {
        ele.innerHTML = "";
    }
    document.getElementById("showM").style.display = "none";
    document.getElementById("showL").style.display = "none";
    var date = new Date();
    var last = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
    //"yyyy-MM-dd"
    lastday = String(last.getDate());
    if (lastday.length == 1) {
        lastday = 0 + lastday;
    }
    currday = String(date.getDate());
    if (currday.length == 1) {
        currday = 0 + currday;
    }
    document.getElementById("from").value = last.getFullYear() + "-" + ("0" + (parseInt(last.getMonth()) + 1)).slice(-2) + "-" + lastday;
    document.getElementById("to").value = date.getFullYear() + "-" + ("0" + (parseInt(date.getMonth()) + 1)).slice(-2) + "-" + currday;
}
function displayGoogle() {
    var div1 = document.querySelector('.searchForm');
    var div2 = document.querySelector('.main');
    var googleButton = document.querySelector(".button.google");
    var searchButton = document.querySelector(".button.search");
    div1.style.display = "none";
    div2.style.display = "block";
    searchButton.style.backgroundColor = "rgb(226, 226, 226)";
    searchButton.style.color = "black";
    googleButton.style.backgroundColor = "rgb(105, 103, 103)";
    googleButton.style.color = "white";
}



// WORD CLOUD JAVASCRIPT>>>>>>>>>>>>>>>>>>>>>>
function wordCloudDisplay() {
    var req = new XMLHttpRequest();
    req.open('GET', '/getWordCloudData', true);
    req.send();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var wordData = JSON.parse(req.response);
            displayWordCloud(wordData);
        }
    }
}
// List of words
function displayWordCloud(myWords) {
    // myWords = [{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]
    var chartDiv = document.getElementById("wordCloudD");
    // set the dimensions and margins of the graph
    //var margin = { top: 9, right: 4, bottom: 4, left: 3 }
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = chartDiv.clientWidth - margin.left - margin.right,
        height = 217 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#wordCloudD").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function (d) { return { text: d.word, size: d.size }; }))
        .padding(5)        //space between words
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .fontSize(function (d) { return d.size; })      // font size of words
        .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("fill", "black")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }

}

/// WORD CLOUD JAVA SCRIPT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>