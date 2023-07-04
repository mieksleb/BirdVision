#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jul  3 13:39:08 2023

Neural Network which trains on simulation data from BirdVision

@author: michaelselby
"""

import os
import pandas as pd
import csv
import numpy as np
import torch
import torch.nn as nn
from torchvision import transforms
from torch.utils.data import Dataset, DataLoader
from torch.utils.data import random_split
# from torchvision.datasets import CSVDataset
import matplotlib.pyplot as plt


data_root = "/Users/michaelselby/BirdVision/data_folder"
data_csv = data_root + "/data.csv"
# with open(data_csv, 'w', newline='') as file:
#     writer = csv.writer(file)
#     for i in range(99925):
#         # Create a unique folder for each item
#         item_folder = os.path.join(data_root, f"traj_{i}")
#         full_path = os.path.abspath(item_folder)
#         os.makedirs(item_folder, exist_ok=True)
#         with open ( full_path + "/init.conf", "r" ) as file:
#             lines = file.readlines()
#             split_line = lines[0].split()
        
#         with open ( full_path + "/event.dat", "r" ) as file:
#             lines = file.readlines()
#             split_line  += lines[1].split()
        
#         writer.writerow(split_line)
            
            
class CustomDataset(Dataset):
    def __init__(self, csv_file):
        self.features = []
        self.labels = []

        # Read the CSV file and extract data and labels
        with open(csv_file, 'r') as file:
            lines = file.readlines()
            for line in lines:
                entries = line.strip().split(',')
                self.features.append(list(map(float, entries[:9])))
                self.labels.append(list(map(float, entries[9])))
        
        
        mean_list = []
        std_list = []
    
        
        # Convert features and labels to tensors
        self.features = torch.tensor(self.features, dtype=torch.float32)
        self.labels = torch.tensor(self.labels, dtype=torch.float32)
        
        # Calculate mean and standard deviation for each feature
        # mean_list = [torch.mean(self.features[:, i]) for i in range(9)]
        # std_list = [torch.std(self.features[:, i]) for i in range(9)]
        
        # Calculate mean and standard deviation for each feature
        self.mean = torch.mean(self.features, dim=0)
        self.std = torch.std(self.features, dim=0)
        

    def __len__(self):
        return len(self.features)
    
    def __getitem__(self, idx):
        features = self.features[idx]
        labels = self.labels[idx]
        
        
        # Normalize features within batch
        features = (features - self.mean) / self.std

        return features, labels
    
    
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
    
    



dataset = CustomDataset( data_csv )

# Split the dataset into training and validation sets
train_size = int(0.9 * len(dataset))
val_size = len(dataset) - train_size

train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

# Create the data loader
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True) # 32 reccomended but any power of 2 between 16-512 is ok
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=True)



# Define the CSV file and transform
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

# Create the dataset
# dataset = CSVDataset(data_csv, transform=transform, target_transform=transform)


def compute_accuracy(model, dataloader):
    """
    This function puts the model in evaluation mode (model.eval()) and calculates the accuracy with respect to the input dataloader
    """
    model = model.eval()
    correct = 0
    total_examples = 0
    for idx, (features, labels) in enumerate(dataloader):
        with torch.no_grad():
            logits = model(features)
        predictions = torch.where(logits > 0.5, 1, 0)
        lab = labels.view(predictions.shape)
        comparison = lab == predictions

        correct += torch.sum(comparison)
        total_examples += len(comparison)
    return correct / total_examples





# Create an instance of the neural network
model = NeuralNetwork()

# Define the loss function and optimizer
loss_fn = nn.BCELoss()  # Binary Cross Entropy Loss
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)


losses = []


# Number of epochs, 3 times the dimension of dataset good rule of thumb
num_epochs = 27

train_losses, val_losses = [], []
train_accs, val_accs = [], []

for epoch in range(num_epochs):

    model = model.train()
    train_loss_list, val_loss_list = [], []
    for batch_idx, (features, labels) in enumerate(train_loader):

        # Forward pass
        outputs = model(features)
        train_loss = loss_fn(outputs, labels)
        
        # Backward Pass
        optimizer.zero_grad()
        train_loss.backward()
        optimizer.step()
        
        train_loss_list.append(train_loss.item())
        
    print(
        f"Epoch {epoch+1:02d}/{num_epochs:02d}"
        f" | Batch {batch_idx:02d}/{len(train_loader):02d}"
        f" | Train Loss {train_loss:.3f}"
        )

    model = model.eval()
    for batch_idx, (features, labels) in enumerate(val_loader):
        with torch.no_grad():
            
            outputs = model(features)

            val_loss = loss_fn(outputs, labels)
            val_loss_list.append(val_loss.item())

    train_losses.append(np.mean(train_loss_list))
    val_losses.append(np.mean(val_loss_list))

    train_acc = compute_accuracy(model, train_loader)
    val_acc = compute_accuracy(model, val_loader)

    train_accs.append(train_acc)
    val_accs.append(val_acc)

    print(
        f"Train accuracy: {train_acc:.3f}"
        f" | Val accuracy: {val_acc:.3f}\n"
        "------------------------------------------------"
    )
    
    
torch.save(model.state_dict(), "model.pth")


