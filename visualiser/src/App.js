import React from 'react';
import { Provider } from 'react-redux';
import {ConnectedCreateVisualiser} from './Components/Visualiser'
import { store } from './store';
import { ConnectedPositionLoader } from './Components/modeldata/FilePositions';



const App = () => {

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ConnectedPositionLoader />
        <ConnectedCreateVisualiser />
      </Provider>
    </React.StrictMode>
  );
};

export default App;
