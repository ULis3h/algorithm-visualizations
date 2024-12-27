class Point {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.neighbors = new Map(); // 每层的邻居列表
    }

    distanceTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

class HNSW {
    constructor(maxLevel, neighborsSize) {
        this.maxLevel = maxLevel;
        this.neighborsSize = neighborsSize;
        this.layers = new Array(maxLevel).fill(null).map(() => new Set());
        this.points = new Map(); // id -> Point
        this.entryPoint = null;
    }

    // 生成随机层级
    generateRandomLevel() {
        let level = 0;
        while (Math.random() < 0.5 && level < this.maxLevel - 1) {
            level++;
        }
        return level;
    }

    // 在指定层级搜索最近邻
    searchLayer(query, entryPoint, level, ef) {
        const visited = new Set([entryPoint.id]);
        const candidates = new Map([[entryPoint.id, entryPoint.distanceTo(query)]]);
        const results = new Map([[entryPoint.id, entryPoint.distanceTo(query)]]);

        while (candidates.size > 0) {
            // 找到当前最近的候选点
            const [currentId, currentDist] = [...candidates.entries()].reduce(
                (min, curr) => curr[1] < min[1] ? curr : min
            );
            const current = this.points.get(currentId);
            
            // 如果最近的候选点比结果集中最远的点还远，则停止搜索
            const furthestResult = [...results.entries()].reduce(
                (max, curr) => curr[1] > max[1] ? curr : max
            );
            if (currentDist > furthestResult[1]) break;

            // 移除当前候选点
            candidates.delete(currentId);

            // 检查当前点在该层的所有邻居
            const neighbors = current.neighbors.get(level) || [];
            for (const neighborId of neighbors) {
                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    const neighbor = this.points.get(neighborId);
                    const distance = neighbor.distanceTo(query);

                    // 更新候选集和结果集
                    if (candidates.size < ef) {
                        candidates.set(neighborId, distance);
                    } else {
                        const furthestCandidate = [...candidates.entries()].reduce(
                            (max, curr) => curr[1] > max[1] ? curr : max
                        );
                        if (distance < furthestCandidate[1]) {
                            candidates.delete(furthestCandidate[0]);
                            candidates.set(neighborId, distance);
                        }
                    }

                    if (results.size < ef) {
                        results.set(neighborId, distance);
                    } else {
                        const furthestResult = [...results.entries()].reduce(
                            (max, curr) => curr[1] > max[1] ? curr : max
                        );
                        if (distance < furthestResult[1]) {
                            results.delete(furthestResult[0]);
                            results.set(neighborId, distance);
                        }
                    }
                }
            }
        }

        return [...results.entries()]
            .sort((a, b) => a[1] - b[1])
            .slice(0, this.neighborsSize)
            .map(([id]) => this.points.get(id));
    }

    // 插入新点
    insert(point) {
        if (this.points.has(point.id)) return;
        
        this.points.set(point.id, point);
        const level = this.generateRandomLevel();

        // 如果是第一个点
        if (!this.entryPoint) {
            this.entryPoint = point;
            for (let l = 0; l <= level; l++) {
                this.layers[l].add(point.id);
                point.neighbors.set(l, new Set());
            }
            return;
        }

        let currentPoint = this.entryPoint;
        
        // 从最高层开始向下搜索
        for (let l = this.maxLevel - 1; l > level; l--) {
            if (this.layers[l].size > 0) {
                const neighbors = this.searchLayer(point, currentPoint, l, 1);
                if (neighbors.length > 0) {
                    currentPoint = neighbors[0];
                }
            }
        }

        // 在每一层建立连接
        for (let l = Math.min(level, this.maxLevel - 1); l >= 0; l--) {
            const neighbors = this.searchLayer(point, currentPoint, l, this.neighborsSize);
            this.layers[l].add(point.id);
            point.neighbors.set(l, new Set(neighbors.map(n => n.id)));

            // 为邻居添加反向连接
            for (const neighbor of neighbors) {
                if (!neighbor.neighbors.has(l)) {
                    neighbor.neighbors.set(l, new Set());
                }
                neighbor.neighbors.get(l).add(point.id);

                // 如果邻居的连接数超过限制，删除最远的连接
                if (neighbor.neighbors.get(l).size > this.neighborsSize) {
                    const distances = [...neighbor.neighbors.get(l)]
                        .map(id => ({
                            id,
                            distance: neighbor.distanceTo(this.points.get(id))
                        }))
                        .sort((a, b) => a.distance - b.distance);
                    
                    neighbor.neighbors.set(l, new Set(
                        distances
                            .slice(0, this.neighborsSize)
                            .map(d => d.id)
                    ));
                }
            }

            currentPoint = neighbors[0];
        }

        // 更新入口点
        if (level > this.getMaxLevelInGraph()) {
            this.entryPoint = point;
        }
    }

    // 搜索最近邻
    search(query, ef = this.neighborsSize) {
        if (!this.entryPoint) return [];

        let currentPoint = this.entryPoint;
        let currentLevel = this.getMaxLevelInGraph();

        // 从最高层开始向下搜索
        for (let level = currentLevel; level > 0; level--) {
            const neighbors = this.searchLayer(query, currentPoint, level, 1);
            if (neighbors.length > 0) {
                currentPoint = neighbors[0];
            }
        }

        // 在最底层进行更详细的搜索
        return this.searchLayer(query, currentPoint, 0, ef);
    }

    // 获取图中的最高层级
    getMaxLevelInGraph() {
        for (let i = this.maxLevel - 1; i >= 0; i--) {
            if (this.layers[i].size > 0) return i;
        }
        return 0;
    }
}

// 可视化类
class HNSWVisualizer {
    constructor() {
        this.hnsw = null;
        this.layers = [];
        this.currentSearchState = null;
        this.setupUI();
    }

    setupUI() {
        // 获取控制元素
        this.pointCountInput = document.getElementById('pointCount');
        this.maxLevelInput = document.getElementById('maxLevel');
        this.neighborsSizeInput = document.getElementById('neighborsSize');
        this.searchPointXInput = document.getElementById('searchPointX');
        this.searchPointYInput = document.getElementById('searchPointY');
        
        // 获取按钮元素
        this.generateBtn = document.getElementById('generateBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.stepBtn = document.getElementById('stepBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // 设置事件监听器
        this.generateBtn.addEventListener('click', () => this.generateData());
        this.searchBtn.addEventListener('click', () => this.startSearch());
        this.stepBtn.addEventListener('click', () => this.stepSearch());
        this.resetBtn.addEventListener('click', () => this.resetSearch());

        // 创建图层
        this.createLayers();
    }

    createLayers() {
        const container = document.querySelector('.layers-container');
        container.innerHTML = '';
        
        const maxLevel = parseInt(this.maxLevelInput.value);
        this.layers = [];

        for (let i = maxLevel - 1; i >= 0; i--) {
            const layerDiv = document.createElement('div');
            layerDiv.className = 'layer';
            
            const label = document.createElement('div');
            label.className = 'layer-label';
            label.textContent = `Layer ${i}`;
            
            const canvas = document.createElement('canvas');
            
            layerDiv.appendChild(label);
            layerDiv.appendChild(canvas);
            container.appendChild(layerDiv);
            
            const ctx = canvas.getContext('2d');
            this.layers.push({
                canvas,
                ctx,
                level: i
            });
        }

        // 设置画布尺寸
        this.resizeCanvases();
        window.addEventListener('resize', () => this.resizeCanvases());
    }

    resizeCanvases() {
        this.layers.forEach(layer => {
            const rect = layer.canvas.getBoundingClientRect();
            layer.canvas.width = rect.width;
            layer.canvas.height = rect.height;
        });
        this.draw();
    }

    generateData() {
        const pointCount = parseInt(this.pointCountInput.value);
        const maxLevel = parseInt(this.maxLevelInput.value);
        const neighborsSize = parseInt(this.neighborsSizeInput.value);

        // 创建新的 HNSW 实例
        this.hnsw = new HNSW(maxLevel, neighborsSize);

        // 生成随机点
        for (let i = 0; i < pointCount; i++) {
            const point = new Point(
                Math.random(),
                Math.random(),
                i.toString()
            );
            this.hnsw.insert(point);
        }

        // 重新创建图层并绘制
        this.createLayers();
        this.draw();
    }

    startSearch() {
        const x = parseFloat(this.searchPointXInput.value);
        const y = parseFloat(this.searchPointYInput.value);
        
        if (isNaN(x) || isNaN(y) || x < 0 || x > 1 || y < 0 || y > 1) {
            alert('请输入有效的搜索点坐标（0-1之间）');
            return;
        }

        const query = new Point(x, y, 'query');
        const startTime = performance.now();
        const results = this.hnsw.search(query);
        const endTime = performance.now();

        // 更新搜索状态
        this.currentSearchState = {
            query,
            results,
            visitedNodes: new Set(),
            currentLevel: this.hnsw.getMaxLevelInGraph(),
            searchTime: endTime - startTime
        };

        // 更新界面
        this.updateInfoPanel();
        this.draw();
    }

    stepSearch() {
        if (!this.currentSearchState) return;

        // TODO: 实现单步执行逻辑
        this.draw();
    }

    resetSearch() {
        this.currentSearchState = null;
        this.updateInfoPanel();
        this.draw();
    }

    updateInfoPanel() {
        const currentLevel = document.getElementById('currentLevel');
        const visitedCount = document.getElementById('visitedCount');
        const searchTime = document.getElementById('searchTime');

        if (this.currentSearchState) {
            currentLevel.textContent = this.currentSearchState.currentLevel;
            visitedCount.textContent = this.currentSearchState.visitedNodes.size;
            searchTime.textContent = `${this.currentSearchState.searchTime.toFixed(2)}ms`;
        } else {
            currentLevel.textContent = '-';
            visitedCount.textContent = '-';
            searchTime.textContent = '-';
        }
    }

    draw() {
        if (!this.hnsw) return;

        this.layers.forEach(layer => {
            const { canvas, ctx, level } = layer;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 绘制边
            ctx.strokeStyle = '#1a73e8';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;

            this.hnsw.layers[level].forEach(pointId => {
                const point = this.hnsw.points.get(pointId);
                const neighbors = point.neighbors.get(level) || new Set();

                neighbors.forEach(neighborId => {
                    const neighbor = this.hnsw.points.get(neighborId);
                    ctx.beginPath();
                    ctx.moveTo(
                        point.x * canvas.width,
                        point.y * canvas.height
                    );
                    ctx.lineTo(
                        neighbor.x * canvas.width,
                        neighbor.y * canvas.height
                    );
                    ctx.stroke();
                });
            });

            // 绘制节点
            ctx.globalAlpha = 1;
            this.hnsw.layers[level].forEach(pointId => {
                const point = this.hnsw.points.get(pointId);
                ctx.beginPath();
                ctx.arc(
                    point.x * canvas.width,
                    point.y * canvas.height,
                    4,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = '#1a73e8';
                ctx.fill();
            });

            // 绘制搜索状态
            if (this.currentSearchState) {
                // 绘制查询点
                const query = this.currentSearchState.query;
                ctx.beginPath();
                ctx.arc(
                    query.x * canvas.width,
                    query.y * canvas.height,
                    6,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = '#ff4444';
                ctx.fill();

                // 绘制结果
                if (level === 0) {
                    this.currentSearchState.results.forEach(point => {
                        ctx.beginPath();
                        ctx.arc(
                            point.x * canvas.width,
                            point.y * canvas.height,
                            8,
                            0,
                            Math.PI * 2
                        );
                        ctx.strokeStyle = '#4CAF50';
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    });
                }
            }
        });
    }
}

// 页面加载完成后初始化可视化器
window.addEventListener('load', () => {
    const visualizer = new HNSWVisualizer();
    visualizer.generateData();
});
