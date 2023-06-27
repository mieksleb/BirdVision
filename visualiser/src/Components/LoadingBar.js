import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import './LoadingBar.css';

const ConnectedLoadingBar = ({percentage}) => {
    var show = percentage === 100 ? false : true;
    const toggleClassName = show ? "loading-bar-modal display-block" : "modal display-none"
    return (
      <div className={toggleClassName}>
        <div className="loading-bar-container">
          <div className="loading-bar-progress" style={{ '--progress': `${percentage}%` }}></div>
          <div className="loading-bar-text">{`${percentage}%`}</div>
        </div>
      </div>
  );
};


/** Export to initialise the Sensor Config Tab */
//export const ConnectedLoadingBar = connect(mapStateToProps)(LoadingBar);

export default ConnectedLoadingBar;