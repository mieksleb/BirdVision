#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jun 28 14:09:41 2023

This script generates initial configuations for BirdVision for the purpose 
of acting as a data set for stats and ML methods

@author: michaelselby
"""
import os
import numpy as np
import matplotlib.pyplot as plt
import subprocess



mph2mps = 2.23694 # conversion for miles per hour to meters per second
rps2rpm = 9.5492968 # conversion for radians per second to revolutions per minute

npoints = 1000

dt = 0.001 
step_num = 10000
step_print = 10

x_av, y_av, z_av = 0, -5, 1
pos_mean = [x_av, y_av, z_av]
pos_cov = [[0.5, 0, 0], [0, 1, 0], [0, 0, 0.1]]  # diagonal covariance

x, y, z = np.random.multivariate_normal( pos_mean, pos_cov, npoints).T
# fig = plt.figure()
# ax = fig.add_subplot(111, projection='3d')
# ax.set_xlim((-10,10))
# ax.set_ylim((-10,0))
# ax.set_zlim((0,10))
# ax.scatter(x, y, z)
# plt.show()

# remove non-physical positions, must have negative y and positive z
position_list = [np.array([x,y,z]) for x,y,z in zip(x,y,z) if y < 0 and z > 0]

# For velocities we require them to all have a positive y component
# average x value zero, z centred around a positve inclination
vx_av, vy_av, vz_av = 0, 25, 2
v = np.sqrt ( vx_av ** 2 + vy_av ** 2 + vz_av ** 2 )

vel_mean = [vx_av, vy_av, vz_av]
vel_cov = [[5, 0, 0], [0, 10, 0], [0, 0, 5]]  # diagonal covariance
vx, vy, vz = np.random.multivariate_normal( vel_mean, vel_cov, npoints).T

velocity_list = [np.array([vx,vy,vz]) for vx,vy,vz in zip(vx,vy,vz) if vy > 0]

speeds = [ np.sqrt ( vx ** 2 + vy ** 2 + vz ** 2 ) for vx, vy, vz in zip ( vx, vy, vz ) ]
max_speed = max(speeds) * mph2mps
min_speed = min(speeds) * mph2mps
av_speed = np.sum(speeds) * mph2mps /len(speeds)


wx_av, wy_av, wz_av = 0, 0, 0

angular_vel_mean = [wx_av, wy_av, wz_av]
angular_vel_cov = [[6000, 0, 0], [0, 6000, 0], [0, 0, 6000]]  # diagonal covariance
wx, wy, wz = np.random.multivariate_normal( angular_vel_mean, angular_vel_cov, npoints).T
spins = [ np.sqrt ( wx ** 2 + wy ** 2 + wz ** 2 ) for wx, wy, wz in zip ( wx, wy, wz ) ]



max_spin = max(spins) * rps2rpm
min_spin = min(spins) * rps2rpm
av_spin = np.sum(spins) * rps2rpm /len(speeds)

angular_velocity_list = [ np.array([ wx, wy, wz ] ) for wx, wy, wz in zip ( wx, wy, wz ) ]

# make all same length
length = max(len(position_list), len(velocity_list), len(angular_velocity_list))
position_list = position_list[:length]
velocity_list = velocity_list[:length]
angular_velocity_list = angular_velocity_list[:length]

# Create a folder to store the files
folder_name = "data_folder_test"
os.makedirs(folder_name, exist_ok=True)

balls_out = 0
balls_net = 0

# Loop through the data
for i, val_list in enumerate( zip (position_list, velocity_list, angular_velocity_list) ):
    # Create a unique folder for each item
    item_folder = os.path.join(folder_name, f"traj_{i}")
    full_path = os.path.abspath(item_folder)
    os.makedirs(item_folder, exist_ok=True)
    pos, vel, omega = val_list

    # Write the position and velocity to a file
    init_file_path = os.path.join(item_folder, "init.conf")
    with open(init_file_path, "w") as file:
        file.write(f"{pos[0]:<10.4f} {pos[1]:<10.4f} {pos[2]:<10.4f}")
        file.write(f"{vel[0]:<10.4f} {vel[1]:<10.4f} {vel[2]:<10.4f}")
        file.write(f"{omega[0]:<10.4f} {omega[1]:<10.4f} {omega[2]:<10.4f}")
        

    # Write the input files
    input_file_path = os.path.join(item_folder, "input")
    with open(input_file_path, "w") as file:
        file.write(f"steps = {step_num}\n")
        file.write(f"step_print = {step_print}\n")
        file.write(f"dt = {dt}\n")
        file.write(f"conf = {full_path}/init.conf\n")
        file.write(f"traj = {full_path}/trajectory.dat\n")
        file.write(f"event = {full_path}/event.dat\n")
        
        
    file_path = full_path + "/input"
    cpp_script = "cmake-build-debug/BirdVision"
    subprocess.run([cpp_script, file_path])
    
    first_line = True
    with open ( full_path + "/event.dat", "r" ) as file:
        lines = file.readlines()
        line = lines[1]
        # print(line)
        split_line = line.split()
        net, out = int ( split_line[0] ), int ( split_line[1] )
        if net:
            balls_net += 1
        if out:
            balls_out += 1
    
    
    
print(f"{npoints} trajectories simulated!")
    
    
        
        
        
        
        

    

