import { FlowState } from 'src/lib/rx-flow';
import { FlowPromiseState } from 'src/lib/rx-flow/tools/ReduxPromised';
import { FlowHttpState } from 'src/lib/rx-flow/tools/ReduxHttp';

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
export class StageFourState extends FlowPromiseState<string, any> {
}
// --------------------------------------------------------------------
// --- STAGE HTTP -----------------------------------------------------
// --------------------------------------------------------------------
@FlowState({
  name: 'testhttp'
})
export class TestHttpState extends FlowHttpState<any> {
}

