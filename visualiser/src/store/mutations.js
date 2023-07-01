export const SET_STATE = `SET_STATE`;
export const SET_BALL_POSITION = `SET_BALL_POSITION`; //position of the ball
export const SET_PERCENTAGE = `SET_PERCENTAGE`; // percentage loaded
export const SET_LOADING = 'SET_LOADING';

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
        position,
    }
}

export const setPercentage = (id, percentage) => {
    return {
        type: SET_PERCENTAGE,
        id: id,
        percentage,
    }

}

export const setLoading = (loading) => ({
    type: SET_LOADING,
    loading
});




