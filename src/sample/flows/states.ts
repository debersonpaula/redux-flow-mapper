import { FlowState } from 'src/lib/rx-flow';
import { FlowPromiseState } from 'src/lib/rx-flow/tools/ReduxPromised';

// --------------------------------------------------------------------
// --- STAGE 1 --------------------------------------------------------
// --------------------------------------------------------------------
@FlowState({
  name: 'stage1'
})
export class StageOneState {
  isStarted = false;
  isCompleted = false;
}

// --------------------------------------------------------------------
// --- STAGE 2 --------------------------------------------------------
// --------------------------------------------------------------------
@FlowState({
  name: 'stage2'
})
export class StageTwoState {
  isStarted = false;
  isLoading = false;
  isCompleted = false;
  response = '';
}
// --------------------------------------------------------------------
// --- STAGE 3 --------------------------------------------------------
// --------------------------------------------------------------------
@FlowState({
  name: 'stage3'
})
export class StageThreeState {
  isStarted = false;
  other = '';
}
// --------------------------------------------------------------------
// --- STAGE 4 --------------------------------------------------------
// --------------------------------------------------------------------
@FlowState({
  name: 'stage4'
})
export class StageFourState extends FlowPromiseState<any, any> {
}
