/**
 * ThreeVisualiser module
 * @module code/public/js/SensorConfigTab/ThreeVisualiser
 * @see code/public/js/three
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import React, {useEffect, createRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import LoadingBar from './LoadingBar';
import "./Visualiser.css";
import * as mutations from '../store/mutations';



/**
* Function to create the 3D visualisation tool.
* @param {object} ball - Ball data.
* */
function CreateVisualiser({ balls, court }) {
    /**Reference passed to mount the 3D visualiser to the element.**/
    const mountRef = createRef();
    const dispatch = useDispatch();
    

    const ballRadius = 0.0343 // radius of ball in meters
    const courtLength = 23.77; // length of ball in meters
    const courtWidth = 10.97;
    const [loading, setLoading] = useState(true);
    const [percentage, setPercentage] = useState(0);
    //const { loading, percentage } = court;

    useEffect(() => {
        console.log("percentage = " + percentage);
    }, [percentage]);

    //On update of models.
    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) { return; }

        let scene, camera, renderer, controls;

        var renderedBalls = [];
        var renderedCourt = [];
        var renderedTail = [];


        async function init() {
            initScene();
            initCamera();
            initRenderer();
            initControls();
            initLighting();
            //initGrid();
            //createEnvironment();
            await loadCourt();
            loadBalls();
            createTail();
            //createSphere();
            animate();

        }

        init();

        function initScene() {
            scene = new THREE.Scene();
        }

        function initCamera() {
            const fov = 50;
            const aspect = mount.clientWidth / mount.clientHeight;
            const near = 0.01;
            const far = 3000;
            camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            camera.position.set(0, 25, 3);
            camera.up.set(0, 0, 1);
            camera.lookAt(new THREE.Vector3(0, 0, 1));
        }

        function initRenderer() {
            renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
            renderer.setClearColor(0xffffff, 1);
            renderer.gammaOutput = true;
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            mount.appendChild(renderer.domElement);
        }

        function initControls() {
            controls = new OrbitControls(camera, renderer.domElement);
            //controls.maxPolarAngle = Math.PI / 2;
        }

        function initLighting() {
            const hemisphereLight = new THREE.HemisphereLight(0xffffff,0xffffff,1)//(0xffffff, 0x00ffff, 1);
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            ambientLight.intensity = 0.5;
            hemisphereLight.intensity = 0.3;
            scene.add(hemisphereLight, ambientLight);
        }

        function initGrid() {
            const grid = new THREE.GridHelper(1500, 50);
            scene.add(grid);
        }

        function createEnvironment() {
            //TennisCourtDimensions[length, width] (inches)
            const TennisCourtDimensions = [courtWidth, courtLength, 0.5];
            const TennisCourtColor = 0x0099ff;
            const TennisCourtOffset = 0;
            const TennisCourtClearanceDimensions = [100, 100, 0.5];
            const TennisCourtClearanceColor = 0xb0e147;
            const TennisCourtClearanceOffset = 0;

            createRectangle(TennisCourtDimensions, TennisCourtColor, TennisCourtOffset);
            //createRectangle(TennisCourtClearanceDimensions, TennisCourtClearanceColor, TennisCourtClearanceOffset);


        }

        function createRectangle(dimensions, color, offset){
            const geometry = new THREE.BoxGeometry(dimensions[0], dimensions[1], dimensions[2]); // Set the dimensions of the box
            const material = new THREE.MeshBasicMaterial({ color: color,   opacity: 0.5, transparent:true});
            const square = new THREE.Mesh(geometry, material);
            square.position.set( 0, offset, 0);
            //square.rotation.set( Math.PI / 2, 0, 0);
            scene.add(square);
        }


        // create a tube whose centre line is defined by some list of coordinates which acts as a trail
        function createTail() {

            const positions = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1)]

          
            const path = new THREE.CatmullRomCurve3(positions);
            const tubularSegments = 10; // Adjust the number of segments as needed
            const radiusSegments = 10; // Adjust the number of segments as needed
            const closed = false; // Set to true if the tube should be closed



            const tubeGeometry = new THREE.TubeGeometry(path, tubularSegments, ballRadius, radiusSegments, closed);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const tube = new THREE.Mesh(tubeGeometry, material);
            tube.material.visible = false;
            tube.position.set(0, 0, 0);
            scene.add(tube)
            renderedTail.push(tube);
          
          }
          

        function createSphere() {
            // Create a black sphere
            const radius = 5; // Radius of the sphere
            const widthSegments = 32; // Number of horizontal segments
            const heightSegments = 32; // Number of vertical segments
            const TennisBallColor = 0xCEFF33;
            const geometry = new THREE.SphereGeometry(ballRadius, widthSegments, heightSegments); // Set the radius and segments
            const material = new THREE.MeshBasicMaterial({ color: TennisBallColor });
            const sphere = new THREE.Mesh(geometry, material);
            const position = balls[0].position.split(' ').map(parseFloat);
            sphere.position.set( position[0], position[1], position[2]);
            scene.add(sphere);
            renderedBalls.push(sphere);
        }




        function loadBalls() {
            const loader = new GLTFLoader();

            loader.load('tennis_ball.gltf',
                (data) => onLoad(data),
                //onProgress,
                //onError
            );

            const onLoad = ( gltf ) =>{
                var model = gltf.scene;
                //renderedBalls.push(model);
                scene.add(model); // Add the loaded model to the scene
                console.log("Ball loaded")
                const boundingBox = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);
                const scale = 4;
                model.scale.set(scale, scale, scale);
                model.position.set( 0, 0, -1);
                renderedBalls.push(model);

                }

          }
        function onProgress(xhr) {
            const xhr_total = 161594144 // size of glb if it cannot be included, will need updating with model
            if (xhr.lengthComputable) {
                const progress = (xhr.loaded / xhr.total) * 100;
                const percent = Math.floor(progress);
                setPercentage(percent);
                // dispatch({ type: mutations.SET_PERCENTAGE, percentage: percent });
                // court.percentage = percent;
                
                if ( percent === 100) {
                    setLoading(false)
                    //court.loading = false;
                // dispatch({ type: mutations.SET_LOADING, loading: false });
                }
            }   
            else {
                const progress = (xhr.loaded / xhr_total) * 100;
                const percent = Math.floor(progress);
                console.log("Percentage is " + percent);
                setPercentage(percent);
                // dispatch({ type: mutations.SET_PERCENTAGE, percentage: percent });
                // court.percentage = percent;
                    
                if ( percent === 100) {
                    console.log("Setting loading false");
                    setLoading(false)
                    //court.loading = false;
                    // dispatch({ type: mutations.SET_LOADING, loading: false });
                }
                // court.percentage = percent;
                // dispatch({ type: mutations.SET_PERCENTAGE, percentage: percent });
                // if ( percent === 100) {
                //     court.loading = false;
                //     dispatch({ type: mutations.SET_LOADING, loading: false });
                // }

            }
        }
        
        function loadCourt() {
            return new Promise((resolve, reject) => {
                const loader = new GLTFLoader();

                loader.load('tennis_court.glb',
                    (data) => {
                        onLoad(data);
                        resolve(); // Resolve the promise when the model is loaded
                      },
                    
                    onProgress,
                    onError
                );
                // const position = balls[0].position.split(' ').map(parseFloat);
                const onLoad = ( gltf ) =>{
                    var model = gltf.scene;
                    renderedCourt.push(model);
                    scene.add(model); // Add the loaded model to the scene
                    model.position.set( 0, 0, 0);
                    model.rotation.x = Math.PI/2;
                    
                }


                  function onError(error) {
                    console.error('Error loading model:', error);
                  }
            });
        }


        
        function updateBallPosition() {
            
            if(renderedBalls[0]){
                const position = balls[0].position
                renderedBalls[0].position.set(position[0], position[1], position[2]);
            }
        }

        function updateTail() {
            
            if ( renderedTail[0] ) {
                const position = balls[0].position
                const positions = balls[0].positionHistory
                const vectorPositions = [];
  
                if (positions.length < 2) {
                    return; // Need at least 2 positions to create the curve
                }

                else {
                    for ( let i = 0; i < positions.length; i++) {
                        const pos = positions[i];
                        vectorPositions.push(new THREE.Vector3( pos[0], pos[1], pos[2]));
                    }
                }

    
                const path = new THREE.CatmullRomCurve3(vectorPositions);
                const tubularSegments = 64; // Adjust the number of segments as needed
                const radiusSegments = 64; // Adjust the number of segments as needed
                const closed = false; // Set to true if the tube should be closed
    
    
                const tubeGeometry = new THREE.TubeGeometry(path, tubularSegments, ballRadius, radiusSegments, closed);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const tube = new THREE.Mesh(tubeGeometry, material);
                tube.material.opacity = 0.1;  // Set the opacity value between 0 (fully transparent) and 1 (fully opaque)
                tube.material.transparent = true;  // Enable transparency for the material
                scene.add(tube)
                renderedTail.push(tube);
            }
        }

        //This function is for testing
        function updateStorePosition() {
            // Generate a random number between 1 and -1
        }

        /**Animate function for the scene */
        function animate() {
            requestAnimationFrame(animate);
            updateBallPosition();
            updateTail();
            renderer.render(scene, camera);
        };


        return () => {
            mount.removeChild(renderer.domElement);
        };

    }, [balls,court, percentage, setPercentage]);

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            <div ref={mountRef} style={{ width: '100%', height: '60%' }}> 
            {loading && <LoadingBar loading={loading} percentage={percentage} />}
            </div>
        </div>
    );
}


/**
 * mapStateToProps function used in Redux to map the state and ownProps to component props.
 * @param {object} state - The Redux state object.
 * @param {object} ownProps - The component's own props.
 * @returns {object} The mapped props object.
 */
function mapStateToProps(state, ownProps) {
    return {
        balls: state.balls,
        court: state.court,
    }
}

/** Export to initialise the Sensor Config Tab */
export const ConnectedCreateVisualiser = connect(mapStateToProps)(CreateVisualiser);