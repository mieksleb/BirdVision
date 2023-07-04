#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 24 18:07:24 2023

@author: michaelselby
"""

import numpy as np
from scipy.optimize import fsolve
import matplotlib.pyplot as plt

net_width = 10.04
height_min = 0.915
height_max = 1.065

def net_height(x, y0, a):
    return y0 + a * ( np.cosh( x / ( 2 * a ) ) - 1 ) 

a0 = fsolve( lambda a: height_min + a * ( np.cosh( net_width / ( 2 * a ) ) - 1 ) - height_max , 84 ) [0]

x_vals = np.linspace( 0, net_width, 10 )

z_vals = [ net_height(x, height_min, a0) for x in x_vals]

plt.plot(x_vals, z_vals)
plt.show()

scale_vals = [ z / height_max for z in z_vals]


shift_vals2 = [ height_max / 2 - z / 2 for z in z_vals]