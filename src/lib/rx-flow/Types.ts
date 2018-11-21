import { Store } from 'redux';
import { BehaviorSubject } from 'rxjs';

/**
 * Type for what object is instances of
 */
export interface Type<T> {
  new (...args: any[]): T;
}

/**
 * Generic `ClassDecorator` type
 */
export type GenericClassDecorator<T> = (target: T) => void;

// enumerators types
export const ENUM_FLOW_STATE = 'ENUM_FLOW_STATE';
export const ENUM_FLOW_ACTION = 'ENUM_FLOW_ACTION';
export const ENUM_FLOW_TRIGGER = 'ENUM_FLOW_TRIGGER';

// enumerators for properties
export const ENUM_PROPERTY_NAME = '___NAME';
export const ENUM_PROPERTY_TYPE = '___TYPE';

// enumerators for decorators
export const ENUM_PROPS_KEY = 'reduxflow:conn-props';

// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
export interface IReduxFlowOptions {
  /**
   * include devtools extension for browser debug
   */
  devExtension?: boolean;

  /**
   * include other reducers
   */
  include?: any;

  /**
   * import flow modules
   */
  modules?: any[];
}
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
export interface IReduxFlowConnection {
  /**
   * Flow object to be used as map
   */
  flow?: IReduxFlow;

  /**
   * Properties class
   */
  props?: any;
}
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
export interface IReduxFlowState {
  /**
   * Name of state in the reducer store
   */
  name: string;
}
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
export interface IReduxFlowAction {
  /**
   * Name of action to be used as prefix
   */
  name: string;
}
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
export interface IReduxFlowModule {
  /**
   * import flow reducers
   */
  states?: any[];

  /**
   * import flow actions
   */
  actions?: any[];
}
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
export interface IReduxFlow {
  createStore(): Store;
  actionByType(type: any): any;
  stateNameByType(type: any): any;
  store: Store;
}
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
export type IReducerActions = { [stateName: string]: IReducerAction };
export type IReducerAction = { [actionName: string]: IReducerOption };
export interface IReducerOption {
  handler: (...args: any[]) => (state: any) => any;
  onDispatched: BehaviorSubject<IDispatchSubject>;
}
interface IDispatchSubject {
  previousState: any;
  newState: any;
}
// --------------------------------------------------------------------
// --- SUPPORT FUNCTIONS FOR DECORATORS -------------------------------
// --------------------------------------------------------------------
export interface ComponentPropInfo {
  key: string;
  type: Function;
  flowType: string;
  data?: any;
}
export interface ComponentProps {
  [k: string]: ComponentPropInfo;
}
export function getComponentProps(ctor: {
  prototype: any;
}): ComponentProps | undefined {
  return Reflect.getMetadata(ENUM_PROPS_KEY, ctor.prototype);
}
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
export interface IDispatchAction {
  type: string;
  args: any[];
}
