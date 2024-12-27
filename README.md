# Algorithm Visualization Collection 🎯

[中文文档](README_zh.md)

This repository contains interactive visualizations of various classic algorithms and data structures. Through animations and interactions, it helps understand the core concepts and working principles of algorithms. Each algorithm comes with detailed documentation and examples for learning and practice.

## Implemented Algorithms

### 1. [Skip List](skiplist/) ⚡
A probabilistic data structure that uses a layered index to accelerate searching.
- **Time Complexity**: O(log n) average search time
- **Features**: 
  - Multi-level fast indexing
  - Probabilistic balancing
  - Space-time trade-off
- **Visualization Features**:
  - Search path tracking
  - Node level display
  - Real-time animation

### 2. [Small World Network](small-world/) 🌐
Demonstrates the "six degrees of separation" phenomenon and small-world characteristics.
- **Network Features**:
  - Average path length: O(log n)
  - High clustering coefficient
- **Core Concepts**:
  - Regular to small-world network transition
  - Random rewiring process
  - Network feature quantification
- **Interactive Features**:
  - Dynamic parameter adjustment
  - Network property calculation
  - Node relationship exploration

### 3. [HNSW (Hierarchical Navigable Small World)](hnsw/) 🔍
Efficient approximate nearest neighbor search algorithm combining small-world networks and multi-level structure.
- **Performance**:
  - Query time: O(log n)
  - Build time: O(n log n)
  - Space complexity: O(n log n)
- **Algorithm Features**:
  - Multi-level navigation structure
  - Greedy routing strategy
  - Probabilistic layering
- **Visualization Elements**:
  - Layer structure display
  - Search path tracking
  - Performance monitoring

### 4. [B+ Tree](btree/) 🌳
Efficient multi-way search tree widely used in database indexing and file systems.
- **Performance**:
  - Search time: O(log n)
  - Insert time: O(log n)
  - High space utilization
- **Algorithm Features**:
  - All data stored in leaf nodes
  - Leaf nodes form a linked list
  - Non-leaf nodes store only indexes
- **Visualization Elements**:
  - Tree structure dynamic display
  - Insert operation demonstration
  - Search process tracking

### 5. [SPTAG (Space Partition Tree And Graph)](sptag/) 🎯
High-performance vector similarity search algorithm combining space partition trees with navigable small world graphs.
- **Performance**:
  - Build time: O(n log n)
  - Query time: O(log n) average case
  - Space complexity: O(n)
- **Algorithm Features**:
  - Hybrid tree-graph structure
  - Parallel search paths
  - Multi-threading support
- **Visualization Elements**:
  - Space partition visualization
  - Graph connectivity display
  - Search path tracking

## Technical Implementation 🛠️

- **Frontend Technologies**:
  - HTML5 Canvas: Drawing and animation
  - Native JavaScript: Algorithm implementation
  - CSS3: Layout and styling

- **Project Features**:
  - No dependencies
  - High-performance rendering
  - Responsive layout
  - Elegant animations

## Local Development 💻

1. **Setup**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/algorithm-visualizations.git
   cd algorithm-visualizations
   
   # Start local server
   python3 -m http.server 8000
   ```

2. **Access Demos**
   - Open browser and visit `http://localhost:8000`
   - Select the algorithm to view
   - Follow the README of each algorithm

## Development Plans 📝

- [ ] Graph Algorithms
  - Shortest Path Algorithms
  - Minimum Spanning Tree
  - Graph Coloring
- [ ] Advanced Tree Structures
  - Red-Black Tree
  - AVL Tree
  - Trie
- [ ] String Algorithms
  - KMP Algorithm
  - Suffix Array
  - AC Automaton

## Contributing 👥

Contributions of new algorithm implementations or improvements to existing ones are welcome! Please follow these steps:

1. Fork this repository
2. Create a new branch `git checkout -b feature/algorithm-name`
3. Commit changes `git commit -m 'Add new algorithm'`
4. Push to branch `git push origin feature/algorithm-name`
5. Submit Pull Request

## License 📄

MIT License - See [LICENSE](LICENSE) file for details
