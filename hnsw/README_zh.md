# HNSW (Hierarchical Navigable Small World) 可视化演示 🔍

## 算法简介

HNSW (Hierarchical Navigable Small World) 是一种高效的近似最近邻搜索算法，它通过构建多层次的小世界网络结构来加速搜索过程。该算法在高维空间中表现出色，广泛应用于向量相似度搜索领域。

## 核心特性

1. **多层结构**
   - 分层索引设计
   - 层级间导航
   - 渐进式搜索

2. **搜索策略**
   - 贪婪路由
   - 启发式搜索
   - 多入口点机制

## 性能指标

- **查询时间**: O(log n)
- **构建时间**: O(n log n)
- **空间复杂度**: O(n log n)
- **召回率**: 接近精确搜索

## 应用场景

1. **相似图像搜索**
   - 图像特征匹配
   - 人脸识别系统
   - 图像检索

2. **推荐系统**
   - 物品相似度计算
   - 用户兴趣匹配
   - 实时推荐

3. **自然语言处理**
   - 语义相似度计算
   - 文档去重
   - 文本聚类

## 可视化功能

本演示实现了以下功能：

1. **数据操作**
   - 点的插入
   - 最近邻搜索
   - 层级浏览

2. **可视化效果**
   - 多层级结构展示
   - 搜索路径追踪
   - 连接关系显示

3. **交互特性**
   - 动态添加点
   - 搜索过程演示
   - 参数调节

## 代码结构

```
hnsw/
├── index.html      # 主页面
├── hnsw.js         # HNSW实现
└── style.css       # 样式文件
```

## 使用说明

1. **构建索引**
   - 添加数据点
   - 观察层级结构
   - 调整参数

2. **执行搜索**
   - 选择查询点
   - 观察搜索路径
   - 查看结果

## 实现细节

1. **节点结构**
   ```javascript
   class Node {
       constructor(vector, level) {
           this.vector = vector;
           this.connections = new Array(level + 1).fill().map(() => new Map());
       }
   }
   ```

2. **层级生成**
   ```javascript
   function getRandomLevel() {
       let level = 0;
       while (Math.random() < LEVEL_PROBABILITY && level < MAX_LEVEL) {
           level++;
       }
       return level;
   }
   ```

3. **搜索算法**
   ```javascript
   function searchLayer(query, entryPoint, layer) {
       let current = entryPoint;
       while (true) {
           let changed = false;
           for (let neighbor of current.connections[layer].values()) {
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

## 优化技巧

1. **入口点选择**
   - 多入口点机制
   - 动态更新策略
   - 层级平衡

2. **连接构建**
   - 启发式连接
   - 双向链接
   - 质量控制

## 参考资源

- [Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs](https://arxiv.org/abs/1603.09320)
- [HNSW Implementation in Faiss](https://github.com/facebookresearch/faiss)
- [Understanding HNSW Algorithm](https://www.pinecone.io/learn/hnsw)
