# HNSW (Hierarchical Navigable Small World) Visualization 🔍

[中文文档](README_zh.md)

## Algorithm Introduction

HNSW (Hierarchical Navigable Small World) is a state-of-the-art algorithm for approximate nearest neighbor search. It combines the concepts of small world networks with a hierarchical structure to achieve high performance in high-dimensional spaces.

## Core Features

1. **Hierarchical Structure**
   - Multi-layer network design
   - Layer-wise navigation
   - Logarithmic scaling

2. **Search Strategy**
   - Greedy routing
   - Layer-wise refinement
   - Proximity-based navigation

## Performance Analysis

- **Query Time**: O(log n)
- **Build Time**: O(n log n)
- **Space Complexity**: O(n log n)
- **Accuracy**: High recall rate with proper parameters

## Application Scenarios

1. **Information Retrieval**
   - Similar image search
   - Document similarity
   - Recommendation systems

2. **Machine Learning**
   - Feature matching
   - Pattern recognition
   - Clustering

3. **Computer Vision**
   - Image retrieval
   - Face recognition
   - Object detection

## Visualization Features

This demonstration implements:

1. **Structure Display**
   - Layer hierarchy visualization
   - Node connections
   - Search path tracking

2. **Interactive Operations**
   - Point insertion
   - Nearest neighbor search
   - Parameter adjustment

3. **Performance Monitoring**
   - Search time statistics
   - Accuracy metrics
   - Memory usage

## Code Structure

```
hnsw/
├── index.html      # Main page
├── hnsw.js         # HNSW implementation
└── style.css       # Styling
```

## Usage Instructions

1. **Data Operations**
   - Add points
   - Search nearest neighbors
   - Adjust parameters

2. **Visualization Control**
   - View layer structure
   - Track search process
   - Analyze performance

## Implementation Details

1. **Node Structure**
   ```javascript
   class Node {
       constructor(vector, maxLevel) {
           this.vector = vector;
           this.connections = new Array(maxLevel + 1)
               .fill()
               .map(() => new Set());
       }
   }
   ```

2. **Search Algorithm**
   ```javascript
   function searchLayer(query, entryPoint, layer) {
       let current = entryPoint;
       while (true) {
           let changed = false;
           for (let neighbor of current.connections[layer]) {
               if (distance(query, neighbor) < distance(query, current)) {
                   current = neighbor;
                   changed = true;
                   break;
               }
           }
           if (!changed) break;
       }
       return current;
   }
   ```

## Optimization Tips

1. **Parameter Tuning**
   - M (max connections)
   - efConstruction
   - efSearch

2. **Distance Computation**
   - Vector normalization
   - Distance caching
   - Dimension reduction

3. **Memory Management**
   - Connection pruning
   - Level optimization
   - Memory pooling

## References

- [Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs](https://arxiv.org/abs/1603.09320)
- [HNSW Implementation in Faiss](https://github.com/facebookresearch/faiss)
