# Skip List Visualization ⚡

[中文文档](README_zh.md)

## Algorithm Introduction

Skip List is a probabilistic data structure that can perform search, insert, and delete operations in O(log n) expected time. It maintains a multi-level linked list structure, adding multiple levels of indexes on top of an ordered linked list to achieve binary search-like efficiency.

## Core Features

- **Multi-level Indexing**: Accelerates search process through probabilistically built multi-level indexes
- **Balance**: Maintains balance through randomization, no complex balancing operations needed
- **Simplicity**: Relatively simple implementation, easy to understand and maintain

## Performance Analysis

- **Search Time**: O(log n) expected time
- **Insert Time**: O(log n) expected time
- **Delete Time**: O(log n) expected time
- **Space Complexity**: O(n) expected space

## Applications

1. **Database Indexing**
   - Redis Sorted Sets
   - LevelDB in-memory data structure

2. **In-Memory Databases**
   - Efficient range queries
   - Fast data retrieval

## Visualization Features

This demonstration implements the following features:

1. **Dynamic Operations**
   - Insert nodes
   - Delete nodes
   - Search nodes

2. **Visual Effects**
   - Multi-level structure display
   - Search path tracking
   - Node state display

3. **Interactive Features**
   - Real-time animation effects
   - Operation step display
   - Performance metrics statistics

## Code Structure

```
skiplist/
├── index.html      # Main page
├── skiplist.js     # Skip list implementation
└── style.css       # Styling
```

## Usage Instructions

1. **Basic Operations**
   - Click "Insert" button to add new nodes
   - Click "Delete" button to remove nodes
   - Click "Search" button to find nodes

2. **View Effects**
   - Observe node level changes
   - Track search paths
   - View performance statistics

## Implementation Details

1. **Node Structure**
   ```javascript
   class Node {
       constructor(value, level) {
           this.value = value;
           this.forward = new Array(level + 1).fill(null);
       }
   }
   ```

2. **Level Generation**
   ```javascript
   function randomLevel() {
       let level = 0;
       while (Math.random() < 0.5 && level < MAX_LEVEL) {
           level++;
       }
       return level;
   }
   ```

## References

- [Skip Lists: A Probabilistic Alternative to Balanced Trees](https://www.epaperpress.com/sortsearch/download/skiplist.pdf)
- [Redis Sorted Set Implementation](https://github.com/antirez/redis/blob/unstable/src/t_zset.c)
