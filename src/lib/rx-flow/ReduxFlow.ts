import { Store, createStore, combineReducers } from 'redux';
import 'reflect-metadata';
import {
  ENUM_PROPERTY_NAME,
  IReduxFlowOptions,
  IReducerActions,
  IReduxFlowMapper,
  getComponentProps,
  ComponentProps,
  IDispatchAction,
  IReduxFlowModule,
  Type,
  ENUM_FLOW_STATE,
  ENUM_FLOW_TRIGGER
} from './Types';
import { BehaviorSubject } from 'rxjs';
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
export class FlowMapper implements IReduxFlowMapper {
  private options: IReduxFlowOptions;
  private pStore: Store;

  private pModules: IReduxFlowModule[] = [];
  private pStates: any[] = [];
  private pActions: Object[] = [];
  private pReducerActions: IReducerActions = {};

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  /**
   * Create Flow Mapper to manage stores, reducers and actions
   * @param options options to initialize the flow mapper
   */
  constructor(options: IReduxFlowOptions) {
    this.options = options;

    // create basic store
    if (options.devExtension) {
      this.pStore = createStore(() => {},
      window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']());
    } else {
      this.pStore = createStore(() => {});
    }

    // create modules
    this.pModules = createModules(this.options.modules);

    // create states
    this.pStates = createStates(this.pModules);

    // create actions
    this.pActions = createActions(this.pModules);

    // generate methods and dispatchers
    createMethods(this.pActions, this, this.pReducerActions);

    // generate triggers
    createTriggers(this.pActions, this, this.pReducerActions);
  }
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  /**
   * Returns the store for redux provider
   */
  createStore(): Store {
    // apply reducers included + flow reducers
    const reducers = combineReducers({
      ...this.options.include,
      ...this.getReducers()
    });

    // apply to store
    this.pStore.replaceReducer(reducers);

    return this.pStore;
  }
  // --------------------------------------------------------------------
  // --- EXPOSED PROPERTIES ---------------------------------------------
  // --------------------------------------------------------------------
  /**
   * get current store
   */
  get store(): Store {
    return this.pStore;
  }

  /**
   * get action by type class
   */
  actionByType(type: any) {
    for (let i = 0; i < this.pActions.length; i += 1) {
      if (type === this.pActions[i].constructor) {
        return this.pActions[i];
      }
    }
    return undefined;
  }

  /**
   * get state name by type class
   */
  stateNameByType(type: any) {
    for (let i = 0; i < this.pStates.length; i += 1) {
      if (type === this.pStates[i].constructor) {
        // extract name from state constructor
        const name = Reflect.getMetadata(
          ENUM_PROPERTY_NAME,
          this.pStates[i].constructor
        );
        return name;
      }
    }
    return undefined;
  }

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  /**
   * Get list of reducers imported by options.flowReducers
   */
  private getReducers() {
    const reducers = {};

    // generate reducers states
    this.pStates.forEach(state => {
      // extract name from state constructor
      const stateName = Reflect.getMetadata(
        ENUM_PROPERTY_NAME,
        state.constructor
      );
      reducers[stateName] = (currentState = state, action: IDispatchAction) => {
        const reducerAction = this.pReducerActions[stateName];
        if (reducerAction) {
          const reducerDispatcher = reducerAction[action.type];
          const args = action.args;
          if (reducerDispatcher) {
            const newState = reducerDispatcher.handler(...args)(currentState);
            // send onDispatched event
            reducerDispatcher.onDispatched.next({
              newState,
              previousState: currentState
            });
            return newState;
          }
        }
        // default action
        return currentState;
      };
    });

    return reducers;
  }
}
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
/**
 * extract methods name from object
 * @param obj
 * OBSOLETE
 */
// function getMethodsName(obj: Object) {
//   let props = [];

//   do {
//     props = props.concat(Object.getOwnPropertyNames(obj));
//   } while (obj === Object.getPrototypeOf(obj));

//   return props.sort().filter((e, i, arr) => {
//     if (e !== arr[i + 1] && typeof obj[e] === 'function') return true;
//   });
// }
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
/**
 * Generate modules list
 * @param modules module class array
 */
function createModules(moduleClasses: Type<any>[]): IReduxFlowModule[] {
  return moduleClasses.map(module => new module());
}

/**
 * Generate state list
 * @param modules flow modules list
 */
function createStates(modules: IReduxFlowModule[]): any[] {
  const list = [];
  modules.forEach(mod => {
    mod.states.forEach(state => {
      list.push(new state());
    });
  });
  return list;
}

/**
 * Generate actions list
 * @param modules flow modules list
 */
function createActions(modules: IReduxFlowModule[]): any[] {
  const list = [];
  modules.forEach(mod => {
    mod.actions.forEach(action => {
      list.push(new action());
    });
  });
  return list;
}

/**
 * Generate methods and dispatchers
 * @param actions
 * @param reduxflow
 * @param reducerActions
 * @param store
 */
function createMethods(
  actions: Object[],
  reduxflow: FlowMapper,
  reducerActions: IReducerActions
) {
  actions.forEach(action => {
    // get constructor
    const actionConstructor = action.constructor;
    // get prefix from created action
    const prefix = Reflect.getMetadata(ENUM_PROPERTY_NAME, actionConstructor);
    // extract props name from action
    const actionProps: ComponentProps = getComponentProps(actionConstructor);
    // get all method name from action
    const methodNames = Object.keys(actionProps);

    methodNames.forEach(method => {
      // check if method request state
      if (actionProps[method].flowType === ENUM_FLOW_STATE) {
        // create dispatcher type name
        const actionDispatchName = `${prefix}.${method}`;
        // keep current handler
        const stateHandler = action[method];
        // get state name from reduxflow
        const stateName = reduxflow.stateNameByType(actionProps[method].type);
        // create reducer state if not exists
        if (!reducerActions[stateName]) {
          reducerActions[stateName] = {};
        }
        // assign handler
        reducerActions[stateName][actionDispatchName] = {
          handler: stateHandler,
          onDispatched: new BehaviorSubject<any>(undefined)
        };
        // associate action with dispatcher
        action[method] = (...args) => {
          const actionDispatchObject = {
            args,
            type: actionDispatchName
          };
          reduxflow.store.dispatch(actionDispatchObject);
        };
      }
    });
  });
}

function createTriggers(
  actions: any[],
  reduxflow: FlowMapper,
  reducerActions: IReducerActions
) {
  actions.forEach(action => {
    // get constructor
    const actionConstructor = action.constructor;
    // extract props name from action
    const actionProps: ComponentProps = getComponentProps(actionConstructor);
    // get all method name from action
    const methodNames = Object.keys(actionProps);

    methodNames.forEach(method => {
      if (actionProps[method].flowType === ENUM_FLOW_TRIGGER) {
        // get state name from reduxflow
        const stateName = reduxflow.stateNameByType(actionProps[method].type);
        // get handler from action
        const triggerHandler = action[method];

        // extract action and method name from props
        const { actionType, methodName } = actionProps[method].data;
        const targetPrefix = Reflect.getMetadata(ENUM_PROPERTY_NAME, actionType);
        const dispatcherName = `${targetPrefix}.${methodName}`;
        const targetAction = reducerActions[stateName][dispatcherName];

        // execute target trigger
        if (targetAction) {
          let dispatchedAction;
          // observe the target action if dispatch
          targetAction.onDispatched.subscribe(done => {
            if (done) {
              dispatchedAction = done;
            }
          });
          // observe store is changed
          reduxflow.store.subscribe(() => {
            if (dispatchedAction) {
              // get state changes
              const done = Object.assign({}, dispatchedAction);
              // clear action for the next observers
              dispatchedAction = undefined;
              // trigger events
              triggerHandler(done.previousState, done.newState);
            }
          });
        }
      }
    });
  });
}
