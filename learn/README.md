# BirdVision Machine Learning

This directory contains all scripts relating to machine learning and data set generation.

## Datasets

[config_generator.py](config_generator.py) generates datasets by calling the BirdVision C++ engine on a range of randomly generated inital conditions. Sets are normally distributed about average values such that they produce a roughly 2/3 to 1/3 split between balls that are in and balls that are out.

## Machine Learning

[mieklearn.py](mieklearn.py) trains a neural network to predict whether the ball impacts with the net, and whether the ball is out. The model trains on a CSV with 14 fields: 9 features and 5 labels. The 9 features are the 3 x 3D vectors which describe the state of a ball (posisiton, velocity, angular momentum), the 5 features include the two binary classifiers Net? and Out? as well as the impact position.


