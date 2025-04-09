let scale;
let cx, cy;

var mycanvas;
var allCities;  // 98 cities
var numCities;
var maxCities = 50;  // Limit for BruteForce method
var allLongitudes = [],
    allLatitudes = [],
    allCityNames = [];
var longitudes = [],
    latitudes = [],
    cityNames = [];
var pitch = 0;
var clat = 38.27;
var clon = -101.7431;
var zoom = 3.3;

var mapImg;
var mapImgWidth = 1024,
    mapImgHeight = 512;

var order = [];
var bestEver = [];
var currentBest = [];
var prevDist = Infinity;
var recordDist = Infinity;
var eliteInd = [];

var generation = 0;
var convergeGeneration = 0;
var maxGeneration = 600;
var popSize = 3300;
var population = [];  // populations of many orders
var fitness = [];  // fitness score for every order of population
var crossoverRate = 0.85;
var mutationRate = 0.25;
var generationGap = 0.25;

function preload() {
    // Load city data from JSON
    loadJSON("cities.json", processJSON);
    // Load a map from mapbox API
    mapImg = loadImage("https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/" +
        clon + "," + clat + "," + zoom + "," + pitch + "/" + mapImgWidth + "x" + mapImgHeight +
        "?access_token=pk.eyJ1Ijoiaml0ZW5kcmEwOTA1IiwiYSI6ImNrZDN0dHFhZDB2bnkyeHBiaGswemgyZ2YifQ.Knz8_fBX5nCLzAQPXdJgTQ");
}

function setup() {
    // Set canvas size based on window width, ensuring minimum 1024px
    let canvasWidth = max(windowWidth * 0.8, mapImgWidth); // Minimum 1024px, scales with window
    let canvasHeight = mapImgHeight; // Fixed height to match map image
    mycanvas = createCanvas(canvasWidth, canvasHeight).parent('sketch-holder');
    console.log("Canvas size:", canvasWidth, canvasHeight);

    // Choose N cities randomly from 98 cities (initial setup)
    selectCities();

    // Generate initial population
    for (var i = 0; i < popSize; i++) {
        population[i] = shuffle(order);
    }
    numElite = floor(population.length * generationGap);
}

function draw() {
  background(255); // Clear previous frames

  // Move origin to center
  translate(width / 2, height / 2);
  imageMode(CENTER);

  // Compute scale and center based on image dimensions
  scale = min(width / mapImgWidth, height / mapImgHeight);
  cx = webMercatorX(clon);
  cy = webMercatorY(clat);

  // Draw background map image, scaled and centered
  image(mapImg, 0, 0, mapImgWidth * scale, mapImgHeight * scale);

  // Genetic Algorithm
  runGA();

  // Draw city dots on a map
  drawDots();

  // Draw best routes
  drawRoute(bestEver, "DarkRed", 1);

  // Print the results
  noStroke();
  fill(80, 200);
  printResults();

  // Keep track of generations and record convergence
  generation++;
  if (Math.abs(prevDist - recordDist) > 0.001) {
      convergeGeneration = generation;
  }

  // Stop loop once reached maxGen
  if (generation > maxGeneration) {
      noLoop();
  }
  prevDist = recordDist;
}


function windowResized() {
    let canvasWidth = max(windowWidth * 0.8, mapImgWidth); // Minimum 1024px, scales with window
    let canvasHeight = mapImgHeight;
    resizeCanvas(canvasWidth, canvasHeight);
}

// Load data from JSON file
function processJSON(data) {
    cityData = data;
    allCities = cityData.length;
    for (var i = 0; i < allCities; ++i) {
        allLongitudes.push(cityData[i].longitude);
        allLatitudes.push(cityData[i].latitude);
        allCityNames.push(cityData[i].city);
    }
}

// Select n cities
function selectCities() {
    numCities = parseInt(document.getElementById('city-count').value) || 25;
    if (numCities > maxCities || numCities <= 0) {
        console.log("Number of cities should be between 1 and " + maxCities + ".");
        numCities = 25;
    }
    var index = 0;
    while (cityNames.length < numCities) {
        var i = Math.floor(random(0, allCities - 1));
        if (!cityNames.includes(allCityNames[i])) {
            cityNames.push(allCityNames[i]);
            longitudes.push(allLongitudes[i]);
            latitudes.push(allLatitudes[i]);
            order.push(index);
            index++;
        }
    }
}

// Update input and reset
function updateInput() {
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

    selectCities();

    for (var i = 0; i < popSize; i++) {
        population[i] = shuffle(order);
    }
    numElite = floor(population.length * generationGap);

    loop();
}

// Reset sketch
function resetSketch() {
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

    selectCities();
    for (var i = 0; i < popSize; i++) {
        population[i] = shuffle(order);
    }
    numElite = floor(population.length * generationGap);
    loop();
}

// Draw dots, routes, and print results
function drawDots() {
  for (let i = 0; i < longitudes.length; i++) {
      let lon = longitudes[i];
      let lat = latitudes[i];
      let x = (webMercatorX(lon) - cx) * scale;
      let y = (webMercatorY(lat) - cy) * scale;
      fill(255, 0, 0);
      stroke(0);
      strokeWeight(1);
      ellipse(x, y, 6, 6);
  }
}

function drawRoute(order, col, strw) {
  stroke(col);
  strokeWeight(strw);
  noFill();
  beginShape();
  for (let i = 0; i < order.length; i++) {
      let n = order[i];
      let lon = longitudes[n];
      let lat = latitudes[n];
      let x = (webMercatorX(lon) - cx) * scale;
      let y = (webMercatorY(lat) - cy) * scale;
      vertex(x, y);
  }
  endShape();
}

function webMercatorX(lon) {
    lon = radians(lon);
    var a = (256 / Math.PI) * Math.pow(2, zoom);
    var b = lon + Math.PI;
    return a * b;
}

function webMercatorY(lat) {
    lat = radians(lat);
    var a = (256 / Math.PI) * Math.pow(2, zoom);
    var b = Math.tan(Math.PI * 0.25 + lat * 0.5);
    var c = Math.PI - Math.log(b);
    return a * c;
}

function printResults() {
    var offset = -width * 0.4;
    var indent = offset + 5;
    var top = 25;
    textStyle(BOLD);
    text("Genetic Algorithm Parameters:", offset, top + 60);
    textStyle(NORMAL);
    text("* No. of Cities: " + numCities + " (input size)", indent, top + 80);
    text("* Generations: " + generation, indent, top + 100);
    text("* Population size: " + popSize + " individuals", indent, top + 120);
    text("* Crossover rate: " + crossoverRate * 100 + "%", indent, top + 140);
    text("* Mutation rate: " + mutationRate * 100 + "%", indent, top + 160);
    text("* Elitism generation gap: " + numElite + " individuals", indent, top + 180);
    textStyle(BOLD);
    text("Convergence at generation: " + convergeGeneration, offset, top + 205);
    if (generation >= maxGeneration) {
        text("Total distance travelled: " + nf(recordDist, 0, 2) + " km [Haversine distance] : max. iterations reached", offset, top + 225);
    } else {
        text("Total distance travelled: " + nf(recordDist, 0, 2) + " km [Haversine distance]", offset, top + 225);
    }
}

function calcDist(lon, lat, order) {
    var total = 0;
    for (var i = 0; i < order.length - 1; i++) {
        cityAIndex = order[i];
        lonA = lon[cityAIndex];
        latA = lat[cityAIndex];
        cityBIndex = order[i + 1];
        lonB = lon[cityBIndex];
        latB = lat[cityBIndex];
        var d = haversine(lonA, lonB, latA, latB);
        total += d;
    }
    return total;
}

function haversine(lon1, lon2, lat1, lat2) {
    var p = 0.017453292519943295;
    var a = 0.5 - Math.cos((lat2 - lat1) * p) * 0.5 +
        Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) * 0.5;
    return 12742 * Math.asin(Math.sqrt(a));
}

function swap(a, i, j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}

// Genetic Algorithm
function runGA() {
    calculateFitness();
    normalizeFitness();
    eliteInd = findIndicesOfMax(fitness, numElite);
    nextGeneration();
}

function calculateFitness() {
    var currentRecord = Infinity;
    for (var i = 0; i < population.length; i++) {
        var d = calcDist(longitudes, latitudes, population[i]);
        if (d < recordDist) {
            recordDist = d;
            bestEver = population[i];
        }
        if (d < currentRecord) {
            currentRecord = d;
            currentBest = population[i];
        }
        fitness[i] = 1 / (d + 1);
    }
}

function normalizeFitness() {
    var sum = 0;
    for (var i = 0; i < fitness.length; i++) {
        sum += fitness[i];
    }
    for (var i = 0; i < fitness.length; i++) {
        fitness[i] = fitness[i] / sum;
    }
}

function nextGeneration() {
    var newPopulation = [];
    while (newPopulation.length < population.length) {
        var parentA = pickOne(population, fitness);
        var parentB = pickOne(population, fitness);
        var crossingProb = random(1);
        var mutationProb = random(1);
        if (crossoverRate > crossingProb) {
            var child = crossOver(parentA, parentB);
            if (mutationRate > mutationProb) {
                mutate(child, mutationRate);
            }
            newPopulation.push(child);
        }
    }
    getElitePop(newPopulation);
    population = newPopulation;
}

function pickOne(list, prob) {
    var index = 0;
    var r = random(1);
    while (r > 0) {
        r = r - prob[index];
        index++;
    }
    index--;
    return list[index].slice();
}

function crossOver(orderA, orderB) {
    var start = floor(random(orderA.length));
    var end = floor(random(start + 1, orderA.length));
    var newOrder = orderA.slice(start, end);
    for (var i = 0; i < orderB.length; i++) {
        var city = orderB[i];
        if (!newOrder.includes(city)) {
            newOrder.push(city);
        }
    }
    return newOrder;
}

function mutate(order, mutationRate) {
    var indexA = floor(random(order.length));
    var indexB = floor(random(order.length));
    swap(order, indexA, indexB);
}

function getElitePop(newPop) {
    for (var i = 0; i < numElite; i++) {
        var popIndex = eliteInd[i];
        newPop[i] = population[popIndex];
    }
}

function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i);
        if (outp.length > count) {
            outp.sort(function(a, b) { return inp[b] - inp[a]; });
            outp.pop();
        }
    }
    return outp;
}
