cmake_minimum_required(VERSION 3.10)
project(hnsw)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(hnsw_example example.cpp)
target_include_directories(hnsw_example PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
