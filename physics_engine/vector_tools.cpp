//
// Created by Michael Selby on 15/06/2023.
//
#include <iostream>
#include <iomanip>
#include <sstream>
#include <random>
#include <vector>
#include <algorithm>


using namespace std;

void AddVectors(vector<double> &vec1, vector<double> &vec2) {
    for (int i = 0; i < vec1.size(); i++) {
        vec1[i] += vec2[i];
    }
}

double DotProduct(vector<double> &vec1, vector<double> &vec2){
    double result = 0.0;
    for (int i = 0; i < vec1.size(); i++) {
        result += vec1[i] * vec2[i];
    }
    return result;
}

vector<double> CrossProduct(vector<double> &vec1, vector<double> &vec2){
    vector<double> result(3);
    result[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
    result[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
    result[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
    return result;
}

void DivideVectorByScalar(vector<double> &vec, double &scalar){
    transform (vec.begin(), vec.end(), vec.begin(), [&scalar](double c1) { return c1 / scalar; });
}

void MultiplyVectorByScalar(vector<double> &vec, double &scalar){
    transform (vec.begin(), vec.end(), vec.begin(), [&scalar](double c1) { return c1 * scalar; });
}

vector<double> GetMultiplyVectorByScalar(vector<double> &vec, double &scalar){
    vector<double> result;
    result.reserve(vec.size());

    for (const auto& element : vec) {
    result.push_back(element * scalar);
    }
    return result;
}

void PrintVector(vector<double> &vec){
    for ( int i = 0; i < vec.size(); ++i )
        cout << vec[i] << ' ';
    cout << endl;
}

//template <typename T>
//void PrintVector(const vector<T>& vec) {
//    for (const auto& element : vec) {
//        cout << element << ' ';
//    }
//    cout << endl;
//}

void WriteVector2Line(ostream &stream, vector<double> &values, int &width, int &prec, bool endline) {
    stream << fixed << setprecision(prec);
    for (const auto& value : values) {
        stream << setw(width) << left << value << setw(width) << right;
    }
    if (endline) {
                stream << endl;
        }
}



#include "vector_tools.h"
