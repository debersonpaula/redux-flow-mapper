import { FlowActions, getState, getTrigger } from 'src/lib/rx-flow';
import { StageOneState, StageTwoState } from './states';

// --------------------------------------------------------------------
// --- ACTIONS FOR STAGE 1 --------------------------------------------
// --------------------------------------------------------------------
@FlowActions({
  name: 'stage1.actions'
})
export class StageOneActions {
  @getState(StageOneState)
  start = () => (previousState: StageOneState): StageOneState => {
    return { ...previousState, isStarted: true };
  };

  @getState(StageOneState)
  complete = () => (previousState: StageOneState): StageOneState => {
    return { ...previousState, isCompleted: true };
  };

  @getState(StageOneState)
  other = () => (previousState: StageOneState): StageOneState => {
    return previousState;
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
  start = () => (previousState: StageTwoState): StageTwoState => {
    return { ...previousState, isStarted: true };
  };

  @getTrigger(StageOneState, StageOneActions, 'complete')
  checkIfStageOneIsFinished = (
    previousState: StageOneState,
    state: StageOneState
  ) => {
    if (!previousState.isCompleted && state.isCompleted) {
      this.start();
    }
  };
}
