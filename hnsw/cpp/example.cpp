#include "hnsw.hpp"
#include <iostream>
#include <vector>
#include <cmath>

// 定义欧几里得距离函数
struct EuclideanDistance {
    float operator()(const std::vector<float>& a, const std::vector<float>& b) const {
        float sum = 0;
        for (size_t i = 0; i < a.size(); ++i) {
            float diff = a[i] - b[i];
            sum += diff * diff;
        }
        return std::sqrt(sum);
    }
};

int main() {
    // 创建HNSW索引
    HNSW<std::vector<float>, EuclideanDistance> hnsw(1000);  // 最多存储1000个点

    // 添加一些示例点
    std::vector<std::vector<float>> points = {
        {1.0, 2.0, 3.0},
        {4.0, 5.0, 6.0},
        {7.0, 8.0, 9.0},
        {2.0, 3.0, 4.0},
        {5.0, 6.0, 7.0}
    };

    // 添加点到索引
    for (const auto& point : points) {
        hnsw.addPoint(point);
    }

    // 搜索最近邻
    std::vector<float> query = {3.0, 4.0, 5.0};
    auto results = hnsw.searchKnn(query, 3);  // 查找3个最近邻

    // 输出结果
    std::cout << "Query point: [3.0, 4.0, 5.0]\n";
    std::cout << "Nearest neighbors:\n";
    for (const auto& result : results) {
        const auto& point = points[result.first];
        std::cout << "Index: " << result.first 
                  << ", Distance: " << result.second 
                  << ", Point: [";
        for (size_t i = 0; i < point.size(); ++i) {
            if (i > 0) std::cout << ", ";
            std::cout << point[i];
        }
        std::cout << "]\n";
    }

    return 0;
}
