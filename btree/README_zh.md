# B+ 树可视化演示 🌳

## 算法简介

B+ 树是一种树数据结构，是B树的变体，常用于数据库和文件系统中。它的特点是所有数据都存储在叶子节点，非叶子节点只存储索引，叶子节点通过链表相连，这种结构非常适合范围查询和顺序访问。

## 核心特性

1. **结构特点**
   - 所有数据存储在叶子节点
   - 非叶节点只存储索引
   - 叶子节点通过链表相连
   - 所有叶子节点在同一层

2. **平衡特性**
   - 所有路径长度相同
   - 自动维持平衡
   - 高度通常较小

## 性能分析

- **查找时间**: O(log n)
- **插入时间**: O(log n)
- **删除时间**: O(log n)
- **范围查询**: 高效

## 应用场景

1. **数据库系统**
   - 索引实现
   - 范围查询
   - 顺序访问

2. **文件系统**
   - 目录结构
   - 文件索引
   - 块管理

## 可视化功能

本演示实现了以下功能：

1. **树操作**
   - 插入数据
   - 查找数据
   - 范围查询

2. **可视化效果**
   - 树结构展示
   - 节点分裂过程
   - 查找路径追踪

3. **交互特性**
   - 动态插入
   - 实时更新
   - 操作反馈

## 代码结构

```
btree/
├── index.html      # 主页面
├── btree.js        # B+树实现
└── style.css       # 样式文件
```

## 使用说明

1. **基本操作**
   - 输入数字点击"插入"添加节点
   - 输入数字点击"查找"搜索节点
   - 观察树的结构变化

2. **查看效果**
   - 节点分裂过程
   - 树的平衡调整
   - 查找路径展示

## 实现细节

1. **节点结构**
   ```javascript
   class BPlusTreeNode {
       constructor(isLeaf = true) {
           this.isLeaf = isLeaf;
           this.keys = [];
           this.children = [];
           this.next = null;  // 叶子节点链表
       }
   }
   ```

2. **插入操作**
   ```javascript
   function insert(key) {
       if (root.keys.length === maxKeys) {
           // 节点分裂
           splitRoot();
       }
       insertNonFull(root, key);
   }
   ```

3. **查找操作**
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

## 优化策略

1. **节点优化**
   - 合理的节点大小
   - 缓存友好的结构
   - 高效的分裂策略

2. **操作优化**
   - 批量插入
   - 延迟分裂
   - 预分配空间

## 参考资源

- [Database Management Systems](https://www.amazon.com/Database-Management-Systems-Raghu-Ramakrishnan/dp/0072465638)
- [Introduction to Algorithms](https://mitpress.mit.edu/books/introduction-algorithms-fourth-edition)
- [B+ Tree Visualization](https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html)
