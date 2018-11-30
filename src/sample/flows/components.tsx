import * as React from 'react';

import { getAction, getState, FlowConnection } from 'src/lib/rx-flow';
import {
  StageOneState,
  StageTwoState,
  StageThreeState,
  StageFourState,
  TestHttpState
} from './states';
import {
  StageOneActions,
  StageTwoActions,
  StageThreeActions,
  StageFourActions,
  TestHttpActions
} from './actions';
import { reduxflowApplication } from './main';

// --------------------------------------------------------------------
// --- COMPONENT FOR INITIAL ------------------------------------------
// --------------------------------------------------------------------
class InitialComponentProps {
  @getAction(StageOneActions) actions?: StageOneActions;
  @getState(StageOneState) stage?: StageOneState;
}
@FlowConnection({
  flow: reduxflowApplication,
  props: InitialComponentProps
})
export class InitialComponent extends React.Component<InitialComponentProps> {
  render() {
    return (
      <div className="flow-box">
        <strong>intial</strong>
        <p>started = {JSON.stringify(this.props.stage.isStarted)}</p>
        <p>
          <button onClick={this.start}>Start</button>
        </p>
      </div>
    );
  }
  start = () => {
    this.props.actions.start();
  };
}
// --------------------------------------------------------------------
// --- COMPONENT FOR STAGE ONE ----------------------------------------
// --------------------------------------------------------------------
class StageOneComponentProps {
  @getAction(StageOneActions) actions?: StageOneActions;
  @getState(StageOneState) stage?: StageOneState;
}
@FlowConnection({
  flow: reduxflowApplication,
  props: StageOneComponentProps
})
export class StageOneComponent extends React.Component<StageOneComponentProps> {
  render() {
    if (this.props.stage.isStarted) {
      return (
        <div className="flow-box">
          <strong>stage one</strong>
          <p>
            <button onClick={this.complete}>complete</button>
          </p>
        </div>
      );
    }
    return null;
  }
  complete = () => {
    this.props.actions.complete();
  };
}
// --------------------------------------------------------------------
// --- COMPONENT FOR STAGE TWO ----------------------------------------
// --------------------------------------------------------------------
class StageTwoComponentProps {
  @getAction(StageTwoActions) actions?: StageTwoActions;
  @getState(StageTwoState) stage?: StageTwoState;
}
@FlowConnection({
  flow: reduxflowApplication,
  props: StageTwoComponentProps
})
export class StageTwoComponent extends React.Component<StageTwoComponentProps> {
  render() {
    if (this.props.stage.isStarted) {
      return (
        <div className="flow-box">
          <strong>stage two</strong>
          <p>
            <button onClick={this.complete}>start a promise</button>
          </p>
          {this.props.stage.isLoading ? <p>Loading...</p> : null}
        </div>
      );
    }
    return null;
  }
  complete = () => {
    this.props.actions.startPromise();
  };
}
// --------------------------------------------------------------------
// --- COMPONENT FOR STAGE THREE --------------------------------------
// --------------------------------------------------------------------
class StageThreeComponentProps {
  @getAction(StageThreeActions) actions?: StageThreeActions;
  @getState(StageThreeState) stage?: StageThreeState;
  @getState(StageTwoState) previousStage?: StageTwoState;
}
@FlowConnection({
  flow: reduxflowApplication,
  props: StageThreeComponentProps
})
export class StageThreeComponent extends React.Component<
  StageThreeComponentProps
> {
  render() {
    if (this.props.stage.isStarted) {
      return (
        <div className="flow-box">
          <strong>stage three</strong>
          <p>Result from promise = {this.props.previousStage.response}</p>
          <p>Another action response = {this.props.stage.other}</p>
        </div>
      );
    }
    return null;
  }
}
// --------------------------------------------------------------------
// --- COMPONENT FOR STAGE FOUR --------------------------------------
// --------------------------------------------------------------------
class StageFourComponentProps {
  @getAction(StageFourActions) actions?: StageFourActions;
  @getState(StageFourState) stage?: StageFourState;
  @getState(StageThreeState) previousStage?: StageThreeState;
}
@FlowConnection({
  flow: reduxflowApplication,
  props: StageFourComponentProps
})
export class StageFourComponent extends React.Component<
  StageFourComponentProps
> {
  render() {
    if (this.props.previousStage.other) {
      return (
        <div className="flow-box">
          <strong>stage four</strong>
          <p>Based on FlowActionsPromised</p>
          <p>
            <button onClick={this.start}>start a promise</button>
          </p>
          <p>
            <button onClick={this.startWithError}>start with error</button>
          </p>
          <hr />
          <p>Result = {JSON.stringify(this.props.stage.response)}</p>
          <p>Error = {JSON.stringify(this.props.stage.error)}</p>
        </div>
      );
    }
    return null;
  }
  start = () => {
    this.props.actions.start('OK from stage 4', false);
  };
  startWithError = () => {
    this.props.actions.start('Error from stage 4', true);
  };
}
// --------------------------------------------------------------------
// --- COMPONENT FOR STAGE HTTP ---------------------------------------
// --------------------------------------------------------------------
class StageHttpComponentProps {
  @getAction(TestHttpActions) actions?: TestHttpActions;
  @getState(TestHttpState) stage?: TestHttpState;
}
@FlowConnection({
  flow: reduxflowApplication,
  props: StageHttpComponentProps
})
export class StageHttpComponent extends React.Component<
  StageHttpComponentProps
> {
  render() {
    return (
      <div className="flow-box">
        <p>Based on FlowActionsHttpRequest</p>
        <p>
          <button onClick={this.request}>request</button>
          <button onClick={this.request400}>error 400</button>
          <button onClick={this.request999}>error 999</button>
        </p>
        {this.renderResponse()}
        {this.renderError()}
      </div>
    );
  }

  renderResponse() {
    const { isCompleted, response } = this.props.stage;
    if (isCompleted) {
      return (
        <div>
          <p>Response OK</p>
          <p>Status = {response.status}</p>
          <p>Data = {JSON.stringify(response.data)}</p>
        </div>
      );
    }
    return null;
  }

  renderError() {
    const { isFailed, error } = this.props.stage;
    if (isFailed) {
      if (error.response) {
        return (
          <div>
            <p>Response NOK</p>
            <p>Status = {error.response.status}</p>
            <p>Error = {JSON.stringify(error.response.data)}</p>
          </div>
        );
      }
      return (
        <div>
          <p>Response Can't be Reached</p>
          <p>Fail to request on {error.config.url}</p>
        </div>
      );
    }
    return null;
  }

  request = () => {
    this.props.actions.request();
  };

  request400 = () => {
    this.props.actions.request(400);
  };

  request999 = () => {
    this.props.actions.request(999);
  };
}
