# BirdVision

Tennis ball trajectory prediction and visualisation using classical dynamics and machine learning. A full description can be found in the [manual](BirdVision.pdf).

![Alt text](/3D_objects/Rendered_Images/ball_render_sleb2.png?raw=true "Optional Title")

## Physics Engine

[Physics engine](physics_engine) contains Python and C++ code for simulation of tennis balls via integration of the classical equations of motion for a ball which experiences drag, gravity and lift (magnus effect).

## Machine Learning

The [learn](learn) directory includes data set generation scripts and a Pytorch neural network model for line calling prediction.


## Visualiser

Tennis ball trajectories can be visualised using front end [visualiser](visualiser). The visualiser is written in JavaScript and utilises React and Three.js.


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License


[MIT](https://choosealicense.com/licenses/mit/)
