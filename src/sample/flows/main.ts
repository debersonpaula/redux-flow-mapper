import { FlowMapper, FlowModule } from 'src/lib/rx-flow';
import { StageOneState, StageTwoState, StageThreeState } from './states';
import { StageOneActions, StageTwoActions, StageThreeActions } from './actions';
// --------------------------------------------------------------------
// --- MODULES --------------------------------------------------------
// --------------------------------------------------------------------
@FlowModule({
  states: [StageOneState, StageTwoState, StageThreeState],
  actions: [StageOneActions, StageTwoActions, StageThreeActions]
})
export class MainModule {}
// --------------------------------------------------------------------
// --- REDUX FLOW -----------------------------------------------------
// --------------------------------------------------------------------
export const reduxflowApplication = new FlowMapper({
  devExtension: true,
  modules: [MainModule]
});