# SPTAG (Space Partition Tree And Graph) Visualization 🎯

[中文文档](README_zh.md)

## Algorithm Introduction

SPTAG (Space Partition Tree And Graph) is a high-performance vector similarity search algorithm that combines space partition trees with a navigable small world graph. It was developed by Microsoft and is particularly effective for large-scale, high-dimensional nearest neighbor search problems.

## Core Features

1. **Hybrid Structure**
   - Space partition trees (KD-trees/BKT)
   - Navigable small world graph
   - Multiple tree combination

2. **Search Strategy**
   - Tree-based coarse search
   - Graph-based refinement
   - Parallel search paths

## Performance Analysis

- **Build Time**: O(n log n)
- **Query Time**: O(log n) average case
- **Space Complexity**: O(n)
- **Scalability**: Excellent for high dimensions

## Application Scenarios

1. **Vector Search**
   - Image retrieval
   - Document embedding search
   - Feature matching

2. **Machine Learning**
   - Recommendation systems
   - Pattern recognition
   - Clustering

3. **Information Retrieval**
   - Semantic search
   - Content-based retrieval
   - Similar item search

## Visualization Features

This demonstration implements:

1. **Structure Display**
   - Space partition visualization
   - Graph connectivity
   - Search path tracking

2. **Interactive Operations**
   - Vector insertion
   - Nearest neighbor search
   - Parameter tuning

3. **Performance Metrics**
   - Search time statistics
   - Recall rate monitoring
   - Memory usage tracking

## Code Structure

```
sptag/
├── index.html      # Main page
├── sptag.js        # SPTAG implementation
└── style.css       # Styling
```

## Usage Instructions

1. **Data Operations**
   - Add vectors
   - Search nearest neighbors
   - Adjust search parameters

2. **Visualization Control**
   - View tree structure
   - Observe graph connections
   - Track search process

## Implementation Details

1. **Node Structure**
   ```javascript
   class SPTAGNode {
       constructor(vector, id) {
           this.vector = vector;
           this.id = id;
           this.neighbors = new Set();
           this.treeChildren = [null, null];
       }
   }
   ```

2. **Tree Building**
   ```javascript
   function buildKDTree(points, depth = 0) {
       if (points.length === 0) return null;
       
       const axis = depth % dimension;
       points.sort((a, b) => a.vector[axis] - b.vector[axis]);
       
       const median = Math.floor(points.length / 2);
       const node = points[median];
       
       node.treeChildren[0] = buildKDTree(points.slice(0, median), depth + 1);
       node.treeChildren[1] = buildKDTree(points.slice(median + 1), depth + 1);
       
       return node;
   }
   ```

3. **Graph Construction**
   ```javascript
   function buildGraph(nodes, k) {
       for (const node of nodes) {
           const neighbors = findApproximateNN(node, nodes, k);
           for (const neighbor of neighbors) {
               node.neighbors.add(neighbor);
               neighbor.neighbors.add(node);
           }
       }
   }
   ```

## Optimization Strategies

1. **Build-time Optimization**
   - Balanced tree construction
   - Efficient neighbor selection
   - Parallel processing

2. **Search Optimization**
   - Early termination
   - Priority queue
   - Distance caching

3. **Memory Management**
   - Vector quantization
   - Compact storage
   - Batch processing

## Key Parameters

1. **Tree Parameters**
   - Leaf size
   - Tree number
   - Split strategy

2. **Graph Parameters**
   - Neighbor count
   - Build factor
   - Search factor

## Advanced Features

1. **Multi-threading Support**
   - Parallel tree building
   - Concurrent search
   - Load balancing

2. **Quality Control**
   - Recall rate monitoring
   - Precision tracking
   - Performance profiling

## References

- [SPTAG: A library for fast approximate nearest neighbor search](https://github.com/Microsoft/SPTAG)
- [Space Partition Tree And Graph Algorithm for Approximate Nearest Neighbor Search](https://arxiv.org/abs/1908.10396)
- [Microsoft's Vector Search Solution](https://www.microsoft.com/en-us/research/project/vector-search/)
