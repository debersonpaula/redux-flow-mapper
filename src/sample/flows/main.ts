import { FlowMapper, FlowModule } from 'src/lib/rx-flow';
import { StageOneState, StageTwoState, StageThreeState, StageFourState } from './states';
import { StageOneActions, StageTwoActions, StageThreeActions, StageFourActions } from './actions';
// --------------------------------------------------------------------
// --- MODULES --------------------------------------------------------
// --------------------------------------------------------------------
@FlowModule({
  states: [StageOneState, StageTwoState, StageThreeState, StageFourState],
  actions: [StageOneActions, StageTwoActions, StageThreeActions, StageFourActions]
})
export class MainModule {}
// --------------------------------------------------------------------
// --- REDUX FLOW -----------------------------------------------------
// --------------------------------------------------------------------
export const reduxflowApplication = new FlowMapper({
  devExtension: true,
  modules: [MainModule]
});