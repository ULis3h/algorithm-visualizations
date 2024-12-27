class SmallWorldNetwork {
    constructor(nodeCount, kNeighbors, rewireProb) {
        this.nodeCount = nodeCount;
        this.kNeighbors = kNeighbors;
        this.rewireProb = rewireProb;
        this.adjacencyList = new Array(nodeCount).fill(null).map(() => new Set());
        this.nodePositions = [];
        this.generatePositions();
        this.generateNetwork();
    }

    generatePositions() {
        const radius = 200;
        const centerX = 300;
        const centerY = 300;
        
        for (let i = 0; i < this.nodeCount; i++) {
            const angle = (2 * Math.PI * i) / this.nodeCount;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            this.nodePositions.push({x, y});
        }
    }

    generateNetwork() {
        // 首先创建规则环形网络
        for (let i = 0; i < this.nodeCount; i++) {
            for (let j = 1; j <= this.kNeighbors / 2; j++) {
                const neighbor = (i + j) % this.nodeCount;
                this.adjacencyList[i].add(neighbor);
                this.adjacencyList[neighbor].add(i);
            }
        }

        // 根据重连概率重新连接边
        for (let i = 0; i < this.nodeCount; i++) {
            const neighbors = [...this.adjacencyList[i]];
            for (const neighbor of neighbors) {
                if (Math.random() < this.rewireProb && neighbor > i) {
                    // 移除原有连接
                    this.adjacencyList[i].delete(neighbor);
                    this.adjacencyList[neighbor].delete(i);

                    // 随机选择新的邻居
                    let newNeighbor;
                    do {
                        newNeighbor = Math.floor(Math.random() * this.nodeCount);
                    } while (newNeighbor === i || this.adjacencyList[i].has(newNeighbor));

                    // 添加新连接
                    this.adjacencyList[i].add(newNeighbor);
                    this.adjacencyList[newNeighbor].add(i);
                }
            }
        }
    }

    calculateAveragePathLength() {
        let totalPath = 0;
        let pathCount = 0;

        for (let i = 0; i < this.nodeCount; i++) {
            const distances = this.breadthFirstSearch(i);
            for (let j = i + 1; j < this.nodeCount; j++) {
                if (distances[j] !== Infinity) {
                    totalPath += distances[j];
                    pathCount++;
                }
            }
        }

        return pathCount > 0 ? (totalPath / pathCount).toFixed(2) : 'N/A';
    }

    breadthFirstSearch(start) {
        const distances = new Array(this.nodeCount).fill(Infinity);
        distances[start] = 0;
        
        const queue = [start];
        while (queue.length > 0) {
            const current = queue.shift();
            for (const neighbor of this.adjacencyList[current]) {
                if (distances[neighbor] === Infinity) {
                    distances[neighbor] = distances[current] + 1;
                    queue.push(neighbor);
                }
            }
        }
        
        return distances;
    }

    calculateClusteringCoefficient() {
        let totalCoefficient = 0;

        for (let i = 0; i < this.nodeCount; i++) {
            const neighbors = [...this.adjacencyList[i]];
            if (neighbors.length < 2) continue;

            let connections = 0;
            for (let j = 0; j < neighbors.length; j++) {
                for (let k = j + 1; k < neighbors.length; k++) {
                    if (this.adjacencyList[neighbors[j]].has(neighbors[k])) {
                        connections++;
                    }
                }
            }

            const possibleConnections = (neighbors.length * (neighbors.length - 1)) / 2;
            totalCoefficient += connections / possibleConnections;
        }

        return (totalCoefficient / this.nodeCount).toFixed(3);
    }
}

class NetworkVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.network = null;
        this.nodeRadius = 6;
        this.selectedNode = null;
        this.hoveredNode = null;

        this.initializeCanvas();
        this.setupEventListeners();
    }

    initializeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        window.addEventListener('resize', () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            if (this.network) this.draw();
        });
    }

    setupEventListeners() {
        const nodeCount = document.getElementById('nodeCount');
        const rewireProb = document.getElementById('rewireProb');
        const kNeighbors = document.getElementById('kNeighbors');
        const generateBtn = document.getElementById('generateBtn');
        const calculateBtn = document.getElementById('calculateBtn');

        rewireProb.addEventListener('input', () => {
            document.getElementById('rewireProbValue').textContent = 
                (rewireProb.value / 100).toFixed(2);
        });

        generateBtn.addEventListener('click', () => {
            this.network = new SmallWorldNetwork(
                parseInt(nodeCount.value),
                parseInt(kNeighbors.value),
                rewireProb.value / 100
            );
            this.draw();
        });

        calculateBtn.addEventListener('click', () => {
            if (!this.network) return;
            
            document.getElementById('avgPathLength').textContent = 
                this.network.calculateAveragePathLength();
            document.getElementById('clusteringCoeff').textContent = 
                this.network.calculateClusteringCoefficient();
        });

        // 鼠标交互
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.hoveredNode = this.findNodeAtPosition(x, y);
            this.draw();
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.selectedNode = this.findNodeAtPosition(x, y);
            this.draw();
        });
    }

    findNodeAtPosition(x, y) {
        if (!this.network) return null;

        for (let i = 0; i < this.network.nodeCount; i++) {
            const node = this.network.nodePositions[i];
            const dx = x - node.x;
            const dy = y - node.y;
            if (dx * dx + dy * dy <= this.nodeRadius * this.nodeRadius) {
                return i;
            }
        }
        return null;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.network) return;

        // 绘制边
        this.ctx.strokeStyle = '#1a73e8';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.network.nodeCount; i++) {
            const neighbors = this.network.adjacencyList[i];
            for (const neighbor of neighbors) {
                if (neighbor > i) {  // 避免重复绘制
                    this.ctx.beginPath();
                    this.ctx.moveTo(
                        this.network.nodePositions[i].x,
                        this.network.nodePositions[i].y
                    );
                    this.ctx.lineTo(
                        this.network.nodePositions[neighbor].x,
                        this.network.nodePositions[neighbor].y
                    );
                    this.ctx.stroke();
                }
            }
        }

        // 绘制节点
        for (let i = 0; i < this.network.nodeCount; i++) {
            const {x, y} = this.network.nodePositions[i];
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.nodeRadius, 0, Math.PI * 2);
            
            if (i === this.selectedNode) {
                this.ctx.fillStyle = '#ff4444';
            } else if (i === this.hoveredNode) {
                this.ctx.fillStyle = '#4CAF50';
            } else {
                this.ctx.fillStyle = '#1a73e8';
            }
            
            this.ctx.fill();
        }

        // 如果有选中的节点，高亮其邻居
        if (this.selectedNode !== null) {
            const neighbors = this.network.adjacencyList[this.selectedNode];
            for (const neighbor of neighbors) {
                const {x, y} = this.network.nodePositions[neighbor];
                this.ctx.beginPath();
                this.ctx.arc(x, y, this.nodeRadius + 2, 0, Math.PI * 2);
                this.ctx.strokeStyle = '#ff4444';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
    }
}

// 页面加载完成后初始化可视化器
window.addEventListener('load', () => {
    const visualizer = new NetworkVisualizer('networkCanvas');
    // 生成初始网络
    document.getElementById('generateBtn').click();
});
