//
// Created by Michael Selby on 15/06/2023.
//

#ifndef BIRDVISION_PARAMETERS_H
#define BIRDVISION_PARAMETERS_H

double PI = M_PI;
double mass = 0.00575; // mass of tennis ball in kilograms
double g = 9.80665; // acceleration due to gravity in ms^-2
double rho = 1.293; // density of air in kgm^−3 at 273 K and 101.325 kPa
double c_drag = 0.507; // coefficient of drag
double c_lift = 1; // coefficient of lift
double radius = 0.0343; // radius of tennis ball in meters
double cross_area = PI * pow( radius ,2); // cross-sectional area of a tennis ball
double net_height = 0.915; // height of net at centre
double court_length = 11.885; // distance from centre of net to centre of baseline in meters
double width_inner = 4.115; // half the width of single court in meters
double width_outer = 10.97; // half the width of doubles court in meters
double service_line_dist = 6.4; // distance from net to service line


#endif //BIRDVISION_PARAMETERS_H
