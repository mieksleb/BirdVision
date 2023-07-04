# BirdVision

Tennis ball trajectory prediction and visualisation using classical dynamics and machine learning.

![Alt text](/3D_objects/Rendered_Images.ball_render_sleb2.png?raw=true "Optional Title")

## Physics Engine

Physics engine in directory physics_engine contains Python and C++ code for simulation of tennis balls via integration of the classical equations of motion for a ball which experiences drag, gravity and lift (magnus effect).

## Machine Learning

BirdVision's configuration file format contains the position, velocity and angular momentum of the ball. If the position of the ball is $\mathbf{r}$, the velocity $\mathbf{v}$ and angular momentum $\mathbf{\omega}$, then the correpsonding configuration file is:


$r_{x}$   $r_{y}$   $r_{z}$   $v_{x}$   $v_{y}$   $v_{z}$   $\omega_{x}$   $\omega_{y}$   $\omega_{z}$

where $r_{x}$ is the component of $\mathbf{r}$ in the $x$ direction.

## Visualiser

Tennis ball trajectories can be visualised using front end visualiser in directory visualiser. The visualiser is written in JavaScript and utilises React and Three.js.


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License


[MIT](https://choosealicense.com/licenses/mit/)
