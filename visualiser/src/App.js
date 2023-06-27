import React from 'react';
import { Provider } from 'react-redux';
import {ConnectedCreateVisualiser} from './Components/Visualiser'
import { store } from './store';
import { ConnectedPositionLoader } from './Components/modeldata/FilePositions';
import LoadingBar from './Components/LoadingBar';


const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ConnectedPositionLoader />
        {/* <LoadingBar /> */}
        <ConnectedCreateVisualiser />
      </Provider>
    </React.StrictMode>
  );
};

export default App;
