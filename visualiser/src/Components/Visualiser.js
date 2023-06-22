/**
 * ThreeVisualiser module
 * @module code/public/js/SensorConfigTab/ThreeVisualiser
 * @see code/public/js/three
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import React, {useEffect, createRef } from 'react';
import { connect } from 'react-redux';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


/**
* Function to create the 3D visualisation tool.
* @param {object} ball - Ball data.
* */
export default function CreateVisualiser({ balls }) {
    /**Reference passed to mount the 3D visualiser to the element.**/
    const mountRef = createRef();

    const scale = 10;

    //On update of models.
    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) { return; }

        let scene, camera, renderer, controls;

        var renderedBalls = [];
        var renderedCourt = [];

        function init() {
            initScene();
            initCamera();
            initRenderer();
            initControls();
            initLighting();
            //initGrid();
            //createEnvironment();
            loadBalls(balls);
            loadCourt();
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
            const near = 1;
            const far = 3000;
            camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            camera.position.set(0, 200, 50);
            camera.up.set(0, 0, 1);
            camera.lookAt(new THREE.Vector3(0, 0, 10));
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
            const TennisCourtDimensions = [10.97, 23.77, 1];
            const TennisCourtColor = 0x0099ff;
            const TennisCourtOffset = -1.5;
            const TennisCourtClearanceDimensions = [20, 40, 0.5];
            const TennisCourtClearanceColor = 0xb0e147;
            const TennisCourtClearanceOffset = -1.5;

            createRectangle(TennisCourtDimensions, TennisCourtColor, TennisCourtOffset);
            createRectangle(TennisCourtClearanceDimensions, TennisCourtClearanceColor, TennisCourtClearanceOffset);


        }

        function createRectangle(dimensions, color, offset){
            const geometry = new THREE.BoxGeometry(scale*dimensions[0], scale*dimensions[1], scale*dimensions[2]); // Set the dimensions of the box
            const material = new THREE.MeshBasicMaterial({ color: color,   opacity: 0.5, transparent:true});
            const square = new THREE.Mesh(geometry, material);
            square.position.set( 0, offset, 0);
            //square.rotation.set( Math.PI / 2, 0, 0);
            scene.add(square);
        }

        function createSphere() {
            // Create a black sphere
            const radius = 5; // Radius of the sphere
            const widthSegments = 32; // Number of horizontal segments
            const heightSegments = 32; // Number of vertical segments
            const TennisBallColor = 0xCEFF33;
            const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments); // Set the radius and segments
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
                onProgress,
                onError
            );

            const onLoad = ( gltf ) =>{
                var model = gltf.scene;
                renderedBalls.push(model);
                scene.add(model); // Add the loaded model to the scene
                console.log("Ball loaded")
                const boundingBox = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);
                const currentLength = size.x;
                const scale = 1 / currentLength;
                //console.log(model);
                model.scale.set(scale, scale, scale);
                model.position.set( 0, 0, 20);
                renderedBalls.push(model);
                //model.position.set( position[1], position[0], position[2]);
                //console.log(renderedBalls);
                }


            function onProgress(xhr) {
                console.log("3D model is" + (xhr.loaded / xhr.total) *100 +"% loaded");
                console.log(xhr.total);
                console.log(xhr.loaded);
                }

            function onError(error) {
                console.error('Error loading model:', error);
            }


          }

        
          function loadCourt() {
            const loader = new GLTFLoader();

            loader.load('tennis_court.gltf',
                (data) => onLoad(data),
                onProgress,
                onError
            );
            // const position = balls[0].position.split(' ').map(parseFloat);
            const onLoad = ( gltf ) =>{
                var model = gltf.scene;
                renderedCourt.push(model);
                scene.add(model); // Add the loaded model to the scene
                console.log(model);
                model.position.set( 0, 0, 0);
                model.rotation.x = Math.PI/2;
                // scale up to match length
                model.scale.set(5, 5, 5);
                

                }


            function onProgress(xhr) {
                console.log("3D model is" + (xhr.loaded / xhr.total) *100 +"% loaded");
                console.log(xhr.total);
                console.log(xhr.loaded);
                }

            function onError(error) {
                console.error('Error loading model:', error);
            }


          }
        function updateBallPosition() {
            
            if(renderedBalls[0]){
                const position = balls[0].position.split(' ').map(parseFloat);
                //console.log(renderedBalls[0]);
                renderedBalls[0].position.set( scale*position[0], scale*position[1], scale*position[2]);
                // console.log(renderedBalls[0].position);
            }

        }

        //This function is for testing
        function updateStorePosition() {
            // Generate a random number between 1 and -1
        }

        /**Animate function for the scene */
        function animate() {
            requestAnimationFrame(animate);
            //renderedCourt[0];
            updateBallPosition();
            //updateStorePosition();
            renderer.render(scene, camera);
        };


        return () => {
            mount.removeChild(renderer.domElement);
        };

    }, [balls]);

    return (
        <div ref={mountRef} style={{ width: '100%', height: '60%' }}>
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
        balls: state.balls
    }
}

/** Export to initialise the Sensor Config Tab */
export const ConnectedCreateVisualiser = connect(mapStateToProps)(CreateVisualiser);