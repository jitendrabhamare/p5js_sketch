//Calculate fitness score
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
    // Fitness is inverse of a distance. The '+ 1' in denominator ensures non-infinity value for d = 0.
    fitness[i] = 1/ (d + 1);
    
  }
}

// Map fitness value to probability i.e. between 0% and 100%
function normalizeFitness() {
  var sum = 0;
  for (var i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  
  for (var i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;
  } 
  //console.log(fitness);
  
}


// For every generation of n population create a new generation of n population
// Pick, cross them over and then mutate
function nextGeneration() {
  newPopulation = [];
  while (newPopulation.length < population.length) {
  //for (var i = 0; i < population.length; i++) {
    
    var parentA = pickOne(population, fitness);  // pick A with higher fitness
    var parentB = pickOne(population, fitness);  // pick B with higher fitness
    
    // create a child by using crossover
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
  
  //console.log(population);
  //console.log('before: ' + newPopulation);
  // Make sure you add the elite orders into new Population 
  getElitePop(newPopulation);
//   for (var i = 0; i < numElite; i++) {
      
//   }
  //console.log('after: ' + newPopulation);
  population = newPopulation;  
  
}

// Pick one with higher fitness
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

// Cannot use typical crossOver (which is - join one half of first array and another half of second array) as the requirements is that output array should have all unique elements, therefore use following algorithm.
// Pick random part of first array and and fill remaining part of output array from second array in order of second array.
function crossOver(orderA, orderB) {
  var start = floor(random(orderA.length));
  var end = floor(random(start + 1, orderA.length));
  var newOrder = orderA.slice(start, end);
  
  //var left = numCities - newOrder.length;
  
  for (var i = 0; i < orderB.length; i++) {
    var city = orderB[i];
    //Ensures adding unique values
    if (!newOrder.includes(city)) {
      newOrder.push(city);
    }
  }
  return newOrder; 
}

    
function mutate(order, mutationRate) {        
  var indexA = floor(random(order.length));
  var indexB = floor(random(order.length));
  //var indexB = (indexA + 1) % numCities;            
  swap(order, indexA, indexB); 
}

// function mutate(order, mutationRate) {
//   //console.log(numCities);
//   for (var i = 0; i < numCities; i++) {
//     if (random(1) < mutationRate) {
//       var indexA = floor(random(order.length));
//       var indexB = (indexA + 1) % numCities;      
//       //var indexB = floor(random(order.length));
//       swap(order, indexA, indexB);
//     }
//   }
// }


function getElitePop(newPop) {
  for (var i = 0; i < numElite; i++) {
    popIndex = eliteInd[i];
    newPop[i] = population[popIndex];
  }
  
  
  //console.log(numElite);
}



// Find index of top 'count' element of an array
function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function(a, b) { return inp[b] - inp[a]; }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    return outp;
}





  




