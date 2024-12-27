# 算法可视化演示集合

这个仓库包含了多个算法的交互式可视化演示。每个演示都旨在帮助理解算法的工作原理和核心概念。通过动画和交互的方式，让抽象的算法变得更加直观和易懂。

## 在线演示

👉 [查看所有演示](https://ULis3h.github.io/algorithm-visualizations)

## 已实现的算法

### 1. 跳表 (Skip List)
跳表是一种随机化的数据结构，通过建立多层索引来加快查找速度。它是一种可以代替平衡树的数据结构。

**特点：**
- 平均时间复杂度：O(log n)
- 空间复杂度：O(n)
- 实现简单，插入和删除操作比平衡树更简单
- 支持快速的范围查询

[查看跳表演示](./skiplist/)

## 项目特点

- 📊 交互式可视化
- 🎯 直观的算法演示
- 💻 清晰的代码实现
- 📝 详细的文档说明
- 🔄 动画演示过程
- 👆 支持用户交互

## 技术栈

- HTML5 Canvas：绘制动画和图形
- 原生 JavaScript：实现算法逻辑
- CSS3：页面样式和动画效果

## 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/ULis3h/algorithm-visualizations.git
   cd algorithm-visualizations
   ```

2. **运行本地服务器**
   ```bash
   # 使用 Python 的 HTTP 服务器
   python3 -m http.server 8000
   # 或使用 Node.js 的 http-server（需要先安装）
   npx http-server
   ```

3. **访问演示页面**
   打开浏览器访问 `http://localhost:8000`

## 项目结构

```
algorithm-visualizations/
├── README.md
├── index.html              # 主页面
├── .gitignore
└── skiplist/              # 跳表算法
    ├── index.html         # 跳表演示页面
    ├── skiplist.js        # 跳表实现
    └── styles.css         # 样式文件
```

## 如何贡献

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 待实现的算法

- [ ] 排序算法（快速排序、归并排序等）
- [ ] 图算法（DFS、BFS、最短路径等）
- [ ] 树算法（二叉树、红黑树等）
- [ ] 字符串算法（KMP、Trie等）

## 联系方式

- GitHub: [@ULis3h](https://github.com/ULis3h)

## 许可证

本项目采用 MIT 许可证。查看 [LICENSE](LICENSE) 文件了解更多信息。

## 跳表查找演示

这是一个交互式的跳表（Skip List）查找算法演示页面。通过可视化的方式展示跳表的结构和查找过程，帮助理解跳表的工作原理。

## 在线演示

👉 [在线查看演示](https://ULis3h.github.io/algorithm-visualizations/skiplist/)

<div align="center">
  <iframe src="skiplist/index.html" width="100%" height="700" frameborder="0" style="max-width: 1000px; width: 100%; border: 2px solid #1a73e8; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></iframe>
</div>

## 什么是跳表？

跳表是一种随机化的数据结构，可以实现对有序链表的快速搜索。它通过在链表的基础上添加多级索引来加快查找速度，平均时间复杂度为 O(log n)。

## 演示功能

### 基本特性
- 多层级节点展示
- 指针关系可视化
- 实时查找动画
- 查找路径高亮
- 同一节点多层级连接

### 交互方式
1. 输入要查找的数字
2. 点击"查找"按钮开始动画
3. 观察查找过程中的路径
4. 使用"重置"按钮重新开始

## 可视化说明

- 蓝色圆圈：普通节点
- 绿色圆圈：查找路径上的节点
- 红色圆圈：当前正在访问的节点
- 蓝色箭头：节点间的指针关系
- 灰色虚线框：同一节点在不同层级的连接

## 源代码实现

<details>
<summary>点击展开查看完整源代码</summary>

### HTML (index.html)
```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>跳表查找演示</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>跳表查找演示</h1>
        <div class="controls">
            <input type="number" id="searchInput" placeholder="输入要查找的数字">
            <button id="searchBtn">查找</button>
            <button id="resetBtn">重置</button>
        </div>
        <div class="skiplist-container" style="min-height: 600px;">
            <canvas id="skiplistCanvas"></canvas>
        </div>
        <div class="info-panel">
            <p id="searchInfo">请输入要查找的数字</p>
        </div>
    </div>
    <script src="skiplist.js"></script>
</body>
</html>
```

### CSS (styles.css)
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f0f2f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    text-align: center;
    color: #1a73e8;
    margin-bottom: 30px;
}

.controls {
    text-align: center;
    margin-bottom: 20px;
}

input[type="number"] {
    padding: 8px 12px;
    font-size: 16px;
    border: 2px solid #1a73e8;
    border-radius: 4px;
    margin-right: 10px;
}

button {
    padding: 8px 16px;
    font-size: 16px;
    background-color: #1a73e8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 5px;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #1557b0;
}

.skiplist-container {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

canvas {
    width: 100%;
    height: 600px;
}

.info-panel {
    text-align: center;
    padding: 10px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#searchInfo {
    color: #666;
    font-size: 16px;
}
```

### JavaScript (skiplist.js)
```javascript
class SkipListNode {
    constructor(value, level) {
        this.value = value;
        this.next = new Array(level).fill(null);
    }
}

class SkipList {
    constructor(maxLevel = 4) {
        this.maxLevel = maxLevel;
        this.head = new SkipListNode(-Infinity, maxLevel);
        this.level = 0;
    }

    randomLevel() {
        let level = 0;
        while (Math.random() < 0.5 && level < this.maxLevel - 1) {
            level++;
        }
        return level;
    }

    insert(value) {
        const update = new Array(this.maxLevel).fill(this.head);
        let current = this.head;

        for (let i = this.level; i >= 0; i--) {
            while (current.next[i] && current.next[i].value < value) {
                current = current.next[i];
            }
            update[i] = current;
        }

        const level = this.randomLevel();
        if (level > this.level) {
            for (let i = this.level + 1; i <= level; i++) {
                update[i] = this.head;
            }
            this.level = level;
        }

        const newNode = new SkipListNode(value, level + 1);
        for (let i = 0; i <= level; i++) {
            newNode.next[i] = update[i].next[i];
            update[i].next[i] = newNode;
        }
    }
}

class SkipListVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.skipList = new SkipList();
        this.nodeRadius = 20;
        this.levelHeight = 80;
        this.nodeSpacing = 120;
        this.animationSpeed = 500;
        this.searchPath = [];
        this.currentHighlight = null;
        this.isAnimating = false;

        this.initializeCanvas();
        this.initializeSkipList();
        this.setupEventListeners();
    }

    initializeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        
        window.addEventListener('resize', () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.ctx.scale(dpr, dpr);
            this.draw();
        });
    }

    initializeSkipList() {
        const values = [3, 6, 7, 9, 12, 15, 18, 21];
        values.forEach(value => {
            this.skipList.insert(value);
        });
        this.draw();
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('searchBtn');
        const resetBtn = document.getElementById('resetBtn');
        const searchInput = document.getElementById('searchInput');

        searchBtn.addEventListener('click', () => {
            const value = parseInt(searchInput.value);
            if (!isNaN(value)) {
                this.animateSearch(value);
            }
        });

        resetBtn.addEventListener('click', () => {
            this.resetVisualization();
        });
    }

    async animateSearch(target) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.searchPath = [];
        this.currentHighlight = null;
        
        let current = this.skipList.head;
        const searchInfo = document.getElementById('searchInfo');
        
        for (let i = this.skipList.level; i >= 0; i--) {
            while (current.next[i] && current.next[i].value < target) {
                this.searchPath.push({node: current, level: i});
                current = current.next[i];
                this.currentHighlight = {node: current, level: i};
                this.draw();
                searchInfo.textContent = `在第 ${i + 1} 层查找值 ${target}`;
                await this.sleep(this.animationSpeed);
            }
            this.searchPath.push({node: current, level: i});
        }

        const found = current.next[0] && current.next[0].value === target;
        if (found) {
            searchInfo.textContent = `找到目标值 ${target}！`;
            this.currentHighlight = {node: current.next[0], level: 0};
        } else {
            searchInfo.textContent = `未找到目标值 ${target}`;
        }
        
        this.draw();
        this.isAnimating = false;
    }

    resetVisualization() {
        this.searchPath = [];
        this.currentHighlight = null;
        document.getElementById('searchInfo').textContent = '请输入要查找的数字';
        this.draw();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const nodes = this.getAllNodes();
        const startX = (this.canvas.width - (nodes.length - 1) * this.nodeSpacing) / 2;
        const startY = this.canvas.height - this.levelHeight;

        this.drawConnections(nodes, startX, startY);
        this.drawNodes(nodes, startX, startY);
    }

    getAllNodes() {
        const nodes = [this.skipList.head];
        let current = this.skipList.head;
        while (current.next[0]) {
            current = current.next[0];
            nodes.push(current);
        }
        return nodes;
    }

    drawNodes(nodes, startX, startY) {
        nodes.forEach((node, index) => {
            const x = startX + index * this.nodeSpacing;
            let maxLevel = -1;
            let minLevel = Infinity;
            
            for (let level = 0; level <= this.skipList.level; level++) {
                if (level < node.next.length) {
                    maxLevel = Math.max(maxLevel, level);
                    minLevel = Math.min(minLevel, level);
                }
            }
            
            if (maxLevel > minLevel) {
                const topY = startY - maxLevel * this.levelHeight;
                const bottomY = startY - minLevel * this.levelHeight;
                
                this.ctx.beginPath();
                this.ctx.setLineDash([5, 3]);
                this.ctx.strokeStyle = '#666';
                this.ctx.moveTo(x - this.nodeRadius - 5, topY);
                this.ctx.lineTo(x - this.nodeRadius - 5, bottomY);
                this.ctx.moveTo(x + this.nodeRadius + 5, topY);
                this.ctx.lineTo(x + this.nodeRadius + 5, bottomY);
                this.ctx.moveTo(x - this.nodeRadius - 5, topY);
                this.ctx.lineTo(x + this.nodeRadius + 5, topY);
                this.ctx.moveTo(x - this.nodeRadius - 5, bottomY);
                this.ctx.lineTo(x + this.nodeRadius + 5, bottomY);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }

            for (let level = 0; level <= this.skipList.level; level++) {
                if (level < node.next.length) {
                    const y = startY - level * this.levelHeight;
                    const isInPath = this.searchPath.some(p => p.node === node && p.level === level);
                    const isHighlighted = this.currentHighlight && 
                                       this.currentHighlight.node === node && 
                                       this.currentHighlight.level === level;
                    this.drawNode(x, y, node.value, isInPath, isHighlighted);
                }
            }
        });
    }

    drawConnections(nodes, startX, startY) {
        nodes.forEach((node, index) => {
            const x = startX + index * this.nodeSpacing;
            for (let level = 0; level < node.next.length; level++) {
                if (node.next[level]) {
                    const nextIndex = nodes.indexOf(node.next[level]);
                    if (nextIndex !== -1) {
                        const nextX = startX + nextIndex * this.nodeSpacing;
                        const y = startY - level * this.levelHeight;
                        
                        this.ctx.beginPath();
                        this.ctx.moveTo(x + this.nodeRadius, y);
                        this.ctx.lineTo(nextX - this.nodeRadius - 10, y);
                        this.ctx.strokeStyle = '#1a73e8';
                        this.ctx.stroke();

                        const arrowSize = 8;
                        this.ctx.beginPath();
                        this.ctx.moveTo(nextX - this.nodeRadius, y);
                        this.ctx.lineTo(nextX - this.nodeRadius - arrowSize, y - arrowSize);
                        this.ctx.lineTo(nextX - this.nodeRadius - arrowSize, y + arrowSize);
                        this.ctx.fillStyle = '#1a73e8';
                        this.ctx.closePath();
                        this.ctx.fill();
                    }
                }
            }
        });
    }

    drawNode(x, y, value, isInPath, isHighlighted) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.nodeRadius, 0, Math.PI * 2);
        
        if (isHighlighted) {
            this.ctx.fillStyle = '#ff4444';
        } else if (isInPath) {
            this.ctx.fillStyle = '#4CAF50';
        } else {
            this.ctx.fillStyle = '#1a73e8';
        }
        
        this.ctx.fill();
        
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(value === -Infinity ? 'HEAD' : value, x, y);
    }
}

window.addEventListener('load', () => {
    const visualizer = new SkipListVisualizer('skiplistCanvas');
});
```

</details>

## 本地运行

使用 Python 的简单 HTTP 服务器运行：

```bash
python3 -m http.server 8000
```

然后在浏览器中访问 `http://localhost:8000`

## 注意事项

- 如果你在 GitHub 上查看此演示，可能需要克隆仓库到本地运行
- 某些 Markdown 查看器可能不支持直接显示交互式内容
- 建议使用现代浏览器（Chrome、Firefox、Safari 等）运行此演示
