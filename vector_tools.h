//
// Created by Michael Selby on 15/06/2023.
//

#ifndef BIRDVISION_VECTOR_TOOLS_H
#define BIRDVISION_VECTOR_TOOLS_H
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <string>
#include <iomanip>
#include <ctime>
#include <random>
#include <vector>
#include<iostream>
#include <cmath>
#include <algorithm>

using namespace std;

double DotProduct (vector<double> &vec1, vector<double> &vec2);
void DivideVectorByScalar(vector<double> &vec, double &scalar);
void MultiplyVectorByScalar(vector<double> &vec, double &scalar);
void PrintVector(vector<double> &vec);
void AddVectors(vector<double> &vec1, vector<double> &vec2);


#endif //BIRDVISION_VECTOR_TOOLS_H
