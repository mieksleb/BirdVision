import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'

import { reducer } from './reducer'

/** Store of the saved data to be introduced on reload.*/
export const store = createStore(
reducer,
);

