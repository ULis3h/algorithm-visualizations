# Small World Network Visualization 🌐

[中文文档](README_zh.md)

## Algorithm Introduction

Small World Network is a special type of complex network that exhibits both high clustering and short average path length characteristics. This type of network is ubiquitous in both natural and artificial systems, from social networks to neural networks.

## Network Characteristics

1. **Structural Features**
   - High clustering coefficient
   - Short average path length
   - Degree distribution characteristics

2. **Dynamic Properties**
   - Rapid information propagation
   - Synchronization phenomena
   - Network robustness

## Core Metrics

- **Average Path Length**: O(log n)
- **Clustering Coefficient**: Much higher than random networks
- **Degree Distribution**: Approximately normal distribution

## Application Areas

1. **Social Network Analysis**
   - Social media propagation
   - Disease spread modeling
   - Information diffusion research

2. **Biological Systems**
   - Neural networks
   - Protein networks
   - Ecosystems

3. **Technical Systems**
   - Power grids
   - Internet topology
   - Transportation networks

## Visualization Features

This demonstration implements the following features:

1. **Network Generation**
   - Regular network generation
   - Random rewiring process
   - Dynamic parameter adjustment

2. **Feature Analysis**
   - Path length calculation
   - Clustering coefficient statistics
   - Degree distribution display

3. **Interactive Features**
   - Node dragging
   - Path highlighting
   - Parameter adjustment

## Code Structure

```
small-world/
├── index.html         # Main page
├── network.js         # Network implementation
└── style.css          # Styling
```

## Usage Instructions

1. **Network Generation**
   - Adjust number of nodes
   - Set rewiring probability
   - Generate network structure

2. **Analysis Tools**
   - Calculate network metrics
   - View statistics
   - Explore network properties

## Implementation Details

1. **Network Initialization**
   ```javascript
   function initializeNetwork(n, k) {
       // Create regular ring network
       for (let i = 0; i < n; i++) {
           for (let j = 1; j <= k; j++) {
               connect(i, (i + j) % n);
           }
       }
   }
   ```

2. **Rewiring Process**
   ```javascript
   function rewire(probability) {
       for (let i = 0; i < edges.length; i++) {
           if (Math.random() < probability) {
               // Random rewiring
               rewireEdge(edges[i]);
           }
       }
   }
   ```

## Theoretical Foundation

- **Watts-Strogatz Model**
  - Starting from regular network
  - Random rewiring process
  - Small world property emergence

- **Network Metrics**
  - Path length calculation
  - Clustering coefficient definition
  - Network evolution analysis

## References

- [Collective dynamics of 'small-world' networks](https://www.nature.com/articles/30918)
- [Small-World Networks: Evidence for a Crossover Picture](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.84.3201)
