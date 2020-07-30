var counter = 0;
var totalPermutations;

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

// Lexographic Algorithm 
// Credit - https://www.quora.com/How-would-you-explain-an-algorithm-that-generates-permutations-using-lexicographic-ordering

function nextLexoOrder() {  
  
  // Step 1. Find the largest i such that order[i] < order[i+1]  
  var largestI = -1;
  for (var i = 0; i < order.length - 1; i++) {
    if (order[i] < order[i + 1]) {
      largestI = i;
    }
  }
  
  // Step 1a. If there is no such i, then we're done
  if (largestI == -1) {
    noLoop();
    console.log('finished');
  }
  
  
// Step 2. Find the largest j such that order[i] < order[j]
  var largestJ = -1;
  for (var j = 0; j < order.length; j++) {
    if (order[largestI] < order[j]) {
      largestJ = j;
    }
  }
  
  
// Step 3. Swap order[i] and order[j]
  swap(order, largestI, largestJ);
  
//  Step 4. Reverse from largestI + 1 to end  
  var endArray = order.splice(largestI + 1);
  endArray.reverse();
  order.push(...endArray);
  //order = order.concat(endArray);
  
  counter++;
  
}

// Pick two random elements in an array and swap them 
function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j]
  a[j] = temp
}

// Factorail of n
function factorial(n) {
   if (n == 1) {
     return 1;
   }
  else {
     return n * factorial(n-1); 
  }
}