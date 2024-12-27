class BPlusTreeNode {
    constructor(isLeaf = true, order = 3) {
        this.isLeaf = isLeaf;
        this.order = order;
        this.keys = [];
        this.children = [];
        this.next = null; // For leaf nodes to form a linked list
    }
}

class BPlusTree {
    constructor(order = 3) {
        this.root = new BPlusTreeNode(true, order);
        this.order = order;
    }

    search(key) {
        let current = this.root;
        while (!current.isLeaf) {
            let i = 0;
            while (i < current.keys.length && key >= current.keys[i]) {
                i++;
            }
            current = current.children[i];
        }
        
        for (let i = 0; i < current.keys.length; i++) {
            if (current.keys[i] === key) {
                return true;
            }
        }
        return false;
    }

    insert(key) {
        if (this.root.keys.length === 0) {
            this.root.keys.push(key);
            return;
        }

        if (this.root.keys.length === (2 * this.order - 1)) {
            let newRoot = new BPlusTreeNode(false, this.order);
            newRoot.children.push(this.root);
            this.splitChild(newRoot, 0);
            this.root = newRoot;
        }
        this.insertNonFull(this.root, key);
    }

    insertNonFull(node, key) {
        if (node.isLeaf) {
            let i = node.keys.length - 1;
            while (i >= 0 && node.keys[i] > key) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }
            node.keys[i + 1] = key;
        } else {
            let i = node.keys.length - 1;
            while (i >= 0 && node.keys[i] > key) {
                i--;
            }
            i++;
            
            if (node.children[i].keys.length === (2 * this.order - 1)) {
                this.splitChild(node, i);
                if (key > node.keys[i]) {
                    i++;
                }
            }
            this.insertNonFull(node.children[i], key);
        }
    }

    splitChild(parentNode, childIndex) {
        let child = parentNode.children[childIndex];
        let newNode = new BPlusTreeNode(child.isLeaf, this.order);
        
        parentNode.keys.splice(childIndex, 0, child.keys[this.order - 1]);
        
        if (!child.isLeaf) {
            for (let i = 0; i < this.order; i++) {
                newNode.keys[i] = child.keys[i + this.order];
            }
            for (let i = 0; i < this.order + 1; i++) {
                newNode.children[i] = child.children[i + this.order];
            }
            child.keys.length = this.order - 1;
            child.children.length = this.order;
        } else {
            for (let i = 0; i < this.order; i++) {
                newNode.keys[i] = child.keys[i + this.order - 1];
            }
            child.keys.length = this.order - 1;
            
            // Update leaf node links
            newNode.next = child.next;
            child.next = newNode;
        }
        
        parentNode.children.splice(childIndex + 1, 0, newNode);
    }

    // Helper method to get tree structure for visualization
    getTreeStructure() {
        const traverse = (node, level = 0) => {
            let result = {
                keys: node.keys,
                isLeaf: node.isLeaf,
                level: level,
                children: []
            };
            
            if (!node.isLeaf) {
                for (let child of node.children) {
                    result.children.push(traverse(child, level + 1));
                }
            }
            
            return result;
        };
        
        return traverse(this.root);
    }
}

// Export for use in visualization
window.BPlusTree = BPlusTree;
