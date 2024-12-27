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
        this.levelHeight = 60;
        this.nodeSpacing = 100;
        this.animationSpeed = 500;
        this.searchPath = [];
        this.currentHighlight = null;
        this.isAnimating = false;

        this.initializeCanvas();
        this.initializeSkipList();
        this.setupEventListeners();
    }

    initializeCanvas() {
        // 设置 canvas 的实际像素大小
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        // 设置显示大小
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // 设置实际大小
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        // 缩放上下文以适应 DPR
        this.ctx.scale(dpr, dpr);
        
        // 添加 resize 事件监听
        window.addEventListener('resize', () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.ctx.scale(dpr, dpr);
            this.draw();
        });
    }

    initializeSkipList() {
        // 插入一些初始数据，确保有跨越多层的节点
        const values = [3, 6, 7, 9, 12, 15, 18, 21];
        values.forEach(value => {
            this.skipList.insert(value);
        });
        
        // 调整布局参数
        this.nodeRadius = 20;
        this.levelHeight = 80; // 增加层级之间的距离
        this.nodeSpacing = 120; // 增加节点之间的距离
        
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
        
        // 计算起始 x 坐标，使绘制居中
        const nodes = this.getAllNodes();
        const startX = (this.canvas.width - (nodes.length - 1) * this.nodeSpacing) / 2;
        const startY = this.canvas.height - this.levelHeight;

        // 绘制连接线
        this.drawConnections(nodes, startX, startY);

        // 绘制节点
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
            
            // 首先找出节点的最高和最低层级
            for (let level = 0; level <= this.skipList.level; level++) {
                if (level < node.next.length) {
                    maxLevel = Math.max(maxLevel, level);
                    minLevel = Math.min(minLevel, level);
                }
            }
            
            // 如果节点跨越多个层级，绘制连接框
            if (maxLevel > minLevel) {
                const topY = startY - maxLevel * this.levelHeight;
                const bottomY = startY - minLevel * this.levelHeight;
                
                // 绘制竖直连接线
                this.ctx.beginPath();
                this.ctx.setLineDash([5, 3]); // 虚线效果
                this.ctx.strokeStyle = '#666';
                this.ctx.moveTo(x - this.nodeRadius - 5, topY);
                this.ctx.lineTo(x - this.nodeRadius - 5, bottomY);
                this.ctx.moveTo(x + this.nodeRadius + 5, topY);
                this.ctx.lineTo(x + this.nodeRadius + 5, bottomY);
                // 绘制水平连接线
                this.ctx.moveTo(x - this.nodeRadius - 5, topY);
                this.ctx.lineTo(x + this.nodeRadius + 5, topY);
                this.ctx.moveTo(x - this.nodeRadius - 5, bottomY);
                this.ctx.lineTo(x + this.nodeRadius + 5, bottomY);
                this.ctx.stroke();
                this.ctx.setLineDash([]); // 恢复实线
            }

            // 绘制节点
            for (let level = 0; level <= this.skipList.level; level++) {
                if (level < node.next.length) {
                    const y = startY - level * this.levelHeight;
                    
                    // 检查是否在搜索路径中
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
                        
                        // 绘制连接线
                        this.ctx.beginPath();
                        this.ctx.moveTo(x + this.nodeRadius, y);
                        this.ctx.lineTo(nextX - this.nodeRadius - 10, y);
                        this.ctx.strokeStyle = '#1a73e8';
                        this.ctx.stroke();

                        // 绘制箭头
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

// 页面加载完成后初始化可视化器
window.addEventListener('load', () => {
    const visualizer = new SkipListVisualizer('skiplistCanvas');
});
