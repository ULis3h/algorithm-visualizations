# 算法可视化演示集合 🎯

这个仓库包含了多个算法的交互式可视化演示。通过动画和交互的方式，让抽象的算法变得更加直观和易懂。

- 🎥 交互式动画演示
- 🎯 直观的算法流程展示
- ⚡️ 实时参数调整
- 📱 响应式设计
- 🎨 现代化界面

### 1. 跳表 (Skip List) ⚡
跳表是一种随机化的数据结构，通过建立多层索引来加快查找速度。特点：
- 多层级索引结构
- 快速查找过程演示
- 查找路径可视化
- 平均时间复杂度 O(log n)

### 2. 小世界网络 (Small World Network) 🌐
展示了小世界网络的构建过程和特性，包括：
- 规则网络的初始化
- 随机重连的过程
- 网络特征的计算（平均路径长度、聚类系数）
- 交互式节点探索

### 3. HNSW (Hierarchical Navigable Small World) 🔍
实现了层次化可导航小世界图索引算法，特点：
- 多层级结构可视化
- 近邻搜索过程展示
- 实时搜索路径追踪
- 性能指标监控

## 项目特点 ✨

- 📊 交互式可视化界面
- 🎯 算法过程实时展示
- 💻 清晰的代码实现
- 📝 详细的注释说明
- 🔄 动画演示功能
- 👆 支持用户交互

## 技术栈 🛠️

- HTML5 Canvas：绘制动画和图形
- 原生 JavaScript：实现算法逻辑
- CSS3：页面样式和动画效果

## 本地开发 💻

1. **克隆仓库**
   ```bash
   git clone https://github.com/ULis3h/algorithm-visualizations.git
   cd algorithm-visualizations
   ```

2. **运行本地服务器**
   ```bash
   # 使用 Python 的 HTTP 服务器
   python3 -m http.server 8000
   ```

3. **访问演示页面**
   打开浏览器访问 `http://localhost:8000`

## 项目结构 📁

```
algorithm-visualizations/
├── README.md
├── index.html                # 主页面
├── skiplist/               # 跳表算法
│   ├── index.html          # 演示页面
│   ├── skiplist.js        # 算法实现
│   └── styles.css          # 样式文件
├── small-world/             # 小世界网络算法
│   ├── index.html          # 演示页面
│   ├── small-world.js      # 算法实现
│   └── styles.css          # 样式文件
└── hnsw/                   # HNSW算法
    ├── index.html          # 演示页面
    ├── hnsw.js            # 算法实现
    └── styles.css          # 样式文件
```

## 待实现的算法 📝

- [ ] 图算法（最短路径、最小生成树等）
- [ ] 树算法（红黑树、B树等）
- [ ] 字符串算法（KMP、Trie等）
- [ ] 机器学习算法可视化

## 许可证 📄

本项目采用 MIT 许可证。
