import {
  GenericClassDecorator,
  Type,
  ENUM_PROPS_KEY,
  ENUM_FLOW_ACTION,
  ENUM_FLOW_STATE,
  ENUM_FLOW_TRIGGER,
  IReduxFlowConnection,
  ComponentProps,
  ComponentPropInfo,
  getComponentProps
} from './Types';
import { connect } from 'react-redux';
import 'reflect-metadata';
// ----------------------------------------------------------------------------
// --- CONNECTOR DECORATOR ----------------------------------------------------
// ----------------------------------------------------------------------------
/**
 * Decorate a React Component to connect to the Redux Store
 * @param options
 */
// tslint:disable-next-line
export const FlowConnection = (
  options?: IReduxFlowConnection
): GenericClassDecorator<Type<any>> => {
  const componentStatePropsKeys = {};
  const componentActionProps = {};

  // get connector properties
  const props = getComponentProps(options.props);

  // run all keys in properties and assign action and state to component props
  for (const key in props) {
    if (props[key].flowType === ENUM_FLOW_ACTION) {
      componentActionProps[key] = options.flow.actionByType(props[key].type);
    } else if (props[key].flowType === ENUM_FLOW_STATE) {
      const state = options.flow.stateNameByType(props[key].type);
      componentStatePropsKeys[key] = data => data[state];
    }
  }

  // create component connected to the redux store
  const component = (target: Type<any>) => {
    const conn: any = connect(
      data =>
        Object.keys(componentStatePropsKeys).reduce((total, key) => {
          total[key] = componentStatePropsKeys[key](data);
          return total;
        }, {}),
      () => componentActionProps
    )(target);

    return conn;
  };

  return component;
};
// ----------------------------------------------------------------------------
// --- SUPPORT DECORATORS -----------------------------------------------------
// ----------------------------------------------------------------------------
function setConnProp(flowType: string, type: any, data?: any) {
  return function(target: any, key: string): void {
    // define metadata if not exists
    if (!Reflect.hasMetadata(ENUM_PROPS_KEY, target)) {
      Reflect.defineMetadata(ENUM_PROPS_KEY, {}, target);
    }
    // get connection props from target
    const connProps: ComponentProps = Reflect.getMetadata(
      ENUM_PROPS_KEY,
      target
    );
    // define info for prop
    const props: ComponentPropInfo = {
      key,
      type,
      flowType,
      data
    };
    // copy prop to connection properties
    connProps[key] = Object.assign({}, props);
  };
}
/**
 * Decorate a property and set to get an Action
 */
export function getAction(actionType: Type<any>) {
  return setConnProp(ENUM_FLOW_ACTION, actionType);
}
/**
 * Decorate a property or method and set to get a State
 */
export function getState(stateType: Type<any>) {
  return setConnProp(ENUM_FLOW_STATE, stateType);
}
/**
 * Decorate a method and set to get a Trigger
 */
export function getTrigger(
  stateType: Type<any>,
  actionType: Type<any>,
  methodName: string
) {
  return setConnProp(ENUM_FLOW_TRIGGER, stateType, { actionType, methodName });
}
