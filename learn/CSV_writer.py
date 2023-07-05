#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jul  5 16:01:22 2023

Script which generates CSV file dataset from BirdVision simulations

@author: michaelselby
"""
import os
import csv


data_root = "/Users/michaelselby/BirdVision/learn/data_folder"
data_csv = data_root + "/data.csv"

with open(data_csv, 'w', newline='') as file:
    writer = csv.writer(file)
    for i in range(99925):
        # Create a unique folder for each item
        item_folder = os.path.join(data_root, f"traj_{i}")
        full_path = os.path.abspath(item_folder)
        os.makedirs(item_folder, exist_ok=True)
        with open ( full_path + "/init.conf", "r" ) as file:
            lines = file.readlines()
            split_line = lines[0].split()
        
        with open ( full_path + "/event.dat", "r" ) as file:
            lines = file.readlines()
            split_line  += lines[1].split()
        
        writer.writerow(split_line)