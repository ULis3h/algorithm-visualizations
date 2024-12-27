class SmallWorldNetwork {
    constructor(nodeCount, kNeighbors, rewireProb) {
        console.log('Creating network with:', { nodeCount, kNeighbors, rewireProb });
        this.nodeCount = nodeCount;
        this.kNeighbors = kNeighbors;
        this.rewireProb = rewireProb;
        this.adjacencyList = new Array(nodeCount).fill(null).map(() => new Set());
        this.nodePositions = [];
        this.generatePositions();
        this.generateNetwork();
    }

    generatePositions() {
        const phi = Math.PI * (3 - Math.sqrt(5));
        const radius = 200;

        for (let i = 0; i < this.nodeCount; i++) {
            const y = 1 - (i / (this.nodeCount - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;

            this.nodePositions.push({
                x: x * radius,
                y: y * radius,
                z: z * radius
            });
        }
    }

    generateNetwork() {
        // 创建规则网络
        for (let i = 0; i < this.nodeCount; i++) {
            for (let j = 1; j <= this.kNeighbors / 2; j++) {
                const neighbor = (i + j) % this.nodeCount;
                this.adjacencyList[i].add(neighbor);
                this.adjacencyList[neighbor].add(i);
            }
        }

        // 重连边
        for (let i = 0; i < this.nodeCount; i++) {
            const neighbors = [...this.adjacencyList[i]];
            for (const neighbor of neighbors) {
                if (Math.random() < this.rewireProb && neighbor > i) {
                    this.adjacencyList[i].delete(neighbor);
                    this.adjacencyList[neighbor].delete(i);

                    let newNeighbor;
                    do {
                        newNeighbor = Math.floor(Math.random() * this.nodeCount);
                    } while (newNeighbor === i || this.adjacencyList[i].has(newNeighbor));

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
    constructor(containerId) {
        console.log('Initializing visualizer for:', containerId);
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }

        this.network = null;
        this.scene = new THREE.Scene();
        console.log('Scene created');

        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        console.log('Camera created');

        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        console.log('Renderer created');

        this.nodes = [];
        this.edges = [];
        
        this.initializeScene();
        this.setupEventListeners();
        this.animate();
    }

    initializeScene() {
        console.log('Initializing scene');
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0xffffff);
        this.container.appendChild(this.renderer.domElement);
        console.log('Renderer added to container');

        this.camera.position.z = 500;

        const ambientLight = new THREE.AmbientLight(0x404040);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        console.log('Lights added');

        // 添加轨道控制器
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        console.log('Controls initialized');

        // 添加测试球体
        const geometry = new THREE.SphereGeometry(50, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0x1a73e8 });
        const sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);
        console.log('Test sphere added');
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
            this.updateVisualization();
        });

        calculateBtn.addEventListener('click', () => {
            if (!this.network) return;
            
            document.getElementById('avgPathLength').textContent = 
                this.network.calculateAveragePathLength();
            document.getElementById('clusteringCoeff').textContent = 
                this.network.calculateClusteringCoefficient();
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }

    updateVisualization() {
        this.nodes.forEach(node => this.scene.remove(node));
        this.edges.forEach(edge => this.scene.remove(edge));
        this.nodes = [];
        this.edges = [];

        const nodeGeometry = new THREE.SphereGeometry(5, 32, 32);
        const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0x1a73e8 });

        this.network.nodePositions.forEach(pos => {
            const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
            nodeMesh.position.set(pos.x, pos.y, pos.z);
            this.nodes.push(nodeMesh);
            this.scene.add(nodeMesh);
        });

        const edgeMaterial = new THREE.LineBasicMaterial({ 
            color: 0x1a73e8, 
            opacity: 0.5, 
            transparent: true 
        });

        for (let i = 0; i < this.network.nodeCount; i++) {
            const neighbors = this.network.adjacencyList[i];
            for (const neighbor of neighbors) {
                if (neighbor > i) {
                    const points = [];
                    points.push(new THREE.Vector3(
                        this.network.nodePositions[i].x,
                        this.network.nodePositions[i].y,
                        this.network.nodePositions[i].z
                    ));
                    points.push(new THREE.Vector3(
                        this.network.nodePositions[neighbor].x,
                        this.network.nodePositions[neighbor].y,
                        this.network.nodePositions[neighbor].z
                    ));

                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, edgeMaterial);
                    this.edges.push(line);
                    this.scene.add(line);
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.controls) {
            this.controls.update();
        }
        this.renderer.render(this.scene, this.camera);
    }
}

// 页面加载完成后初始化可视化器
console.log('Script loaded, waiting for DOM...');
window.addEventListener('load', () => {
    console.log('DOM loaded, creating visualizer...');
    try {
        const visualizer = new NetworkVisualizer('network-3d');
        // 生成初始网络
        document.getElementById('generateBtn').click();
    } catch (error) {
        console.error('Error creating visualizer:', error);
    }
});
