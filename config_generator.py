#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jun 28 14:09:41 2023

This script generates initial configuations for BirdVision for the purpose 
of acting as a data set for stats and ML methods

@author: michaelselby
"""

import numpy as np
import matplotlib.pyplot as plt

mph2mps = 2.23694 # conversion for miles per hour to meters per second
rps2rpm = 9.5492968 # conversion for radians per second to revolutions per minute

npoints = 100

x_av, y_av, z_av = 0, -5, 1
pos_mean = [x_av, y_av, z_av]
pos_cov = [[0.5, 0, 0], [0, 1, 0], [0, 0, 0.1]]  # diagonal covariance

x, y, z = np.random.multivariate_normal( pos_mean, pos_cov, npoints).T
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.set_xlim((-10,10))
ax.set_ylim((-10,0))
ax.set_zlim((0,10))
ax.scatter(x, y, z)
plt.show()

# remove non-physical positions, must have negative y and positive z
position_list = [np.array([x,y,z]) for x,y,z in zip(x,y,z) if y < 0 and z > 0]

# For velocities we require them to all have a positive y component
# average x value zero, z centred around a positve inclination
vx_av, vy_av, vz_av = 0, 25, 5
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
angular_vel_cov = [[3000, 0, 0], [0, 3000, 0], [0, 0, 3000]]  # diagonal covariance
wx, wy, wz = np.random.multivariate_normal( angular_vel_mean, angular_vel_cov, npoints).T
spins = [ np.sqrt ( wx ** 2 + wy ** 2 + wz ** 2 ) for wx, wy, wz in zip ( wx, wy, wz ) ]

max_spin = max(spins) * rps2rpm
min_spin = min(spins) * rps2rpm
av_spin = np.sum(spins) * rps2rpm /len(speeds)

angular_velocity_list = [ np.array([ wx, wy, wz ] ) for wx, wy, wz in zip ( wx, wy, wz ) ]


