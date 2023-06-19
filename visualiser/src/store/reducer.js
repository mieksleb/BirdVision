/* eslint-disable default-case */
import { combineReducers } from 'redux';
import * as mutations from './mutations';

let defaultState = {
    balls: [
        {
            name: "TennisBall",
            id: "M1",
            path: "../models/TennisBall.glb",
            position: "0 0 0",
        }
    ],
};

/** The reducer helps us manage the application state. It takes rtwo areguements, current state and an action and returns a new state based on these arguements.  */
export const reducer = combineReducers({
    balls:(balls = defaultState.balls, action)=>{
        switch (action.type) {
            case mutations.SET_STATE:
                return action.state.balls;
            case mutations.SET_BALL_POSITION:
            {
                return balls.map(ball => {
                    return (ball.id === action.id) ? { ...ball, position: action.position } : {ball};
                });
            };
        }
        return balls;
    }
});