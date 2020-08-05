# Traveling Salesman Problem Visualizer using Genetic Algorithm

Welcome to Traveling Salesman Problem Visualizer! I built this application because I was fascinated by `Genetic Algorithms`, and I wanted to visualize it in action to solve one of the most interesting problems - The Traveling Salesman Problem. I hope that you enjoy playing around with this visualization tool just as much as I enjoyed building it. You can access it here (use Google Chrome):  https://jitendrabhamare.github.io/p5js_sketch/TSP-MinDistance-GA/

## Overview
This project demonstrates the use of a genetic algorithm to find an optimised solution to the Travelling Salesman Problem. The application randomely chooses specified number of cities, dynamically reads in city data from a JSON file and calculates the shortest distance it can find, linking all cities. Please note than this algorithm does not necessarily always find the shortest path (especially for input size > 35), as the optimization algorithm depends up on various parameter values including total number of generations, crossover rate, mutation rate, generation gap etc. These parameters may be adjusted to find the best route. The actual physical distance on the route, calculated as the [Haversine](https://en.wikipedia.org/wiki/Haversine_formula) distance, is shown in output data. The application displays following `Genetic Algorithm Parameters` - 
- Generations
- Input Size (Number of cities selected)
- Population Size
- Crossover Rate
- Mutation Rate
- Elitism Generation Gap
- Generation at which conversion occures
- Total Harvesian Distance of the current shortest path

## Resources
- City data (JSON file) obtained from: https://gist.github.com/Miserlou/c5cd8364bf9b2420bb29
- Genetic Algorithm Resource (Very Interesting YouTube Series) : https://www.youtube.com/playlist?list=PLRqwX-V7Uu6bJM3VgzjNV5YxVxUwzALHV
- Haversine Distance Formula:
http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
- Map from MapBox: https://www.mapbox.com/api-documentation/#retrieve-a-sprite-image-or-json

## Visualization
<kbd><img src="https://github.com/jitendrabhamare/p5js_sketch/blob/gh-pages/TSP-MinDistance-GA/TSP-GA-Viz.gif" alt="TSP-GA-gif" width="800"/></kbd>

