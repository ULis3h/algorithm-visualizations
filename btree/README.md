# B+ Tree Visualization 🌳

[中文文档](README_zh.md)

## Algorithm Introduction

B+ Tree is a tree data structure, a variant of the B-tree, commonly used in databases and file systems. Its distinctive feature is that all data is stored in leaf nodes, with non-leaf nodes containing only index information, and leaf nodes connected through a linked list, making it particularly suitable for range queries and sequential access.

## Core Features

1. **Structural Features**
   - All data stored in leaf nodes
   - Non-leaf nodes store only indexes
   - Leaf nodes linked together
   - All leaf nodes at same level

2. **Balance Properties**
   - All paths have same length
   - Automatic balance maintenance
   - Generally small height

## Performance Analysis

- **Search Time**: O(log n)
- **Insert Time**: O(log n)
- **Delete Time**: O(log n)
- **Range Query**: Efficient

## Application Scenarios

1. **Database Systems**
   - Index implementation
   - Range queries
   - Sequential access

2. **File Systems**
   - Directory structure
   - File indexing
   - Block management

## Visualization Features

This demonstration implements:

1. **Tree Operations**
   - Data insertion
   - Data search
   - Range queries

2. **Visual Effects**
   - Tree structure display
   - Node split process
   - Search path tracking

3. **Interactive Features**
   - Dynamic insertion
   - Real-time updates
   - Operation feedback

## Code Structure

```
btree/
├── index.html      # Main page
├── btree.js        # B+ tree implementation
└── style.css       # Styling
```

## Usage Instructions

1. **Basic Operations**
   - Enter number and click "Insert" to add node
   - Enter number and click "Search" to find node
   - Observe tree structure changes

2. **View Effects**
   - Node split process
   - Tree balance adjustment
   - Search path display

## Implementation Details

1. **Node Structure**
   ```javascript
   class BPlusTreeNode {
       constructor(isLeaf = true) {
           this.isLeaf = isLeaf;
           this.keys = [];
           this.children = [];
           this.next = null;  // Leaf node linked list
       }
   }
   ```

2. **Insert Operation**
   ```javascript
   function insert(key) {
       if (root.keys.length === maxKeys) {
           // Node split
           splitRoot();
       }
       insertNonFull(root, key);
   }
   ```

3. **Search Operation**
   ```javascript
   function search(key) {
       let current = root;
       while (!current.isLeaf) {
           let i = 0;
           while (i < current.keys.length && key > current.keys[i]) {
               i++;
           }
           current = current.children[i];
       }
       return current;
   }
   ```

## Optimization Strategies

1. **Node Optimization**
   - Reasonable node size
   - Cache-friendly structure
   - Efficient split strategy

2. **Operation Optimization**
   - Batch insertion
   - Delayed split
   - Space pre-allocation

## References

- [Database Management Systems](https://www.amazon.com/Database-Management-Systems-Raghu-Ramakrishnan/dp/0072465638)
- [Introduction to Algorithms](https://mitpress.mit.edu/books/introduction-algorithms-fourth-edition)
- [B+ Tree Visualization](https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html)
