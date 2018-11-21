import {
  GenericClassDecorator,
  Type,
  ENUM_PROPERTY_NAME,
  IReduxFlowAction
} from './Types';
import 'reflect-metadata';

// tslint:disable-next-line
export const FlowActions = (
  options: IReduxFlowAction
): GenericClassDecorator<Type<any>> => {
  return (target: Type<any>) => {
    // define name and type of state
    Reflect.defineMetadata(ENUM_PROPERTY_NAME, options.name, target);
  };
};
