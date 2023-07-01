#include <iostream>
#include <fstream>
#include <cstdlib>
#include <string>
#include <iomanip>
#include <ctime>
#include <cmath>
#include <random>
#define _POSIX_SOURCE
#include <unistd.h>
#undef _POSIX_SOURCE
#include <stdio.h>
#include <vector>
#include <sstream>
#include "parameters.h"
#include "vector_tools.h"

using namespace std;

void initialize (string conf_path, vector<double> &pos, vector<double> &vel, vector<double> &omega);


double cpu_time ( );

void timestamp ( );

void update (vector<double> &pos, vector<double> &vel, vector<double> &omega, vector<double> &force, vector<double> &old_force,
              vector<double> &acc, double dt);

void compute ( vector<double> &pos, vector<double> &vel, vector<double> &omega,
               vector<double> &force, double &pot, double &kin);



//****************************************************************************80

int main ( int argc, char *argv[] )

//****************************************************************************80
//
//  Usage:
//
//
//    where
//    * step_num is the number of time steps (500, for instance).
//    * dt is the time step (0.1 for instance)
//
{
    double ctime;
    double dt;
    double kinetic;
    double e0;
    double potential;
    int step;
    int step_num;
    int step_print;
    int width = 10; // width of output values
    int prec = 4; // dp precision of output values
    int step_print_index;
    int step_print_num;
    string top_file_name;
    string conf_path;
    string traj_file_name;
    string event_file_name;
    string last_conf_file_name;
    bool crossed_net = false;
    bool is_in = false;

    // get the current working directory, where the input file is situated
    char cwd_char[1024];
    getcwd(cwd_char, sizeof(cwd_char));
    string cwd = static_cast<string>(cwd_char);
    cwd += static_cast<string>("/");

    string input_file_name = argv[1]; //input file is the only system argument
    string input_file_path = cwd + input_file_name;


    timestamp ( );
    cout << "\n";
    cout << "  BirdVision" << endl;
    cout << "  C++ version" << endl;
    cout << "  A classical dynamics program for tennis ball trajectories" << endl;
    cout << "  Current working directory is " << cwd << endl;
//

    string line;
    ifstream input_file;
    string inp_delim = "=";
    input_file.open(input_file_path);
    if (input_file.is_open()) {   //checking whether the file is open
        while (getline(input_file, line)) { //read data from file object and put it into string
            auto start = 0U;
            auto end_str = line.find(inp_delim);
            while (end_str != string::npos)
            {
                string search = line.substr(start, end_str - start);
                start = end_str + inp_delim.length();
                end_str = line.find(inp_delim, start);
                string val = line.substr(start, end_str);
                search.erase( std::remove_if( search.begin(), search.end(), ::isspace ), search.end() );
                val.erase( std::remove_if( val.begin(), val.end(), ::isspace ), val.end() );
                if ( search == "steps" )
                {
                    step_num = stoi(val);
                }
                if ( search == "step_print" )
                {
                    step_print = stoi(val);
                }
                else if ( search == "dt" )
                {
                    dt = stod(val);
                }
                else if ( search == "mass" )
                {
                   mass = stod(val);
                }
                else if ( search == "conf" )
                {
                    conf_path = val;
                }
                else if ( search == "traj" )
                {
                   traj_file_name = val;
                }
                else if ( search == "event" )
                {
                    event_file_name = val;
                }
                else if ( search == "last_conf" )
                {
                   last_conf_file_name = val;
                }

            }
        }
    }

    input_file.close(); // close the file object.






//
//  Report.
//
    cout << "\n";
    cout << "  step_num, the number of time steps, is " << step_num << endl;
    cout << "  Printing every " << step_print << " steps" << endl;
    cout << "  dt, the size of each time step, is " << dt << endl;
    cout << "  The initial config file path " << conf_path << endl;



//
//  This is the main time stepping loop:
//    Compute forces and energies,
//    Update positions, velocities, accelerations.
//

    string energy_file_name = "energy.out";
    // open all files to be written to
    ofstream traj_file;
    ofstream event_file;
    ofstream last_conf_file;
    ofstream energy_file;
    traj_file.open(traj_file_name);
    event_file.open(event_file_name);
    energy_file.open(energy_file_name);

    energy_file << "\n";
    energy_file << "  At each step, we report the potential and kinetic energies.\n";
//    energy_file << "  The sum of these energies should be a constant.\n";
//    energy_file << "  As an accuracy check, we also print the relative error\n";
//    energy_file << "  in the total energy.\n";
    energy_file << "\n";
    energy_file << "      Step      Potential       Kinetic        \n";
    energy_file << "                Energy P        Energy K       \n";
    energy_file << "\n";


    event_file << fixed << setw(width) << left << "Net?" << setw(width) << right
    << setw(width) << left << "Out?" << setw(width) << right
    << setw(width) << left << "Impact Position" << setw(width) << right << endl;

    ctime = cpu_time ( );


    // Construct the positions, velocities, accelerations and forces all as 3-vectors of zeros
    vector<double> pos(3,0);
    vector<double> acc(3,0);
    vector<double> vel(3,0);
    vector<double> omega(3,0);
    vector<double> force(3,0);
    vector<double> old_force(3,0);

    for ( step = 0; step <= step_num; step++ ) {
        potential = 0;
        kinetic = 0;

        if ( step == 0 )
        {
            initialize(conf_path,pos,vel,omega);
            cout << "  Initial postion is " << pos.at(0) << " " << pos.at(1) << " " << pos.at(2) << endl;
            cout << "  Initial velocity is " << vel.at(0) << " " << vel.at(1) << " " << vel.at(2) << endl;
            cout << "  Initial angular velocity is " << omega.at(0) << " " << omega.at(1) << " " << omega.at(2) << endl;
        }
        else
        {
            update(pos,vel,omega,force,old_force,acc, dt);
            // check if ball has hit net or bounced
            if ( !crossed_net && pos[1] > 0 && pos[2] < net_height_min) {
                cout << "  Ball has hit the net!" << endl;
                crossed_net = true;
                event_file << 1 << 1 << fixed << setprecision(prec)
               << setw(width) << left << pos[0] << setw(width) << right
               << setw(width) << left << pos[1] << setw(width) << right
               << setw(width) << left << pos[2] << setw(width) << right << endl;
                break;
            }
            else if (!crossed_net && pos[1] > 0 && pos[2] > net_height_min) {
                crossed_net = true;
                cout << "  Ball has cleared the net!" << endl;
                event_file << fixed << setw(width) << left << 0 << setw(width) << right;

            }

            if (pos[2] < 0) {
                cout << "  Ball has bounced!" << endl;
                if ( abs(pos[0]) < width_inner && pos[1] > 0 && pos[1] < court_length) {
                    cout << "  Ball is in! :-)" << endl;
                    is_in = true;
                    event_file << fixed << setw(width) << left << 0 << setw(width) << right;
                }
                else {
                    cout << "  Ball is out! >:-(" << endl;
                    is_in = false;
                    event_file << fixed << setw(width) << left << 1 << setw(width) << right;
                }
                event_file << fixed << setprecision(prec)
               << setw(width) << left << pos[0] << setw(width) << right
               << setw(width) << left << pos[1] << setw(width) << right
               << setw(width) << left << pos[2] << setw(width) << right << endl;
                break;
            }
        }

        // compute forces and energies
        compute(pos,vel,omega,force,potential,kinetic);

        if ( step == 0 )
        {
            e0 = potential + kinetic;
        }

        if ( step % step_print == 0 )
        {
            traj_file << fixed << setprecision(prec)
            << setw(width) << left << pos[0] << setw(width) << right
            << setw(width) << left << pos[1] << setw(width) << right
            << setw(width) << left << pos[2] << setw(width) << right
            << setw(width) << left << vel[0] << setw(width) << right
            << setw(width) << left << vel[1] << setw(width) << right
            << setw(width) << left << vel[2] << setw(width) << right
            << setw(width) << left << omega[0] << setw(width) << right
            << setw(width) << left << omega[1] << setw(width) << right
            << setw(width) << left << omega[2] << right << endl;


            energy_file << "  " << setw(8) << step
                 << "  " << setw(14) << potential
                 << "  " << setw(14) << kinetic << endl;

        }

    }
    traj_file.close();
    energy_file.close();
//
//  Report timing.
//
    ctime = cpu_time ( ) - ctime;
    cout << "\n";
    cout << "  Elapsed cpu time " << ctime << " seconds.\n";
//

//  Terminate.
//
    cout << "\n";
    cout << "  Normal end of execution.\n";
    cout << "\n";
    timestamp ( );

    return 0;
}




//****************************************************************************80

void compute ( vector<double> &pos, vector<double> &vel, vector<double> &omega,
               vector<double> &force, double &pot, double &kin) {

//****************************************************************************80
//
//  Purpose:
//
//    COMPUTE computes the forces,
//    force : total force, f(alpha) is alpha'th component of the vectorial force
//

    vector<double> direction; // unit vector pointing in direction of motion
    vector<double> drag_force;
    vector<double> grav_force;
    vector<double> magnus_force;
    double f_drag;

    double speed_squared = DotProduct(vel, vel);
    double speed = pow (speed_squared, 0.5);
    double spin = pow( DotProduct(omega, omega), 0.5);
    double spin_ratio = radius * spin / speed;
    double c_lift = 0.6 * spin_ratio;

    // kinetic and potential energies
    kin = 0.5 * mass * speed_squared;
    pot = mass * g * pos[2];

    direction = vel;
    DivideVectorByScalar(direction, speed); //normalize

    // calculate the drag force
    f_drag = - 0.5 * rho * cross_area * c_drag * speed_squared;
    drag_force = direction;
    MultiplyVectorByScalar(drag_force, f_drag); // normalize


    // calculate the gravitational force
    force = {0, 0, 0};
    grav_force = {0, 0, - mass * g};

    // calculate the magnus force
    magnus_force = CrossProduct( omega, vel); // direction of force is cross product of velocity and spin

    double prefactor = 0.5 * c_lift * cross_area * rho * speed_squared / (spin * speed);
    MultiplyVectorByScalar(magnus_force, prefactor);


    AddVectors(force, drag_force);
    AddVectors(force, grav_force);
    AddVectors(force, magnus_force);



    return;

}

//****************************************************************************80


double cpu_time ( )

//****************************************************************************80
//
//  Purpose:
//
//    CPU_TIME reports the elapsed CPU time.
//
//  Licensing:
//
//    This code is distributed under the GNU LGPL license.
//
//  Modified:
//
//    27 September 2005
//
//  Author:
//
//    John Burkardt
//
//  Parameters:
//
//    Output, double CPU_TIME, the current total elapsed CPU time in second.
//
{
    double value;

    value = ( double ) clock ( ) / ( double ) CLOCKS_PER_SEC;

    return value;
}
//****************************************************************************80



void initialize (string conf_path, vector<double> &pos, vector<double> &vel, vector<double> &omega)

//****************************************************************************80
//
//  Purpose:
//
//    INITIALIZE initializes the positions and velocities from input config file
//

//  Parameters:
//
//    Output, vector<double> pos, the positions.
//
//    Output, vector<double> vel, the velocities.
//
{

    string line;
//
//  Set the positions, velocities
//  We now open the configuration file


    ifstream conf_file;
    conf_file.open(conf_path);
    if (conf_file.is_open()) {   //checking whether the file is open
        string s;
        int counter = 0; // this is the counter for the positional part of pos
        while ( getline(conf_file, line) ) { //read data from file object and put it into string
            istringstream line_string( line );
            while (line_string >> s) {
                if (counter < 3) {
                    pos[counter] = stod(s);
                }
                else if (3 <= counter && counter < 6) {
                    vel[counter - 3] = stod(s);
                }
                else if (6 <= counter){
                    omega[counter - 6] = stod(s);
                }
                counter += 1;
            }
        }
    }
    else {
        cout << "File not found." << endl;
    }
    conf_file.close(); //close the file object.

}
//****************************************************************************80


void timestamp ( )

//****************************************************************************80
//
//  Purpose:
//
//    TIMESTAMP prints the current YMDHMS date as a time stamp.
//
//  Example:
//
//    31 May 2001 09:45:54 AM
//
//  Licensing:
//
//    This code is distributed under the GNU LGPL license.
//
//  Modified:
//
//    24 September 2003
//
//  Author:
//
//    John Burkardt
//
//  Parameters:
//
//    None
//
{
# define TIME_SIZE 40

    static char time_buffer[TIME_SIZE];
    const struct tm *tm;
    time_t now;

    now = time ( NULL );
    tm = localtime ( &now );

    strftime ( time_buffer, TIME_SIZE, "%d %B %Y %I:%M:%S %p", tm );

    cout << time_buffer << "\n";

    return;
# undef TIME_SIZE
}
//****************************************************************************80





void update ( vector<double> &pos, vector<double> &vel, vector<double> &omega, vector<double> &force, vector<double> &old_force,
              vector<double> &acc, double dt)

//****************************************************************************80
//
//  Parameters:
//
//    Output, vector<double>, the positions.
//
//    Output, vector<double> vel, the velocities.
//
//    Output, vector<double> acc, the accelerations.
//
//    Output, vector<double> force, the forces.
//
//    Output, vector<double> old_force, the forces at the previous timestep
//
//    Input, double mass, the mass of each particle.
//
//    Input, double dt, the time step.
//
{
    // input timestep is in s so must convert to simulation units

    double factor = dt / (2 * mass);
    double factor2 = factor * dt;
//
//
////  velocity Verlet algorithm
    for (int i = 0; i < 3; i++) {
        pos[i] += vel[i] * dt + old_force[i] * factor2;
        vel[i] += (force[i] + old_force[i]) * factor;
    }

    old_force = force;


//////     Leapfrog algorithm
////     Update velocities at half time step
//    for (int i = 0; i < 3; i++) {
//        vel[i] += force[i] * factor;
//    }
//
//    // Update positions at full time step
//    for (int i = 0; i < 3; i++) {
//        pos[i] += vel[i] * dt;
//    }
//
////     Update forces based on new positions
//    compute ( pos, vel, omega, force, factor, factor);
//
//    // Update velocities at full time step
//    for (int i = 0; i < 3; i++) {
//        vel[i] += (force[i]) * factor;
//    }
//
//    old_force = force;




    return;
}


