var mycanvas;
var allCities;
var numCities = 10;
var allLongitudes = [],
    allLatitudes = [],
    allCityNames = [];
var longitudes = [],
    latitudes = [],
    cityNames = [];
var pitch = 0;
var clat = 38.27;
var clon = -101.7431;
var zoom = 3.45;

var mapImg;
var mapImgWidth = 512*2, 
    mapImgHeight = 512;

var numText;

var order = [];
var bestRoute = [];


function preload() {  
  // Load city data from JSON
  loadJSON("cities.json", processJSON);  
  
  
  // Load a map from mapbox api
  mapImage = loadImage("https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/" +
    clon + "," + clat + "," + zoom + "," + pitch + "/" + mapImgWidth + "x" + mapImgHeight +
    "?access_token=pk.eyJ1Ijoiaml0ZW5kcmEwOTA1IiwiYSI6ImNrZDN0dHFhZDB2bnkyeHBiaGswemgyZ2YifQ.Knz8_fBX5nCLzAQPXdJgTQ");
}


function setup() {
  mycanvas = createCanvas(mapImgWidth, mapImgHeight);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2 - 20;
  mycanvas.position(x, y);
  
  
  // set headers
  setHeaders();
  
  // update input to default value first
  updateInput();
  
  //choose N cities from 100 cities  
  selectCities();  
  
  //console.log(cityNames, longitudes, order);
  
  // var d = calcDist(longitudes, order);
  // console.log(d);
  
  bestRoute = order.slice();
  
  
  
  
}

function draw() {
  translate(width * 0.5, height * 0.5);
  imageMode(CENTER);
  image(mapImage, 0, 0);
  fill(255, 0, 0);
  noStroke();  
  
  // Draw city dots on a map
  drawDots();
  
  // draw best routes
  drawRoute(bestRoute, "purple", 4);
  
  // Draw routes
  drawRoute(order, "white", 1);  
  
  
    
}


// load data from json file
function processJSON(data) {   
  
  // Parse the JSON data and set the global arrays
  cityData = data; 
  allCities = cityData.length;  
  //console.log(allCities);
  
  // load all data into arrays
  for (var i = 0; i < allCities; ++i) {
    allLongitudes.push(cityData[i].longitude);
    allLatitudes.push(cityData[i].latitude);
    allCityNames.push(cityData[i].city);
  }  
  
}


// set headers and buttons
function setHeaders() {
  
  //h1 = createElement('h1', 'TSP Distance Calculator');  
  
  // Set header text
  var header1 = document.getElementById("header1");
  var text1 = "Traveling Salesperson Problem Distance Calculator";
  header1.innerText = text1;  
  //var textWidth = getWidthOfText(text, "Arial", "15px");
  header1.style.fontSize = "20px";
  header1.style.fontFamily = "Arial"  
  var textHeight = (header1.clientHeight + 1) + "px";
  var textWidth = (header1.clientWidth + 1) + "px";  
  header1.style.left = window.innerWidth / 2 - textWidth / 2 + "px";  
  var header1Pos = header1.getBoundingClientRect();
  //console.log(header1Pos.top, header1Pos.right, header1Pos.bottom, header1Pos.left);
  
  numText = createElement('p', 'Number of Cities:');  
  numText.position(header1Pos.left, header1Pos.bottom + 10);
  //var numTextPos = numText.getBoundingClientRect();  
  //console.log(numTextPos);  
  
  // input text box
  inputBox = createInput('10');
  inputBox.position(header1Pos.left + 130, header1Pos.bottom + 25);
  inputBox.size(25);  
  console.log(inputBox.x, inputBox.width);
  
  // submit button
  button = createButton('submit');
  button.position(inputBox.x + inputBox.width + 5, header1Pos.bottom + 25);
  button.mousePressed(subButt);
  

  var header2 = document.getElementById("header2");
  var text2 = "Travelling to the highlighted cities in the US";
  header2.innerText = text2;    
  header2.style.fontSize = "15px";
  header2.style.fontFamily = "Arial"      
  
}
  
 
// update inputs when submitted
function updateInput() {    
    numCities = parseInt(inputBox.value());    
}

//Select n cities
function selectCities() {
//numCities = parseInt(inputBox.value())
  var index = 0;
  while (cityNames.length < numCities) {
    var i = Math.floor(random(0, allCities-1));
    //console.log(i);
    
    if (!cityNames.includes(allCityNames[i])) {
      cityNames.push(allCityNames[i]);  
      longitudes.push(allLongitudes[i]); 
      latitudes.push(allLatitudes[i]); 
      order.push(index);
      index++;
    }
  }
}


//submit button function
function subButt() {
  updateInput();
  //console.log("input updated to " + numCities);
  // empty arrays
  longitudes = [];
  latitudes = [];
  cityNames = [];
  selectCities();
  //console.log("new cities " + cityNames);
}

// draw dots
function drawDots() {
  var cx = webMercatorX(clon);
  var cy = webMercatorY(clat);
  
  for (var i = 0, l = longitudes.length; i < l; ++i) {
    var lon = longitudes[i];
    var lat = latitudes[i];

    var x = webMercatorX(lon) - cx;
    var y = webMercatorY(lat) - cy;
    strokeWeight(1);
    fill(255, 0, 0);
    //console.log(lon, x)
    ellipse(x, y, 8, 8);
  }
}

function drawRoute(order, col, strw) {
  stroke(col);
  strokeWeight(strw);
  noFill();
  beginShape();
  
  var cx = webMercatorX(clon);
  var cy = webMercatorY(clat);
  
  for (var i = 0, l = order.length; i < l; ++i) {
    
    var n = order[i];
    var lon = longitudes[n];
    var lat = latitudes[n];

    var x = webMercatorX(lon) - cx;
    var y = webMercatorY(lat) - cy;
  vertex(x, y);
  }         
  endShape();
}

// Formula reference - https://en.wikipedia.org/wiki/Web_Mercator_projection
function webMercatorX(lon) {
  lon = radians(lon);  
  var a = (256 / Math.PI) * Math.pow(2, zoom);
  var b = lon + Math.PI;
  return a * b;
}

// Formula reference - https://en.wikipedia.org/wiki/Web_Mercator_projection
function webMercatorY(lat) {
  lat = radians(lat);
  var a = (256 / Math.PI) * Math.pow(2, zoom);
  var b = Math.tan(Math.PI * 0.25 + lat * 0.5);
  var c = Math.PI - Math.log(b);
  return a * c;
}
