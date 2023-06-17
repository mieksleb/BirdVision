cmake_minimum_required(VERSION 3.15)
project(BirdVision)

set(CMAKE_CXX_STANDARD 14)

add_executable(BirdVision main.cpp parameters.h vector_tools.cpp vector_tools.h)