# SPTAG (空间分区树与图) 可视化演示 🎯

## 算法简介

SPTAG (Space Partition Tree And Graph，空间分区树与图) 是一种高性能的向量相似度搜索算法，它结合了空间分区树和可导航小世界图的优点。该算法由微软开发，特别适用于大规模、高维度的最近邻搜索问题。

## 核心特性

1. **混合结构**
   - 空间分区树（KD树/BKT）
   - 可导航小世界图
   - 多树组合

2. **搜索策略**
   - 基于树的粗搜索
   - 基于图的精细化
   - 并行搜索路径

## 性能分析

- **构建时间**: O(n log n)
- **查询时间**: 平均情况 O(log n)
- **空间复杂度**: O(n)
- **可扩展性**: 高维度表现优异

## 应用场景

1. **向量搜索**
   - 图像检索
   - 文档嵌入搜索
   - 特征匹配

2. **机器学习**
   - 推荐系统
   - 模式识别
   - 聚类分析

3. **信息检索**
   - 语义搜索
   - 基于内容的检索
   - 相似项搜索

## 可视化功能

本演示实现了以下功能：

1. **结构展示**
   - 空间分区可视化
   - 图连接性展示
   - 搜索路径追踪

2. **交互操作**
   - 向量插入
   - 最近邻搜索
   - 参数调整

3. **性能指标**
   - 搜索时间统计
   - 召回率监控
   - 内存使用跟踪

## 代码结构

```
sptag/
├── index.html      # 主页面
├── sptag.js        # SPTAG实现
└── style.css       # 样式文件
```

## 使用说明

1. **数据操作**
   - 添加向量
   - 搜索最近邻
   - 调整搜索参数

2. **可视化控制**
   - 查看树结构
   - 观察图连接
   - 跟踪搜索过程

## 实现细节

1. **节点结构**
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

2. **树构建**
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

3. **图构建**
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

## 优化策略

1. **构建时优化**
   - 平衡树构建
   - 高效邻居选择
   - 并行处理

2. **搜索优化**
   - 提前终止
   - 优先队列
   - 距离缓存

3. **内存管理**
   - 向量量化
   - 紧凑存储
   - 批量处理

## 关键参数

1. **树参数**
   - 叶子大小
   - 树的数量
   - 分裂策略

2. **图参数**
   - 邻居数量
   - 构建因子
   - 搜索因子

## 高级特性

1. **多线程支持**
   - 并行树构建
   - 并发搜索
   - 负载均衡

2. **质量控制**
   - 召回率监控
   - 精确度跟踪
   - 性能分析

## 参考资源

- [SPTAG: 快速近似最近邻搜索库](https://github.com/Microsoft/SPTAG)
- [用于近似最近邻搜索的空间分区树和图算法](https://arxiv.org/abs/1908.10396)
- [微软的向量搜索解决方案](https://www.microsoft.com/en-us/research/project/vector-search/)
