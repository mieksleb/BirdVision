/* eslint-disable default-case */
import { combineReducers } from 'redux';
import * as mutations from './mutations';

let defaultState = {
    balls: [
        {
            name: "TennisBall",
            id: "M1",
            path: "../models/tennis_ball.gltf",
            position: "0 0 0",
            positionHistory:[],
        }
    ],
    court: 
        {
            loading: true,
            percentage: 0,
        }

};

/** The reducer helps us manage the application state. It takes two areguements, current state and an action and returns a new state based on these arguements.  */
export const reducer = combineReducers({
    balls: (balls = defaultState.balls, action) => {
      switch (action.type) {
        case mutations.SET_STATE:
          return action.state.balls;
        case mutations.SET_BALL_POSITION: {
          return balls.map((ball) => {
            if (ball.id === action.id) {
              // Create a new position history array with the current position appended
              const positionHistory = [...ball.positionHistory, ball.position];
              // Return a new ball object with updated position and positionHistory
              return { ...ball, position: action.position, positionHistory };
            }
            return ball;
          });
        }
      }
      return balls;
    },

    court: (court = defaultState.court, action) => {
      switch (action.type) {
          case mutations.SET_STATE:
              return action.state.court;
          case mutations.SET_PERCENTAGE:
              return { ...court, percentage: action.percentage };
          case mutations.SET_LOADING:
              return { ...court, loading: action.loading };
      }
      return court;
  }
  });