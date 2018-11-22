import { FlowMapper, FlowModule } from 'src/lib/rx-flow';
import {
  StageOneState,
  StageTwoState,
  StageThreeState,
  StageFourState
} from './states';
import {
  StageOneActions,
  StageTwoActions,
  StageThreeActions,
  StageFourActions,
  Stage5Actions
} from './actions';
// --------------------------------------------------------------------
// --- MODULES --------------------------------------------------------
// --------------------------------------------------------------------
@FlowModule({
  states: [StageOneState, StageTwoState, StageThreeState, StageFourState],
  actions: [
    StageOneActions,
    StageTwoActions,
    StageThreeActions,
    StageFourActions,
    Stage5Actions
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
