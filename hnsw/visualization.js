class HNSWVisualization {
    constructor(hnsw) {
        this.hnsw = hnsw;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.nodeObjects = new Map();
        this.searchState = {
            steps: 0,
            visited: new Set(),
            currentLayer: -1,
            path: []  // 存储搜索路径
        };

        // 层级配置
        this.layerConfig = {
            spacing: 5,  // 层间距
            size: {     // 每层的大小
                width: 30,
                depth: 30
            },
            height: {   // 每层的高度
                2: 10,  // 顶层
                1: 5,   // 中间层
                0: 0    // 底层
            }
        };

        this.init();
        this.setupEventListeners();
    }

    init() {
        const container = document.getElementById('graph-container');
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);
        this.resizeRenderer();

        // 设置相机位置以获得类似参考图的视角
        this.camera.position.set(25, 15, 25);
        this.camera.lookAt(0, 5, 0);

        // 设置控制器
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // 添加光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(ambientLight, directionalLight);

        // 添加层平面
        this.addLayerPlanes();

        this.animate();
    }

    addLayerPlanes() {
        const { width, depth } = this.layerConfig.size;
        const geometry = new THREE.PlaneGeometry(width, depth);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.1
        });

        Object.entries(this.layerConfig.height).forEach(([level, height]) => {
            const plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = -Math.PI / 2;
            plane.position.y = height;
            this.scene.add(plane);
        });
    }

    createNode(position, type = 'normal') {
        // 使用圆形平面而不是圆柱体
        const geometry = new THREE.CircleGeometry(0.4, 32);
        let material;

        switch(type) {
            case 'entry':
                material = new THREE.MeshBasicMaterial({ 
                    color: 0x0066ff,
                    side: THREE.DoubleSide
                });
                break;
            case 'query':
                material = new THREE.MeshBasicMaterial({ 
                    color: 0xffff00,
                    side: THREE.DoubleSide
                });
                break;
            case 'visited':
                material = new THREE.MeshBasicMaterial({ 
                    color: 0x666666,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                });
                break;
            default:
                material = new THREE.MeshBasicMaterial({ 
                    color: 0xcccccc,
                    side: THREE.DoubleSide
                });
        }

        const node = new THREE.Mesh(geometry, material);
        // 旋转90度使圆面平行于水平面
        node.rotation.x = -Math.PI / 2;
        
        // 稍微抬高一点点，避免与平面重叠
        position.y += 0.01;
        node.position.copy(position);
        
        return node;
    }

    createFlatArrow(from, to) {
        // 确保在同一平面上
        const y = from.y;
        const nodeRadius = 0.4; // 与createNode中的圆形半径保持一致
        
        // 创建2D起点和终点
        const start = new THREE.Vector2(from.x, from.z);
        const end = new THREE.Vector2(to.x, to.z);

        // 计算2D方向和长度
        const direction = end.clone().sub(start).normalize();
        const fullLength = end.clone().sub(start).length();
        
        // 调整起点和终点，使箭头从圆的边缘开始和结束
        const adjustedStart = start.clone().add(direction.clone().multiplyScalar(nodeRadius));
        const adjustedEnd = end.clone().sub(direction.clone().multiplyScalar(nodeRadius));
        const length = adjustedEnd.clone().sub(adjustedStart).length();

        // 箭头参数
        const headLength = Math.min(length * 0.3, 0.5);  // 箭头头部长度，但不超过0.5
        const headWidth = 0.3;  // 箭头头部宽度
        const shaftWidth = 0.1; // 箭身宽度

        // 计算垂直于方向的向量（在2D平面上）
        const normal = new THREE.Vector2(-direction.y, direction.x);

        // 创建箭头的点（在2D平面上）
        const points = [
            // 箭身起点左侧
            adjustedStart.clone().add(normal.clone().multiplyScalar(shaftWidth/2)),
            // 箭身终点左侧
            adjustedEnd.clone().sub(direction.clone().multiplyScalar(headLength)).add(normal.clone().multiplyScalar(shaftWidth/2)),
            // 箭头左侧
            adjustedEnd.clone().sub(direction.clone().multiplyScalar(headLength)).add(normal.clone().multiplyScalar(headWidth)),
            // 箭头顶点
            adjustedEnd.clone(),
            // 箭头右侧
            adjustedEnd.clone().sub(direction.clone().multiplyScalar(headLength)).add(normal.clone().multiplyScalar(-headWidth)),
            // 箭身终点右侧
            adjustedEnd.clone().sub(direction.clone().multiplyScalar(headLength)).add(normal.clone().multiplyScalar(-shaftWidth/2)),
            // 箭身起点右侧
            adjustedStart.clone().add(normal.clone().multiplyScalar(-shaftWidth/2))
        ];

        // 如果长度太短，就不创建箭头
        if (length < headLength * 2) {
            return null;
        }

        // 创建形状
        const shape = new THREE.Shape();
        shape.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            shape.lineTo(points[i].x, points[i].y);
        }
        shape.lineTo(points[0].x, points[0].y);

        // 创建几何体
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x0066ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });

        // 创建网格
        const arrow = new THREE.Mesh(geometry, material);
        
        // 设置箭头位置和旋转
        arrow.position.y = y + 0.01; // 稍微抬高以避免z-fighting
        arrow.rotation.x = -Math.PI / 2; // 使箭头平行于地面

        return arrow;
    }

    createEdge(from, to, isSearchPath = false) {
        if (isSearchPath) {
            // 为搜索路径创建扁平箭头
            const arrow = this.createFlatArrow(from.position, to.position);
            // 如果节点太近，arrow可能为null
            return arrow || new THREE.Object3D(); // 如果没有箭头，返回空对象
        } else {
            // 普通连接使用直线
            const points = [from.position, to.position];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: 0x999999,
                opacity: 0.5,
                transparent: true
            });
            return new THREE.Line(geometry, material);
        }
    }

    createVerticalConnection(from, to) {
        const points = [from.position, to.position];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineDashedMaterial({
            color: 0x999999,
            dashSize: 0.5,
            gapSize: 0.3,
            opacity: 0.5,
            transparent: true
        });

        const line = new THREE.Line(geometry, material);
        line.computeLineDistances();
        return line;
    }

    updateVisualization(searchPath = []) {
        // 清除现有场景
        while(this.scene.children.length > 0) { 
            this.scene.remove(this.scene.children[0]); 
        }
        this.nodeObjects.clear();

        // 重新添加基础元素
        this.init();

        // 创建节点
        const nodes = [
            // 顶层
            { id: 'entry', x: 5, y: this.layerConfig.height[2], z: 0, type: 'entry', layer: 2 },
            { id: 'top1', x: -5, y: this.layerConfig.height[2], z: 0, type: 'visited', layer: 2 },
            
            // 中间层
            { id: 'mid1', x: -8, y: this.layerConfig.height[1], z: -5, type: 'visited', layer: 1 },
            { id: 'mid2', x: -3, y: this.layerConfig.height[1], z: 0, type: 'visited', layer: 1 },
            { id: 'mid3', x: 3, y: this.layerConfig.height[1], z: 2, type: 'normal', layer: 1 },
            { id: 'mid4', x: 8, y: this.layerConfig.height[1], z: -3, type: 'normal', layer: 1 },
            
            // 底层
            { id: 'bottom1', x: -10, y: this.layerConfig.height[0], z: -5, type: 'normal', layer: 0 },
            { id: 'bottom2', x: -5, y: this.layerConfig.height[0], z: 0, type: 'normal', layer: 0 },
            { id: 'bottom3', x: 0, y: this.layerConfig.height[0], z: 3, type: 'visited', layer: 0 },
            { id: 'bottom4', x: 5, y: this.layerConfig.height[0], z: -2, type: 'normal', layer: 0 },
            { id: 'bottom5', x: 10, y: this.layerConfig.height[0], z: 1, type: 'normal', layer: 0 },
            
            // 查询点
            { id: 'query', x: -2, y: this.layerConfig.height[0], z: -4, type: 'query', layer: 0 }
        ];

        // 创建所有节点
        nodes.forEach(node => {
            const position = new THREE.Vector3(node.x, node.y, node.z);
            const mesh = this.createNode(position, node.type);
            this.scene.add(mesh);
            this.nodeObjects.set(node.id, mesh);
        });

        // 创建层内连接
        const layerConnections = [
            // 顶层连接
            ['entry', 'top1'],
            
            // 中间层连接
            ['mid1', 'mid2'],
            ['mid2', 'mid3'],
            ['mid3', 'mid4'],
            
            // 底层连接
            ['bottom1', 'bottom2'],
            ['bottom2', 'bottom3'],
            ['bottom3', 'bottom4'],
            ['bottom4', 'bottom5']
        ];

        layerConnections.forEach(([from, to]) => {
            const fromNode = this.nodeObjects.get(from);
            const toNode = this.nodeObjects.get(to);
            const edge = this.createEdge(fromNode, toNode);
            this.scene.add(edge);
        });

        // 创建垂直连接
        const verticalConnections = [
            ['entry', 'mid3'],
            ['top1', 'mid1'],
            ['mid1', 'bottom1'],
            ['mid2', 'bottom2'],
            ['mid3', 'bottom3'],
            ['mid4', 'bottom4']
        ];

        verticalConnections.forEach(([from, to]) => {
            const fromNode = this.nodeObjects.get(from);
            const toNode = this.nodeObjects.get(to);
            const connection = this.createVerticalConnection(fromNode, toNode);
            this.scene.add(connection);
        });

        // 创建搜索路径
        if (searchPath.length > 0) {
            for (let i = 0; i < searchPath.length; i++) {
                const [fromId, toId] = searchPath[i];
                const fromNode = nodes.find(n => n.id === fromId);
                const toNode = nodes.find(n => n.id === toId);
                
                if (fromNode && toNode) {
                    const fromMesh = this.nodeObjects.get(fromId);
                    const toMesh = this.nodeObjects.get(toId);
                    
                    if (fromNode.layer === toNode.layer) {
                        // 同层移动，使用水平箭头
                        const pathEdge = this.createEdge(fromMesh, toMesh, true);
                        this.scene.add(pathEdge);
                    } else {
                        // 层间移动，使用垂直箭头
                        const isDownward = fromNode.layer > toNode.layer;
                        const verticalArrow = this.createVerticalSearchArrow(
                            fromMesh,
                            toMesh,
                            isDownward
                        );
                        this.scene.add(verticalArrow);
                    }
                }
            }
        }
    }

    createVerticalSearchArrow(from, to, isDownward) {
        const startPos = from.position.clone();
        const endPos = to.position.clone();
        
        // 计算水平距离和垂直距离
        const horizontalDist = new THREE.Vector2(
            endPos.x - startPos.x,
            endPos.z - startPos.z
        ).length();
        
        const verticalDist = Math.abs(endPos.y - startPos.y);
        
        // 创建控制点
        const controlPoint1 = new THREE.Vector3(
            startPos.x,
            startPos.y - (isDownward ? verticalDist * 0.2 : -verticalDist * 0.2),
            startPos.z
        );
        
        const controlPoint2 = new THREE.Vector3(
            endPos.x,
            endPos.y + (isDownward ? verticalDist * 0.2 : -verticalDist * 0.2),
            endPos.z
        );

        // 创建曲线
        const curve = new THREE.CubicBezierCurve3(
            startPos,
            controlPoint1,
            controlPoint2,
            endPos
        );

        // 创建曲线几何体
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x0066ff,
            opacity: 0.8,
            transparent: true
        });

        const line = new THREE.Line(geometry, material);
        
        // 创建箭头
        const arrowLength = 0.4;
        const arrowWidth = 0.2;
        
        const arrowShape = new THREE.Shape();
        arrowShape.moveTo(0, arrowLength/2);
        arrowShape.lineTo(-arrowWidth/2, -arrowLength/2);
        arrowShape.lineTo(arrowWidth/2, -arrowLength/2);
        arrowShape.lineTo(0, arrowLength/2);

        const arrowGeometry = new THREE.ShapeGeometry(arrowShape);
        const arrowMaterial = new THREE.MeshBasicMaterial({
            color: 0x0066ff,
            side: THREE.DoubleSide
        });

        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        
        // 设置箭头位置
        arrow.position.copy(endPos);
        
        // 计算箭头旋转
        const direction = isDownward ? new THREE.Vector3(0, -1, 0) : new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        arrow.quaternion.copy(quaternion);
        
        // 创建组
        const group = new THREE.Group();
        group.add(line);
        group.add(arrow);

        return group;
    }

    createArrowHead(position, direction) {
        const length = 0.5;
        const headLength = 0.2;
        const headWidth = 0.2;

        const arrowHelper = new THREE.ArrowHelper(
            direction,
            position,
            length,
            0x0066ff,
            headLength,
            headWidth
        );

        return arrowHelper;
    }

    resizeRenderer() {
        const container = document.getElementById('graph-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeRenderer());

        document.getElementById('generateBtn').addEventListener('click', () => {
            this.updateVisualization();
        });

        document.getElementById('searchBtn').addEventListener('click', () => {
            // 模拟搜索路径
            const searchPath = [
                ['entry', 'top1'],
                ['top1', 'mid1'],
                ['mid1', 'mid2'],
                ['mid2', 'bottom3'],
                ['bottom3', 'query']
            ];
            this.updateVisualization(searchPath);
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.camera.position.set(25, 15, 25);
            this.camera.lookAt(0, 5, 0);
            this.controls.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const hnsw = new HNSW(2);
    const visualization = new HNSWVisualization(hnsw);
    visualization.updateVisualization();
});
