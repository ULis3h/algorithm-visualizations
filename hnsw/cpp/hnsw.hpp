#pragma once

#include <vector>
#include <random>
#include <memory>
#include <queue>
#include <algorithm>
#include <mutex>
#include <unordered_set>

template<typename T, typename DistanceFunction>
class HNSW {
public:
    struct Node {
        T data;
        std::vector<std::vector<size_t>> layers;  // 每层的邻居节点索引
        Node(const T& element) : data(element) {}
    };

    HNSW(size_t maxElements, size_t M = 16, size_t efConstruction = 200) 
        : maxElements_(maxElements), M_(M), M_max_(M), 
          efConstruction_(efConstruction), ml_(calculateML(maxElements)) {
        nodes_.reserve(maxElements);
        random_generator_.seed(100);
    }

    void addPoint(const T& element) {
        size_t curr_idx = nodes_.size();
        nodes_.emplace_back(element);
        
        if (curr_idx == 0) {
            // 第一个点，创建一个空的层级结构
            nodes_[0].layers.resize(ml_ + 1);
            return;
        }

        size_t curr_level = getRandomLevel();
        size_t max_level = std::min(curr_level, ml_);
        nodes_[curr_idx].layers.resize(max_level + 1);

        // 从最高层开始搜索
        size_t ep = 0; // 入口点
        for (int level = ml_; level >= 0; level--) {
            if (level <= max_level) {
                // 在当前层查找最近邻
                auto neighbors = searchLayer(element, ep, efConstruction_, level);
                size_t M = (level == 0) ? M_max_ : M_;

                // 选择最近的M个邻居
                if (neighbors.size() > M) {
                    neighbors.resize(M);
                }

                // 建立双向连接
                for (const auto& neighbor : neighbors) {
                    nodes_[curr_idx].layers[level].push_back(neighbor.first);
                    nodes_[neighbor.first].layers[level].push_back(curr_idx);
                }
            }
            if (!nodes_[ep].layers[level].empty()) {
                ep = nodes_[ep].layers[level][0];
            }
        }
    }

    std::vector<std::pair<size_t, float>> searchKnn(const T& query, size_t k) const {
        
        if (nodes_.empty()) return {};
        
        size_t ep = 0; // 从顶层的入口点开始
        
        // 从最高层开始向下搜索
        for (int level = ml_; level > 0; level--) {
            auto neighbors = searchLayer(query, ep, 1, level);
            ep = neighbors[0].first;
        }
        
        // 在底层进行最终搜索
        auto neighbors = searchLayer(query, ep, k, 0);
        if (neighbors.size() > k) {
            neighbors.resize(k);
        }
        
        return neighbors;
    }

private:
    std::vector<Node> nodes_;
    size_t maxElements_;
    size_t M_;            // 每层最大出边数
    size_t M_max_;        // 顶层最大出边数
    size_t efConstruction_; // 构建时的邻居数量
    size_t ml_;           // 最大层数
    mutable std::mt19937 random_generator_;
    DistanceFunction distance_;

    size_t calculateML(size_t maxElements) {
        return static_cast<size_t>(log2(maxElements));
    }

    size_t getRandomLevel() {
        std::uniform_real_distribution<float> distribution(0.0, 1.0);
        float rand = distribution(random_generator_);
        return static_cast<size_t>(-log(rand) * M_);
    }

    std::vector<std::pair<size_t, float>> searchLayer(
        const T& query,
        size_t ep,
        size_t ef,
        size_t layer) const {
        
        std::unordered_set<size_t> visited{ep};
        std::priority_queue<std::pair<float, size_t>> candidates;
        std::priority_queue<std::pair<float, size_t>> result;
        
        float d = distance_(query, nodes_[ep].data);
        candidates.push({-d, ep});
        result.push({d, ep});
        
        while (!candidates.empty()) {
            auto current = candidates.top();
            if (-current.first > result.top().first) {
                break;
            }
            candidates.pop();
            
            // 检查当前节点的所有邻居
            for (size_t neighbor_idx : nodes_[current.second].layers[layer]) {
                if (visited.insert(neighbor_idx).second) {
                    float dist = distance_(query, nodes_[neighbor_idx].data);
                    if (result.size() < ef || dist < result.top().first) {
                        candidates.push({-dist, neighbor_idx});
                        result.push({dist, neighbor_idx});
                        if (result.size() > ef) {
                            result.pop();
                        }
                    }
                }
            }
        }
        
        std::vector<std::pair<size_t, float>> returnList;
        while (!result.empty()) {
            returnList.push_back({result.top().second, result.top().first});
            result.pop();
        }
        std::reverse(returnList.begin(), returnList.end());
        
        return returnList;
    }
};
