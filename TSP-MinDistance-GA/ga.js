//Calculate fitness score
function calculateFitness() {  
  for (var i = 0; i < population.length; i++) {    
    var d = calcDist(longitudes, latitudes, population[i]);
    if (d < recordDist) {
      recordDist = d;
      bestRoute = population[i];
    }
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
}


// For every generation of n population create a new generation of n population
function nextGeneration() {
  newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    
    var order = pickOne(population, fitness);  // pick one with higher fitness
    mutate(order);
    newPopulation[i] = order;
  }
  
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


function mutate(order, mutationRate) {
  var indexA = floor(random(order.length));
  var indexB = floor(random(order.length));
  swap(order, indexA, indexB);
}