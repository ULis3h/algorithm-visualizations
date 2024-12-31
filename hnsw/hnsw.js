class Point {
    constructor(id, vector) {
        this.id = id;
        this.vector = vector;
        this.neighbors = new Map(); // Map<level, Set<pointId>>
        this.maxLevel = 0;
    }

    distance(other) {
        return Math.sqrt(
            this.vector.reduce((sum, val, i) => 
                sum + Math.pow(val - other.vector[i], 2), 0)
        );
    }
}

class HNSW {
    constructor(dimension, M = 5, efConstruction = 100, mL = 1/Math.log(M)) {
        this.dimension = dimension;
        this.M = M;  // 最大邻居数
        this.M0 = M * 2;  // 底层最大邻居数
        this.efConstruction = efConstruction;  // 构建时的搜索范围
        this.mL = mL;  // 层级概率因子
        this.maxLevel = 0;
        this.entryPoint = null;
        this.points = new Map();  // Map<id, Point>
    }

    randomLevel() {
        let level = 0;
        while (Math.random() < this.mL && level < 32) {
            level++;
        }
        return level;
    }

    insert(id, vector) {
        const point = new Point(id, vector);
        const level = this.randomLevel();
        point.maxLevel = level;
        this.points.set(id, point);

        // 如果是第一个点
        if (!this.entryPoint) {
            this.entryPoint = point;
            this.maxLevel = level;
            return;
        }

        // 从最高层开始搜索
        let currentNode = this.entryPoint;
        let currentMaxLevel = this.maxLevel;

        // 对每一层进行搜索和连接
        for (let lc = Math.min(currentMaxLevel, level); lc >= 0; lc--) {
            // 在当前层找到最近的ef个邻居
            let neighbors = this.searchLayer(currentNode, point, lc, 1);
            
            // 选择并连接邻居
            this.connectNewPoint(point, neighbors[0], lc);
            currentNode = neighbors[0];
        }

        // 更新最高层
        if (level > this.maxLevel) {
            this.maxLevel = level;
            this.entryPoint = point;
        }
    }

    searchLayer(entryPoint, queryPoint, level, ef) {
        let visited = new Set([entryPoint.id]);
        let candidates = new Map([[entryPoint.id, entryPoint.distance(queryPoint)]]);
        let best = new Map([[entryPoint.id, entryPoint.distance(queryPoint)]]);

        while (candidates.size > 0) {
            // 获取最近的候选点
            const [currentId, currentDist] = Array.from(candidates.entries())
                .reduce((a, b) => a[1] < b[1] ? a : b);
            candidates.delete(currentId);

            // 如果当前最远的近邻比候选点更近，就停止搜索
            const furthestBest = Array.from(best.values()).reduce((a, b) => Math.max(a, b), 0);
            if (currentDist > furthestBest) break;

            // 检查当前点的邻居
            const currentPoint = this.points.get(currentId);
            if (!currentPoint.neighbors.has(level)) continue;

            for (const neighborId of currentPoint.neighbors.get(level)) {
                if (visited.has(neighborId)) continue;
                visited.add(neighborId);

                const neighborPoint = this.points.get(neighborId);
                const distance = neighborPoint.distance(queryPoint);

                if (best.size < ef || distance < Array.from(best.values()).reduce((a, b) => Math.max(a, b), 0)) {
                    candidates.set(neighborId, distance);
                    best.set(neighborId, distance);

                    if (best.size > ef) {
                        // 移除最远的点
                        const furthestId = Array.from(best.entries())
                            .reduce((a, b) => a[1] > b[1] ? a : b)[0];
                        best.delete(furthestId);
                    }
                }
            }
        }

        return Array.from(best.keys()).map(id => this.points.get(id));
    }

    connectNewPoint(point, neighbor, level) {
        // 初始化当前层的邻居集合
        if (!point.neighbors.has(level)) {
            point.neighbors.set(level, new Set());
        }
        if (!neighbor.neighbors.has(level)) {
            neighbor.neighbors.set(level, new Set());
        }

        // 双向连接
        point.neighbors.get(level).add(neighbor.id);
        neighbor.neighbors.get(level).add(point.id);

        // 如果超过最大邻居数，需要裁剪
        const maxM = level === 0 ? this.M0 : this.M;
        if (point.neighbors.get(level).size > maxM) {
            this.pruneConnections(point, level, maxM);
        }
        if (neighbor.neighbors.get(level).size > maxM) {
            this.pruneConnections(neighbor, level, maxM);
        }
    }

    pruneConnections(point, level, maxM) {
        const neighbors = Array.from(point.neighbors.get(level))
            .map(id => this.points.get(id))
            .sort((a, b) => a.distance(point) - b.distance(point))
            .slice(0, maxM);

        point.neighbors.set(level, new Set(neighbors.map(n => n.id)));
    }

    search(queryVector, k = 1) {
        const queryPoint = new Point(-1, queryVector);
        let currentNode = this.entryPoint;
        let currentDist = currentNode.distance(queryPoint);
        let currentMaxLevel = this.maxLevel;

        // 从最高层开始向下搜索
        for (let level = currentMaxLevel; level >= 0; level--) {
            let changed = true;
            while (changed) {
                changed = false;
                // 检查当前节点在该层的所有邻居
                if (currentNode.neighbors.has(level)) {
                    for (const neighborId of currentNode.neighbors.get(level)) {
                        const neighbor = this.points.get(neighborId);
                        const distance = neighbor.distance(queryPoint);
                        if (distance < currentDist) {
                            currentDist = distance;
                            currentNode = neighbor;
                            changed = true;
                        }
                    }
                }
            }
        }

        // 在底层进行精确搜索
        const neighbors = this.searchLayer(currentNode, queryPoint, 0, k);
        return neighbors.map(n => ({
            id: n.id,
            distance: n.distance(queryPoint)
        }));
    }

    generateRandomVector() {
        return Array(this.dimension).fill(0)
            .map(() => Math.random() * 2 - 1);
    }

    generateRandomPoints(count) {
        for (let i = 0; i < count; i++) {
            const vector = this.generateRandomVector();
            this.insert(i, vector);
        }
    }
}
