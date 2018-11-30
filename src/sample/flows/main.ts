import { FlowMapper, FlowModule } from 'src/lib/rx-flow';
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
  Stage5Actions,
  TestHttpActions
} from './actions';
// --------------------------------------------------------------------
// --- MODULES --------------------------------------------------------
// --------------------------------------------------------------------
@FlowModule({
  states: [
    StageOneState,
    StageTwoState,
    StageThreeState,
    StageFourState,
    TestHttpState
  ],
  actions: [
    StageOneActions,
    StageTwoActions,
    StageThreeActions,
    StageFourActions,
    Stage5Actions,
    TestHttpActions
  ]
})
export class MainModule {}
// --------------------------------------------------------------------
// --- REDUX FLOW -----------------------------------------------------
// --------------------------------------------------------------------
export const reduxflowApplication = new FlowMapper({
  devExtension: true,
  modules: [MainModule]
});
