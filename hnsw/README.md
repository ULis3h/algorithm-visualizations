# HNSW Algorithm Visualization / HNSW 算法可视化

[English](#english) | [中文](#chinese)

<a name="english"></a>
## English

### Introduction
This project provides an interactive visualization of the Hierarchical Navigable Small World (HNSW) algorithm using Three.js. It demonstrates how HNSW performs approximate nearest neighbor search through a hierarchical structure of layers.

### Features
- **3D Visualization**: Clear representation of HNSW's multi-layer structure
- **Interactive Navigation**: Orbit controls for rotating and zooming the view
- **Search Path Visualization**: Visual demonstration of how HNSW traverses through layers
- **Node Types**:
  - Entry point (Green)
  - Visited nodes (Yellow)
  - Normal nodes (Grey)
  - Query point (Red)

### Technical Details
- **Framework**: Pure JavaScript with Three.js
- **Key Components**:
  - `visualization.js`: Handles all 3D rendering and visual effects
  - `hnsw.js`: Implements the core HNSW algorithm logic
  - `index.html`: Main entry point and UI structure
  - `styles.css`: Styling for the UI elements

### Usage
1. Open `index.html` in a modern web browser
2. Use mouse/trackpad to:
   - Left click + drag: Rotate the view
   - Right click + drag: Pan the view
   - Scroll: Zoom in/out

### Implementation Notes
- Nodes are represented as flat circles on each layer
- Connections between nodes are shown as lines
- Search paths are highlighted with blue arrows
- Layer transitions are shown with curved arrows

---

<a name="chinese"></a>
## 中文

### 简介
本项目使用 Three.js 提供了分层可导航小世界（HNSW）算法的交互式可视化。展示了 HNSW 如何通过分层结构进行近似最近邻搜索。

### 特性
- **3D 可视化**：清晰展示 HNSW 的多层结构
- **交互式导航**：支持视图的旋转和缩放
- **搜索路径可视化**：直观展示 HNSW 如何在层间遍历
- **节点类型**：
  - 入口点（绿色）
  - 已访问节点（黄色）
  - 普通节点（灰色）
  - 查询点（红色）

### 技术细节
- **框架**：纯 JavaScript 配合 Three.js
- **主要组件**：
  - `visualization.js`：处理所有 3D 渲染和视觉效果
  - `hnsw.js`：实现核心 HNSW 算法逻辑
  - `index.html`：主入口和 UI 结构
  - `styles.css`：UI 元素样式

### 使用方法
1. 在现代浏览器中打开 `index.html`
2. 使用鼠标/触控板：
   - 左键 + 拖动：旋转视图
   - 右键 + 拖动：平移视图
   - 滚轮：缩放视图

### 实现说明
- 节点表示为每层上的扁平圆形
- 节点间的连接用线条表示
- 搜索路径用蓝色箭头高亮显示
- 层间转换用曲线箭头表示
