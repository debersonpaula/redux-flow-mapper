import * as React from 'react';

import { getAction, getState, FlowConnection } from 'src/lib/rx-flow';
import { StageOneState, StageTwoState, StageThreeState } from './states';
import { StageOneActions, StageTwoActions, StageThreeActions } from './actions';
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
        <p><button onClick={this.start}>Start</button></p>
      </div>
    );
  }
  start = () => {
    this.props.actions.start();
  }
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
          <p><button onClick={this.complete}>complete</button></p>
        </div>
      );
    }
    return null;
  }
  complete = () => {
    this.props.actions.complete();
  }
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
          <p><button onClick={this.complete}>start a promise</button></p>
          {this.props.stage.isLoading ? <p>Loading...</p> : null}
        </div>
      );
    }
    return null;
  }
  complete = () => {
    this.props.actions.startPromise();
  }
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
export class StageThreeComponent extends React.Component<StageThreeComponentProps> {
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