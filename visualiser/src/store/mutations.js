export const SET_STATE = `SET_STATE`;
export const SET_BALL_POSITION = `SET_BALL_POSITION`; //position of the IMU/Sensor/GNSS

/**
 * Mutation to set the state of the session. 
 * @param {any} state
 */
export const setState = (state = {}) => ({
    type: SET_STATE,
    state
});


export const setBallPosition = (id, position) => {
    return {
        type: SET_BALL_POSITION,
        id: id,
        position
    }
}

