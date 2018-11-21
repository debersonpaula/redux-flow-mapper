import { FlowActions, getState, getTrigger } from 'src/lib/rx-flow';
import { StageOneState, StageTwoState, StageThreeState } from './states';

// --------------------------------------------------------------------
// --- ACTIONS FOR STAGE 1 --------------------------------------------
// --------------------------------------------------------------------
@FlowActions({
  name: 'stage1.actions'
})
export class StageOneActions {
  @getState(StageOneState)
  start = () => (state: StageOneState): StageOneState => {
    return { ...state, isStarted: true };
  };

  @getState(StageOneState)
  complete = () => (state: StageOneState): StageOneState => {
    return { ...state, isCompleted: true };
  };
}
// --------------------------------------------------------------------
// --- ACTIONS FOR STAGE 2 --------------------------------------------
// --------------------------------------------------------------------
@FlowActions({
  name: 'stage2.actions'
})
export class StageTwoActions {
  @getState(StageTwoState)
  start = () => (state: StageTwoState): StageTwoState => {
    return { ...state, isStarted: true };
  };

  @getTrigger(StageOneState, StageOneActions, 'complete')
  checkIfStageOneIsFinished = (
    previous: StageOneState,
    state: StageOneState
  ) => {
    if (!previous.isCompleted && state.isCompleted) {
      this.start();
    }
  };

  /**
   * Start a Promise and listen to event
   */
  startPromise() {
    this.loading();
    const promisedAction = new Promise<string>(resolve => {
      setTimeout(() => {
        resolve('response from promise');
      }, 2000);
    });

    promisedAction.then(response => {
      this.completed(response);
    });
  }

  @getState(StageTwoState)
  loading = () => (state: StageTwoState): StageTwoState => {
    return { ...state, isLoading: true };
  };

  @getState(StageTwoState)
  completed = (promiseResponse: string) => (state: StageTwoState): StageTwoState => {
    return { ...state, isLoading: false, isCompleted: true, response: promiseResponse };
  };
}
// --------------------------------------------------------------------
// --- ACTIONS FOR STAGE 3 --------------------------------------------
// --------------------------------------------------------------------
@FlowActions({
  name: 'stage3.actions'
})
export class StageThreeActions {
  @getTrigger(StageTwoState, StageTwoActions, 'completed')
  checkIfStageTwoIsFinished = (
    previous: StageTwoState,
    state: StageTwoState
  ) => {
    if (!previous.isCompleted && state.isCompleted) {
      this.start();
      this.other();
    }
  };

  @getState(StageThreeState)
  start = () => (state: StageThreeState): StageThreeState => {
    return { ...state, isStarted: true };
  };

  @getState(StageThreeState)
  other = () => (state: StageThreeState): StageThreeState => {
    return { ...state, other: 'another action response' };
  };
}