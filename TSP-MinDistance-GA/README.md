# Traveling Salesman Problem Visualizer — Genetic Algorithm

![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![p5.js](https://img.shields.io/badge/-p5.js-ED225D?logo=p5.js&logoColor=white)
![Mapbox](https://img.shields.io/badge/-Mapbox-4264FB?logo=mapbox&logoColor=white)
[![GitHub Issues](https://img.shields.io/github/issues/jitendrabhamare/p5js_sketch)](https://github.com/jitendrabhamare/p5js_sketch/issues)
[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/jitendrabhamare/p5js_sketch)](https://github.com/jitendrabhamare/p5js_sketch/commits/gh-pages)

> This interactive application was developed to visualize how Genetic Algorithms can solve the classic Traveling Salesman Problem (TSP) using real geographical data plotted on a Mapbox-rendered map.

👉 **[Live Demo »](https://jitendrabhamare.github.io/p5js_sketch/TSP-MinDistance-GA/)**  
*(Best viewed on Google Chrome)*

![Traveling Salesman Problem](https://github.com/jitendrabhamare/p5js_sketch/blob/gh-pages/TSP-MinDistance-GA/tsp-website-screenshot.png)

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Why Genetic Algorithm?](#why-genetic-algorithm)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Resources](#resources)
- [Visualization](#visualization)
- [Acknowledgments](#acknowledgments)
- [Dependencies](#dependencies)

---

## Overview
This project demonstrates the use of a Genetic Algorithm to find an optimized solution to the Traveling Salesman Problem (TSP). The application randomly selects a specified number of cities (up to 50) from a dataset of 98 U.S. cities, reads the city data dynamically from a JSON file, and calculates the shortest possible route that visits all selected cities and returns to the origin.

Note that this algorithm does not always guarantee the absolute shortest path, particularly for input sizes greater than 35, as its effectiveness depends on parameters such as the number of generations, crossover rate, mutation rate, and generation gap. The physical distance of the route is computed using the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula) and displayed as part of the output.

**The following Genetic Algorithm parameters are visualized**:
- Generations
- Input Size (Number of cities selected)
- Population Size
- Crossover Rate
- Mutation Rate
- Elitism Generation Gap
- Generation at which convergence occurs
- Total Haversine Distance of the current shortest path

---

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript (p5.js)
- **Mapping API**: Mapbox Static API
- **Algorithm**: Genetic Algorithm with customizable parameters
- **Data**: A dataset of 98 U.S. cities with latitude and longitude coordinates
  
---

## Features
- Interactive selection of the number of cities (1 to 50) to include in the route
- Real-time visualization of the evolving route using a Genetic Algorithm
- Display of algorithm parameters and convergence statistics
- Map integration using Mapbox to show geographical locations
- Option to restart the simulation and recalculate the route

---

## How It Works
1. **Initialization**:
   - A random set of cities is selected from a dataset of 98 U.S. cities
   - An initial population of possible routes is generated

2. **Genetic Algorithm**:
   - **Fitness Calculation**: The fitness of each route is inversely proportional to the total distance traveled (using Haversine distance)
   - **Selection**: Elite individuals are preserved, and parents are selected based on fitness
   - **Crossover**: New routes are created by combining segments from two parent routes
   - **Mutation**: Random swaps are applied to introduce diversity
   - This process repeats for a maximum of 600 generations or until convergence

3. **Visualization**:
   - The best route is drawn on a Mapbox map, updated each generation
   - Cities are marked with dots, and the route is shown as a line

---

## Why Genetic Algorithm?
The Traveling Salesman Problem (TSP) is an NP-hard problem, characterized by an exhaustive search space where the number of possible routes for `n` cities is `n!` (factorial), resulting in a time complexity of `O(n!)`. For example, with just 25 cities, this equates to approximately 1.55 × 10^25 permutations, making exact solutions impractical for large datasets due to this combinatorial explosion.

To address this, a Genetic Algorithm (GA) is employed as an efficient heuristic approach. By evolving a population of potential routes over generations through selection, crossover, and mutation, GA significantly reduces the time complexity to approximately `O(g * p * n)`, where `g` is the number of generations (e.g., 600), `p` is the population size (e.g., 3300), and `n` is the number of cities. This represents a substantial improvement over the factorial complexity, enabling feasible approximations for moderate-sized problems.

The algorithm draws inspiration from natural evolution, iteratively refining solutions where fitter routes (those with shorter distances) are more likely to be selected and combined to produce offspring. However, this evolutionary analogy has limitations: for larger numbers of cities, GA may converge to a local optimum rather than the global minimum, and its efficiency can decline as the problem scale increases. Nevertheless, for the moderate city counts visualized here (up to 50), GA strikes a practical balance between solution quality and computational efficiency, offering a valuable tool for tackling this complex optimization challenge.

---

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, etc.)
- Internet connection (for Mapbox API)
- Basic understanding of JavaScript and p5.js (optional for development)

### Installation
```bash
git clone https://github.com/jitendrabhamare/p5js_sketch.git
cd p5js_sketch/TSP-MinDistance-GA
```

- Open `index.html` in a web browser or use a local server (e.g., Live Server in VS Code) to run the project
- Ensure the Mapbox API token in `sketch.js` is valid (replace if necessary with your own token from [Mapbox](https://www.mapbox.com/))

---

## Usage
1. Adjust the number of cities using the input field (1 to 50)
2. Click the **Run** button to start the simulation
3. Watch the route evolve in real-time on the map
4. View the algorithm parameters and total distance traveled below the map
5. Click **Restart Simulation** to reset and try a new configuration

---

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes and commit them (`git commit -m "Description of changes"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request with a detailed description of your changes

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact
- **Author**: Jitendra Bhamare
- **GitHub**: [@jitendrabhamare](https://github.com/jitendrabhamare)
- **Email**: [jitendra@email.com](mailto:jitendra@email.com)

---

## Resources
- **City Data**: JSON file obtained from [https://gist.github.com/Miserlou/c5cd8364bf9b2420bb29](https://gist.github.com/Miserlou/c5cd8364bf9b2420bb29)
- **Genetic Algorithm Resource**: Highly recommended YouTube series by [The Coding Train](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6bJM3VgzjNV5YxVxUwzALHV)
- **Haversine Distance Formula**: Reference from [Stack Overflow](http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
- **Mapbox API**: Mapping service provided by [https://www.mapbox.com/api-documentation/](https://www.mapbox.com/api-documentation/)

---

## Visualization
<kbd>
  <img src="https://github.com/jitendrabhamare/p5js_sketch/blob/gh-pages/TSP-MinDistance-GA/TSP-GA-Viz.gif" alt="TSP-GA-Visualization" width="800" />
</kbd>

This GIF demonstrates the Genetic Algorithm in action, showing the evolution of the shortest route over multiple generations.

---

## Acknowledgments
- Special thanks to the p5.js community for the creative coding framework
- Gratitude to Mapbox for providing the mapping API
- Credit to the original city dataset provider [https://gist.github.com/Miserlou](https://gist.github.com/Miserlou) for the geographical data

---

## Dependencies
- **p5.js**: For interactive graphics and simulations
- **Mapbox API**: For map rendering (requires a valid access token)
