import { store } from '../../../store/index';
import fs from 'fs';
//import { assert } from 'chai';
import * as mutations from '../../../store/mutations';

const testFileContent = fs.readFileSync('test_file.txt', 'utf8');
const lines = testFileContent.split('\n');

describe('Read Test File', () => {
    let currentIndex = 0;

    const readLine = () => {
        if (currentIndex < lines.length) {
            const line = lines[currentIndex++];
            const values = line.trim().split(/\s+/).map(parseFloat);
            //Set the values of position in the store
            store.dispatch({
                type: mutations.SET_BALL_POSITION,
                id: "M1",
                position: `${values[0]} ${values[1]} ${values[2]}`,
            });

        setTimeout(readLine, 500); // Read the next line after 0.5 seconds
    }
};
//TO-DO: use this peoce of code to check the calculations when machine learning model is used. 
it('should read and update positions correctly', (done) => {
        this.timeout(lines.length * 550); // Adjust the timeout based on the number of lines

        readLine(); // Start reading lines

        setTimeout(() => {
        // Verify the final positions after all lines are read
        // assert.approximately(currentPosition.x, expectedX, 0.0001);
        // assert.approximately(currentPosition.y, expectedY, 0.0001);
        // assert.approximately(currentPosition.z, expectedZ, 0.0001);

        done();
        }, lines.length * 550); // Wait for enough time to read all lines
    });
});
