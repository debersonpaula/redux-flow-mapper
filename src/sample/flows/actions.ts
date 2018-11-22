import { FlowActions, getState, getTrigger } from 'src/lib/rx-flow';
import {
  StageOneState,
  StageTwoState,
  StageThreeState,
  StageFourState
} from './states';
import {
  FlowPromiseActions,
  FlowActionsPromised
} from 'src/lib/rx-flow/tools/ReduxPromised';

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
      }, 200);
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
  completed = (promiseResponse: string) => (
    state: StageTwoState
  ): StageTwoState => {
    return {
      ...state,
      isLoading: false,
      isCompleted: true,
      response: promiseResponse
    };
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
// --------------------------------------------------------------------
// --- ACTIONS FOR STAGE 4 --------------------------------------------
// --------------------------------------------------------------------
@FlowActionsPromised({
  name: 'stage4.actions',
  state: StageFourState
})
export class StageFourActions implements FlowPromiseActions {
  start(request: string, error: boolean) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (error) {
          reject('error from stage 4');
        } else {
          resolve({ request });
        }
      }, 2500);
    });
  }
}
// --------------------------------------------------------------------
// --- ACTIONS FOR STAGE 5 --------------------------------------------
// --------------------------------------------------------------------
@FlowActions({
  name: 'stage5.actions'
})
export class Stage5Actions {
  @getTrigger(StageFourState, StageFourActions, 'completed')
  checkIsComplete = (
    previous: StageFourState,
    state: StageFourState
  ) => {
    if (!previous.isCompleted && state.isCompleted) {
      console.log('isCompleted ok');
    }
  };

  @getTrigger(StageFourState, StageFourActions, 'failed')
  checkIsFailed = (
    previous: StageFourState,
    state: StageFourState
  ) => {
    if (!previous.isFailed && state.isFailed) {
      console.log('isFailed ok');
    }
  };
}
