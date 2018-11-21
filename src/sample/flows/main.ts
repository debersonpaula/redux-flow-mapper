import { ReduxFlow, FlowModule } from 'src/lib/rx-flow';
import { StageOneState, StageTwoState } from './states';
import { StageOneActions, StageTwoActions } from './actions';
// --------------------------------------------------------------------
// --- MODULES --------------------------------------------------------
// --------------------------------------------------------------------
@FlowModule({
  states: [StageOneState, StageTwoState],
  actions: [StageOneActions, StageTwoActions]
})
export class MainModule {}
// --------------------------------------------------------------------
// --- REDUX FLOW -----------------------------------------------------
// --------------------------------------------------------------------
export const reduxflowApplication = new ReduxFlow({
  devExtension: true,
  modules: [MainModule]
});

// reduxflowApplication.store.subscribe(()=>{
//   console.log('subscribe', reduxflowApplication.store.getState());
// });