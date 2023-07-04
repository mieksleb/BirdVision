#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Jun 30 16:29:27 2023

Python implememntation of BirdVision physcis engine

Three integrators are implemented: velocity Verlet, leapfrog and Range-Kutta4

@author: michaelselby
"""
import numpy as np
import matplotlib.pyplot as plt


c_traj = []
with open ("/Users/michaelselby/BirdVision/visualiser/public/test/trajectory.dat", "r") as file:
    for line in file:
        split_line = line.split()
        r = np.array ( [float(split_line[0]), float(split_line[1]), float(split_line[2])])
        c_traj.append(r)

mass = 0.0575 # mass of tennis ball in kilograms
g = 9.80665 # acceleration due to gravity in ms^-2
rho = 1.293 # density of air in kgm^−3 at 273 K and 101.325 kPa
c_drag = 0.507 # coefficient of drag
radius = 0.0343 # radius of tennis ball in meters
cross_area = np.pi * radius **2 # cross-sectional area of a tennis ball
net_height_min = 0.915 # height of net at centre
court_length = 11.885 # distance from centre of net to centre of baseline in meters
width_inner = 4.115 # half the width of single court in meters
rps2rpm = 9.5492968 # conversion for radians per second to revolutions per minute
mph2mps = 2.23694 # conversion for miles per hour to meters per second



pos0 = np.array( [ 0.0, -10.0, 1.0 ] )
vel0 =  np.array( [ 0, 20.0, 8 ] )
inclination  = 180 * np.arctan(vel0[2]/vel0[1]) / np.pi
omega0 =  np.array( [ - 2000 / rps2rpm, 0, 0 ] ) # 2000 rpm topspin

grav_force =  np.array( [ 0, 0, - mass * g] )

n_steps = 10000
step_print =  10
dt = 0.001

def get_force(pos,vel,omega):
    """
    Calculates the total force acting on the tennis ball at a given position, velocity, and angular velocity.
    
    Args:
        pos (np.array): Position vector [x, y, z]
        vel (np.array): Velocity vector [vx, vy, vz]
        omega (np.array): Angular velocity vector [wx, wy, wz]
    
    Returns:
        np.array: Total force vector [Fx, Fy, Fz]
    """
    speed = np.linalg.norm(vel)
    force = np.array([0.0,0.0,0.0])
    force += grav_force
    drag_force =  - ( 0.5 * rho * c_drag * cross_area * np.dot(vel, vel) ) * vel / np.linalg.norm(vel)
    spin = np.linalg.norm(omega)
    S = radius * spin / speed
    c_lift = 0.6 * S
    direction = np.cross(omega,vel)
    direction /= np.linalg.norm(direction)
    magnus_force = ( 0.5 * rho * c_lift * cross_area * np.dot(vel, vel) ) * direction
    force += drag_force + magnus_force
    
    return force

def update_vV( pos, vel , omega, old_force, dt ):
    """
    Updates the position, velocity, and angular velocity using the velocity Verlet method.
    
    Args:
        pos (np.array): Position vector [x, y, z]
        vel (np.array): Velocity vector [vx, vy, vz]
        omega (np.array): Angular velocity vector [wx, wy, wz]
        old_force (np.array): Force vector from the previous step [Fx, Fy, Fz]
        dt (float): Time step size
    
    Returns:
        np.array, np.array, np.array, np.array: Updated position, velocity, angular velocity, and force
    """
    force = get_force(pos,vel,omega)
    factor = dt / ( 2 * mass )
    factor2 = factor * dt
    pos += vel * dt + old_force * factor2
    vel += ( force + old_force ) * factor
    old_force = force
    return pos, vel, omega, old_force

def update_leapfrog( pos, vel, omega, dt):
    """
    Updates the position, velocity, and angular velocity using the leapfrog method.
    
    Args:
        pos (np.array): Position vector [x, y, z]
        vel (np.array): Velocity vector [vx, vy, vz]
        omega (np.array): Angular velocity vector [wx, wy, wz]
        dt (float): Time step size
    
    Returns:
        np.array, np.array, np.array: Updated position, velocity, and angular velocity
    """
    force = get_force(pos,vel,omega)
    factor = dt / ( 2 * mass )
    vel += force * factor
    
    force = get_force(pos,vel,omega)
    pos += vel * dt
    vel +=  force * factor

    return pos, vel, omega

def update_RK4(pos, vel, omega, dt):
    """
    Updates the position, velocity, and angular velocity using the Runge-Kutta 4 method.
    
    Args:
        pos (np.array): Position vector [x, y, z]
        vel (np.array): Velocity vector [vx, vy, vz]
        omega (np.array): Angular velocity vector [wx, wy, wz]
        dt (float): Time step size
    
    Returns:
        np.array, np.array, np.array: Updated position, velocity, and angular velocity
    """
    
    force  = get_force(pos, vel, omega)
    
    # initial
    k1_pos = vel * dt
    k1_vel = dt * force / mass
    
    
    # half time-step
    k2_pos = (vel + k1_vel / 2) * dt
    k2_vel = dt * get_force(pos + k1_pos / 2, vel + k1_vel / 2, omega) / mass

    k3_pos = dt * (vel + k2_vel / 2 ) 
    k3_vel = dt * get_force( pos + k2_pos / 2, vel + k2_vel / 2 , omega) / mass
    

    k4_pos = (vel + k3_vel) * dt
    k4_vel = dt * (get_force(pos + k3_pos, vel + k3_vel, omega) ) / mass

    pos += (k1_pos + 2 * k2_pos + 2 * k3_pos + k4_pos) / 6
    vel += (k1_vel + 2 * k2_vel + 2 * k3_vel + k4_vel) / 6


    return pos, vel, omega



def generate_trajectory(pos0, vel0, omega0, n_steps, dt, integrator = "vV"):
    """
    Generates the trajectory of the tennis ball using the specified integrator.
    
    Args:
        pos0 (np.array): Initial position vector [x, y, z]
        vel0 (np.array): Initial velocity vector [vx, vy, vz]
        omega0 (np.array): Initial angular velocity vector [wx, wy, wz]
        n_steps (int): Number of time steps
        dt (float): Time step size
        integrator (str): Integrator method to use. Options: "vV", "leapfrog", "RK4" (default is "vV")
    
    Returns:
        list: List of position vectors representing the trajectory
    """
    pos, vel, omega = pos0.copy(), vel0.copy(), omega0.copy()
    trajectory = [] 
    old_force = np.array( [ 0.0, 0.0, 0.0 ] )
    for step in range(n_steps):
    
        if integrator == "vV":  
            pos, vel, omega, old_force = update_vV(pos,vel,omega, old_force, dt)
        elif integrator == "leapfrog":
            pos, vel, omega = update_leapfrog(pos, vel, omega, dt)
        else:
            pos, vel, omega = update_RK4(pos, vel, omega, dt)
            
        
        if pos[2] < 0:
            break
        
        if step % step_print == 0:
            trajectory.append(pos.copy())
            
    return trajectory

trajectory_vV = generate_trajectory(pos0, vel0, omega0, n_steps, dt, integrator = "vV")
trajectory_leapfrog = generate_trajectory(pos0, vel0, omega0, n_steps, dt, integrator = "leapfrog")
trajectory_RK4 = generate_trajectory(pos0, vel0, omega0, n_steps, dt, integrator = "RK4")

    
    
    
    
plt.xlim(-10,20)
plt.ylim(0,30)
for pos in trajectory_RK4:
    plt.scatter(pos[1],pos[2], color="blue", marker="x", label="RK4", s=10)
    
for pos in trajectory_vV:
    plt.scatter(pos[1],pos[2], color="black", marker="x", label="vV", s=10)
    
for pos in trajectory_leapfrog:
    plt.scatter(pos[1],pos[2], color="red", marker="o", label="leapfrog", s=10)
    
for pos in c_traj:
    plt.scatter(pos[1],pos[2], color="green", marker="o", label="c++", s=10)
    
plt.show()
    
    
    
    