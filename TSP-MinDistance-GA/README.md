# Traveling Salesman Problem Visualizer Using Genetic Algorithm

Welcome to Traveling Salesman Problem Visualizer! I built this application because I was fascinated by Genetic Algorithms, and I wanted to visualize it in action to solve one of the interesting problems - The Traveling Salesman Problem. I hope that you enjoy playing around with this visualization tool just as much as I enjoyed building it. You can access it here (use Google Chrome):  https://jitendrabhamare.github.io/p5js_sketch/TSP-MinDistance-GA/

## Overview
This project demonstrates the use of a genetic algorithm to find an optimised solution to the Travelling Salesman Problem. The program randomely chooses specified number fof cities, dynamically reads in city data from a JSON file and calculates the shortest distance it can find, linking all cities. The actual physical distance on the route, as the [Haversine](https://en.wikipedia.org/wiki/Haversine_formula) distance, is calculated. The application displays following `Genetic Algorithm Parameters` - 
- Generations
- Input Size (Number of cities selected)
- Population Size
- Crossover Rate
- Mutation Rate
- Elitism Generation Gap
- Generation at which conversion occures
- Total Harvesian Distance of the current shortest path
