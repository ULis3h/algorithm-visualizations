# 小世界网络 (Small World) 可视化演示 🌐

## 算法简介

小世界网络是一种特殊的复杂网络，它同时具有高聚类性和短平均路径长度的特点。这种网络在自然界和人造系统中普遍存在，从社交网络到神经网络都能观察到小世界特性。

## 网络特性

1. **结构特征**
   - 高聚类系数
   - 短平均路径长度
   - 度分布特征

2. **动态特性**
   - 信息快速传播
   - 同步化现象
   - 网络稳健性

## 核心指标

- **平均路径长度**: O(log n)
- **聚类系数**: 远高于随机网络
- **度分布**: 接近正态分布

## 应用领域

1. **社交网络分析**
   - 社交媒体传播
   - 疾病传播模型
   - 信息扩散研究

2. **生物系统**
   - 神经网络
   - 蛋白质网络
   - 生态系统

3. **技术系统**
   - 电力网络
   - 互联网拓扑
   - 交通网络

## 可视化功能

本演示实现了以下功能：

1. **网络生成**
   - 规则网络生成
   - 随机重连过程
   - 参数动态调节

2. **特性分析**
   - 路径长度计算
   - 聚类系数统计
   - 度分布展示

3. **交互功能**
   - 节点拖拽
   - 路径高亮
   - 参数调节

## 代码结构

```
small-world/
├── index.html         # 主页面
├── network.js         # 网络实现
└── style.css          # 样式文件
```

## 使用说明

1. **网络生成**
   - 调节节点数量
   - 设置重连概率
   - 生成网络结构

2. **分析工具**
   - 计算网络指标
   - 查看统计信息
   - 探索网络特性

## 实现细节

1. **网络初始化**
   ```javascript
   function initializeNetwork(n, k) {
       // 创建规则环形网络
       for (let i = 0; i < n; i++) {
           for (let j = 1; j <= k; j++) {
               connect(i, (i + j) % n);
           }
       }
   }
   ```

2. **重连过程**
   ```javascript
   function rewire(probability) {
       for (let i = 0; i < edges.length; i++) {
           if (Math.random() < probability) {
               // 随机重连
               rewireEdge(edges[i]);
           }
       }
   }
   ```

## 理论基础

- **Watts-Strogatz模型**
  - 从规则网络出发
  - 随机重连过程
  - 小世界特性涌现

- **网络度量**
  - 路径长度计算
  - 聚类系数定义
  - 网络演化分析

## 参考资源

- [Collective dynamics of 'small-world' networks](https://www.nature.com/articles/30918)
- [Small-World Networks: Evidence for a Crossover Picture](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.84.3201)
