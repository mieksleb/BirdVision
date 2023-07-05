#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jul  3 13:39:08 2023

Neural Network which trains on simulation data from BirdVision

@author: michaelselby
"""


import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torch.utils.data import random_split
            
            
class CustomDataset(Dataset):
    def __init__(self, csv_file, features_indices, labels_indices):
        self.features = []
        self.labels = []
        start1, end1 = features_indices
        start2, end2 = labels_indices

        # Read the CSV file and extract data and labels
        with open(csv_file, 'r') as file:
            lines = file.readlines()
            for line in lines:
                entries = line.strip().split(',')
                self.features.append(list(map(float, entries[start1:end1])))
                self.labels.append(list(map(float, entries[start2:end2])))
        
        # Convert features and labels to tensors
        self.features = torch.tensor(self.features, dtype=torch.float32)
        self.labels = torch.tensor(self.labels, dtype=torch.float32)
        
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
    
    
    
class NeuralNetworkTrainer:
    def __init__(self, model, train_loader, val_loader, loss_fn, optimizer):
        self.model = model
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.loss_fn = loss_fn
        self.optimizer = optimizer
        self.train_losses = []
        self.val_losses = []
        self.train_metrics = []
        self.val_metrics = []

    def train(self, num_epochs, compute_accuracies = False):
        
        if compute_accuracies:
            self.train_accs = []
            self.val_accs = []
        
        for epoch in range(num_epochs):
            self.model.train()
            train_loss_list, val_loss_list = [], []
            
            for batch_idx, (features, labels) in enumerate(self.train_loader):
                # Forward pass
                outputs = self.model(features)
                train_loss = self.loss_fn(outputs, labels)
                
                # Backward pass
                self.optimizer.zero_grad()
                train_loss.backward()
                self.optimizer.step()
                
                train_loss_list.append(train_loss.item())
                
            print(
                f"Epoch {epoch+1:02d}/{num_epochs:02d}"
                f" | Batch {batch_idx+1:02d}/{len(self.train_loader):02d}"
                f" | Train Loss {train_loss:.3f}"
            )
    
            self.model.eval()
            for batch_idx, (features, labels) in enumerate(self.val_loader):
                with torch.no_grad():
                    outputs = self.model(features)
                    val_loss = self.loss_fn(outputs, labels)
                    val_loss_list.append(val_loss.item())
    
            train_loss = np.mean(train_loss_list)
            val_loss = np.mean(val_loss_list)
    
            self.train_losses.append(train_loss)
            self.val_losses.append(val_loss)
    
            if compute_accuracies:
                train_acc = compute_binary_accuracy(self.model, self.train_loader)
                val_acc = compute_binary_accuracy(self.model, self.val_loader)
                train_acc = compute_binary_accuracy(self.model, self.train_loader)
                val_acc = compute_binary_accuracy(self.model, self.val_loader)

                self.train_accs.append(train_acc)
                self.val_accs.append(val_acc)
            
            print(
                f"Train accuracy: {train_acc:.3f}"
                f" | Val accuracy: {val_acc:.3f}\n"
                "------------------------------------------------"
            )
            
    def save_model( self,  model_name = "model.pth"):
        torch.save(self.model.state_dict(), model_name)

        



def compute_binary_accuracy(model, dataloader):
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


def compute_position_accuracy(model, dataloader):
    """
    This function puts the model in evaluation mode (model.eval()) and calculates the accuracy with respect to the input dataloader
    """
    model = model.eval()
    diff = 0
    total_examples = 0
    for idx, (features, labels) in enumerate(dataloader):
        with torch.no_grad():
            predictions = model(features)
            # print(labels.shape)
            for i in range(int(labels.shape[0])):
                diff += ( predictions[i,:] - labels[i,:] ).pow(2).sum(3).sqrt()
                print(diff)
                total_examples += 1
    return diff / total_examples





    



