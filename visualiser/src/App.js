import React from 'react';
import { Provider } from 'react-redux';
import {ConnectedCreateVisualiser} from './Components/Visualiser'
import { store } from './store';



const App = () => {
  const ball = {
    position: { x: 0, y: 0, z: 0 },
  };

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ConnectedCreateVisualiser {...ball} />
      </Provider>
    </React.StrictMode>
  );
};

export default App;
