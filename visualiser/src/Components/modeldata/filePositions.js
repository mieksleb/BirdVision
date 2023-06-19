import React, { useEffect, useState } from 'react';
import { store } from '../../store/index';
import * as mutations from '../../store/mutations';
import { connect } from 'react-redux';

const PositionLoader = ({balls}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lines, setLines] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch('test/trajectory.dat');
            const content = await response.text();
            const lines = content.split('\n');
            setLines(lines);
        } catch (error) {
            console.error('Error fetching test file:', error);
        }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (currentIndex < lines.length) {
            const line = lines[currentIndex];
            console.log("Line");
            console.log(line);
            const values = line.trim().split(/\s+/).map(parseFloat);
            console.log("values");
            console.log(values);
            //Set the values of position in the store
            store.dispatch({
                type: mutations.SET_BALL_POSITION,
                id: "M1",
                position: `${values[0]} ${values[1]} ${values[2]}`,
            });


        const timer = setTimeout(() => {
            setCurrentIndex(currentIndex + 1);
        }, 100);

        return () => clearTimeout(timer);
        }
    }, [currentIndex, lines]);

    return (
        <div>
        <h1>Read Test File</h1>
        <p>Current Position:</p>
        <p>{balls[0].position}</p>
        </div>
    );
};


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
export const ConnectedPositionLoader = connect(mapStateToProps)(PositionLoader);

    // const testFileContent = fs.readFileSync('test_file.txt', 'utf8');
    // const lines = testFileContent.split('\n');
    //
    // describe('Read Test File', () => {
    //     let currentIndex = 0;

    //     const readLine = () => {
    //         if (currentIndex < lines.length) {
    //             const line = lines[currentIndex++];
    //             const values = line.trim().split(/\s+/).map(parseFloat);
    //             //Set the values of position in the store
    //             store.dispatch({
    //                 type: mutations.SET_BALL_POSITION,
    //                 id: "M1",
    //                 position: `${values[0]} ${values[1]} ${values[2]}`,
    //             });

    //         setTimeout(readLine, 500); // Read the next line after 0.5 seconds
    //     }
    // };
    // //TO-DO: use this peoce of code to check the calculations when machine learning model is used. 
    // it('should read and update positions correctly', (done) => {
    //         this.timeout(lines.length * 550); // Adjust the timeout based on the number of lines

    //         readLine(); // Start reading lines

    //         setTimeout(() => {
    //         // Verify the final positions after all lines are read
    //         // assert.approximately(currentPosition.x, expectedX, 0.0001);
    //         // assert.approximately(currentPosition.y, expectedY, 0.0001);
    //         // assert.approximately(currentPosition.z, expectedZ, 0.0001);

    //         done();
    //         }, lines.length * 550); // Wait for enough time to read all lines
    //     });
    // });
