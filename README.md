# BirdVision

Tennis ball trajectory prediction and visualisation.

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

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


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License


[MIT](https://choosealicense.com/licenses/mit/)
