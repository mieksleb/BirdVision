#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jul  5 15:46:22 2023

This script trains neural networks for line calling and final impact position

@author: michaelselby
"""

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torch.utils.data import random_split
from mieklearn import CustomDataset, NeuralNetworkTrainer

class NeuralNetwork(nn.Module):
    def __init__(self):
        
        super(NeuralNetwork, self).__init__()
        self.fc1 = nn.Linear(9, 64)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(64, 64)
        self.fc3 = nn.Linear(64, 1)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        x = self.relu(x)
        x = self.fc3(x)
        x = self.sigmoid(x)
        
        return x
    
class NeuralNetwork2(nn.Module):
    def __init__(self):
        
        super(NeuralNetwork2, self).__init__()
        self.fc1 = nn.Linear(9, 64)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(64, 64)
        self.fc3 = nn.Linear(64, 3)  # Three output units for three numbers

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        x = self.relu(x)
        x = self.fc3(x)
        
        return x


data_root = "/Users/michaelselby/BirdVision/learn/data_folder"
data_csv = data_root + "/data.csv"

dataset = CustomDataset( data_csv, [0,9], [10,11] )

# Split the dataset into training and validation sets
train_size = int(0.9 * len(dataset))
val_size = len(dataset) - train_size

train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

# Create the data loader
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True) # 32 recommended but any power of 2 between 16-512 is ok
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=True)



# Create an instance of the neural network
model = NeuralNetwork()
# Define the loss function and optimizer
loss_fn = nn.BCELoss()  # Binary Cross Entropy Loss
# loss_fn = nn.MSELoss()  # Binary Cross Entropy Loss
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
# Number of epochs, 3 times the dimension of dataset good rule of thumb
num_epochs = 10
trainer = NeuralNetworkTrainer(model, train_loader, val_loader, loss_fn, optimizer)
trainer.train(num_epochs,compute_accuracies=True)
# trainer.save_model("model_final_pos.pth")
