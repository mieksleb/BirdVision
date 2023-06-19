/**
 * ThreeVisualiser module
 * @module code/public/js/SensorConfigTab/ThreeVisualiser
 * @see code/public/js/three
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import React, {useEffect, createRef } from 'react';
import { connect } from 'react-redux';


/**
* Function to create the 3D visualisation tool.
* @param {object} ball - Ball data.
* */
export default function CreateVisualiser({ balls }) {
    /**Reference passed to mount the 3D visualiser to the element.**/
    const mountRef = createRef();

    //On update of models.
    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) { return; }

        let scene, camera, renderer, controls;

        var renderedBalls = [];

        function init() {
            initScene();
            initCamera();
            initRenderer();
            initControls();
            initLighting();
            initGrid();
            createEnvironment();
            createSphere();
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
            camera.position.set(450, 300, 0);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }

        function initRenderer() {
            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(0xffffff, 1);
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            mount.appendChild(renderer.domElement);
        }

        function initControls() {
            controls = new OrbitControls(camera, renderer.domElement);
            controls.maxPolarAngle = Math.PI / 2;
        }

        function initLighting() {
            const hemisphereLight = new THREE.HemisphereLight(0xff0000,0xff0000,1)//(0xffffff, 0x00ffff, 1);
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            scene.add(hemisphereLight, ambientLight);
        }

        function initGrid() {
            const grid = new THREE.GridHelper(1500, 50);
            scene.add(grid);
        }

        function createEnvironment() {
            //TennisCourtDimensions[length, width] (inches)
            const TennisCourtDimensions = [36, 78, 1];
            const TennisCourtColor = 0x0099ff;
            const TennisCourtClearanceDimensions = [60, 120, 0.5];
            const TennisCourtClearanceColor = 0xb0e147;
            createRectangle(TennisCourtDimensions, TennisCourtColor);
            createRectangle(TennisCourtClearanceDimensions, TennisCourtClearanceColor);
            //Create the lines. Length, width, thickness, 
            // const lines = [
            //     {positions = [36, 1, ]}
            // ]

        }

        function createRectangle(dimensions, color){
            const scale = 10;
            const geometry = new THREE.BoxGeometry(scale*dimensions[0], scale*dimensions[1], scale*dimensions[2]); // Set the dimensions of the box
            const material = new THREE.MeshBasicMaterial({ color: color });
            const square = new THREE.Mesh(geometry, material);
            square.position.set( 0, 0, 0);
            square.rotation.set( Math.PI / 2, 0, 0);
            scene.add(square);
        }

        function createSphere() {
            // Create a black sphere
            const geometry = new THREE.SphereGeometry(5, 32, 32); // Set the radius and segments
            const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const sphere = new THREE.Mesh(geometry, material);
            const position = balls[0].position.split(' ').map(parseFloat);
            sphere.position.set( position[0], position[1], position[2]);
            scene.add(sphere);
            renderedBalls.push(sphere);
        }

        function updateBallPosition() {
            const position = balls[0].position.split(' ').map(parseFloat);
            renderedBalls[0].position.set( position[0], position[1], position[2]);
        }

        //This function is for testing
        function updateStorePosition() {
            // Generate a random number between 1 and -1
            const randomNum = 15*(Math.random() * 2 - 1);
            const position = balls[0].position.split(' ').map(parseFloat);
            const posX = position[0] + randomNum;
            const posY = position[1] + randomNum;
            const posZ = position[2] + randomNum;
            balls[0].position = `${posX} ${posY} ${posZ}`;
        }

        /**Animate function for the scene */
        function animate() {
            requestAnimationFrame(animate);
            updateBallPosition();
            renderer.render(scene, camera);
        };

        return () => {
            mount.removeChild(renderer.domElement);
        };

    }, [balls, mountRef]);

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