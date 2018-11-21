import {
  GenericClassDecorator,
  Type,
  ENUM_PROPERTY_NAME,
  IReduxFlowState,
} from './Types';
import 'reflect-metadata';

// tslint:disable-next-line
export const FlowState = (
  options: IReduxFlowState
): GenericClassDecorator<Type<any>> => {
  return (target: Type<any>) => {
    // define name of state
    Reflect.defineMetadata(ENUM_PROPERTY_NAME, options.name, target);
  };
};
