import * as React from 'react';
import './styles.scss';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { reduxflowApplication } from './flows/main';
import { StageOneComponent, InitialComponent, StageTwoComponent, StageThreeComponent, StageFourComponent } from './flows/components';

export class App extends React.Component {
  public render() {
    return (
      <HashRouter>
        <Provider store={reduxflowApplication.createStore()}>
          <div className="redux-maps">
            <InitialComponent />
            <StageOneComponent />
            <StageTwoComponent />
            <StageThreeComponent />
            <StageFourComponent />
          </div>
        </Provider>
      </HashRouter>
    );
  }
}
