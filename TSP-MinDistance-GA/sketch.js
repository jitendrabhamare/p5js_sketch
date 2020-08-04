var mycanvas;
var allCities;  // 98 cities
var numCities;
var maxCities = 50;  
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
var bestEver = [];
var currentBest = [];
var prevDist = Infinity;
var recordDist = Infinity;
var eliteInd = [];

var generation = 0;
var convergeGeneration = 0;
var maxGeneration = 600;
var popSize = 2500;
var population = [];  // populations of many orders
var fitness = [];  //fitness score for every order of population
var crossoverRate = 0.85;
var mutationRate = 0.25;
var generationGap = 0.25;


function preload() {  
  // Load city data from JSON
  loadJSON("cities.json", processJSON);  
  
  
  // Load a map from mapbox api
  mapImage = loadImage("https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/" +
    clon + "," + clat + "," + zoom + "," + pitch + "/" + mapImgWidth + "x" + mapImgHeight +
    "?access_token=pk.eyJ1Ijoiaml0ZW5kcmEwOTA1IiwiYSI6ImNrZDN0dHFhZDB2bnkyeHBiaGswemgyZ2YifQ.Knz8_fBX5nCLzAQPXdJgTQ");
}


function setup() {  
  
  //Img Canvass
  mycanvas = createCanvas(mapImgWidth, mapImgHeight);
  console.log(mapImgWidth, mapImgHeight);
  console.log(windowWidth, windowHeight);
  console.log(width, height);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  mycanvas.position(x, y);  
  
  // set headers
  setHeaders();
  
  // update input to default value first
  updateNumCities();
  
  //choose N cities randomly from 98 cities   
  selectCities();  
  
  
  //Generate initial population
  for (var i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }
  //console.log(population);
  
  numElite = floor(population.length * generationGap);
  //console.log(numElite); 
  
}

function draw() {
  translate(width * 0.5, height * 0.5);
  imageMode(CENTER);
  image(mapImage, 0, 0);
  
  // Genetic Algorithm 
  runGA();   
  
  // Draw city dots on a map    
  drawDots();
  
  // draw best routes
  drawRoute(bestEver, "DarkRed", 1);  
  
  // draw current best routes
  //drawRoute(currentBest, "white", 1);  
  
  //print the results
  noStroke();
  fill(80, 200);
  printResults();
  
  // Keep track of generations and record coverge generation
  generation++;    
  if (Math.abs(prevDist - recordDist > 0.001)) {
    convergeGeneration = generation;
  }
  
  // Stop loop once reached to maxGen
  if (generation > maxGeneration) {
    noLoop();    
  }
   
  prevDist = recordDist;
    
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
  
  var elementX = 10;
  var elementY = 50
  nameP1 = createP('Traveling Salesman Problem');
  nameP1.position(elementX, elementY);
  nameP1.style('fontSize', '25px');
  
  nameP2 = createP('Traveling to the highlighted cities in the US' );
  nameP2.position(elementX, elementY + 40);
  
  
  numCityText = createElement('p', 'Number of Cities:');
  numCityText.position(windowWidth/2, elementY + 20);
  
  numCityRange = createElement('p', '(In range of 1 to 50)');
  numCityRange.position(windowWidth/2, elementY + 40);
  numCityRange.style('fontSize', '12px');
  
  
  // input text box
  inputBox = createInput('25');  
  inputBox.position(windowWidth/2 + 130, elementY + 36);
  inputBox.size(25);  
  
  // submit button  
  button = createButton('Submit');
  button.position(inputBox.x + inputBox.width + 5, elementY + 36);
  button.style('border',  "none");
  button.style('color',  "white");
  button.style('padding', "3px 12px");
  button.style('cursor', "pointer");
  button.style('background-color', "#2196F3"); //blue   
  button.mousePressed(updateInput); 
  
}
  
 
// update inputs when submitted
function updateNumCities() {    
    numCities = parseInt(inputBox.value());    
    //numCities = 25; 
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
function updateInput() {
  console.log(inputBox.value(), allCities);
  if ((inputBox.value() > maxCities) || (inputBox.value()) <= 0) {
    warnText = "Number of cities should be between 1 and " + maxCities + ".";
    return
  }
  
  updateNumCities();
  console.log("input updated to " + numCities);
  
  
  // reset variables
  longitudes = [];
  latitudes = [];
  cityNames = [];
  order = [];
  bestEver = [];
  currentBest = [];
  prevDist = Infinity;
  recordDist = Infinity;
  eliteInd = [];
  generation = 0;
  convergeGeneration = 0;
  fitness = [];
  population = [];    
  
  
  //choose 'inpuBox.value()' cities randomly from 98 cities  
  selectCities();
  //console.log("new cities " + cityNames);
  //console.log(order);
  
    
  //Generate initial population
  for (var i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }
  console.log(population.length);
  
  numElite = floor(population.length * generationGap);
    
  //start loop, just in case prev finished with noloop() executed.
  loop();
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
    //fill(255, 0, 0);
    //noFill();
    //console.log(lon, x)
    ellipse(x, y, 6, 6);
  }
}

function drawRoute(order, col, strw) {
  stroke(col);
  strokeWeight(strw);
  noFill();
  beginShape();
  
  var cx = webMercatorX(clon);
  var cy = webMercatorY(clat);
  
  for (var i = 0, l = bestEver.length; i < l; ++i) {
    
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

//print results
function printResults() {
  var offset = -480;
  var indent = offset + 5;
  var top = 25;
  
  textStyle(BOLD);  
  text("Genetic Algorithm Parameters:", offset, top + 60);
  textStyle(NORMAL);
  text("*  No. of Cities: " + numCities + " (input size)", indent, top + 80);
  text("*  Generations: " + generation, indent, top + 100);
  text("*  Population size: " + popSize + " individuals", indent, top + 120);
  text("*  Crossover rate: " + crossoverRate*100 + "%", indent, top + 140);
  text("*  Mutation rate: " + mutationRate*100 + "%", indent, top + 160);
  text("*  Elitism generation gap: " + numElite + " individuals", indent, top + 180);
  
  textStyle(BOLD);
  text("Convergence at generation: " + convergeGeneration, offset, top + 205);
  if (generation >= maxGeneration) {
    text("Total distance travelled: " + nf(recordDist, 0, 2) + " km [Haversine distance]" + " : max. number of iterations reached", offset, top + 225);
  } else {
    text("Total distance travelled: " + nf(recordDist, 0, 2) + " km [Haversine distance]", offset, top + 225);
  }
  
}

  
// Calculate total distance between cities based on an order 
function calcDist(lon, lat, order) {
  var total = 0;
  for (var i = 0; i < order.length-1; i ++) {
    cityAIndex = order[i];    
    lonA = lon[cityAIndex];
    latA = lat[cityAIndex];
    cityBIndex = order[i+1];    
    lonB = lon[cityBIndex];
    latB = lat[cityBIndex];
    var d = haversine(lonA, lonB, latA, latB);
    total += d;    
  }
  return total;
}
  
//Calculate distance between two latitude-longitude points using Haversine formula
function haversine(lon1, lon2, lat1, lat2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var a = 0.5 - Math.cos((lat2 - lat1) * p) * 0.5 +
    Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) * 0.5;
  return 12742 * Math.asin(Math.sqrt(a));  //2 * R; R = 6371 km
}
  

// Pick two random elements in an array and swap them 
function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j]
  a[j] = temp
}

