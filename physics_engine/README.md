# BirdVision Physics Engine

Tennis ball trajectory prediction via classical dynamics. There is a C++ and Python version.

## Installation

To compile the C++ physics engine,

```bash
g++ main.cpp
```

## Usage

```bash
./BirdVision input
```

Input is an input file
```bash
steps = 10000
step_print = 10
dt = 0.001
conf = /Users/michaelselby/BirdVision/test/init.conf
traj = trajectory.dat
```

## Input/Output

BirdVision's configuration file format contains the position, velocity and angular momentum of the ball. If the position of the ball is $\mathbf{r}$, the velocity $\mathbf{v}$ and angular momentum $\mathbf{\omega}$, then the correpsonding configuration file is:


$r_{x}$   $r_{y}$   $r_{z}$   $v_{x}$   $v_{y}$   $v_{z}$   $\omega_{x}$   $\omega_{y}$   $\omega_{z}$

where $r_{x}$ is the component of $\mathbf{r}$ in the $x$ direction.


