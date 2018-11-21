import { GenericClassDecorator, Type, IReduxFlowModule } from './Types';

// tslint:disable-next-line
export const FlowModule = (
  options: IReduxFlowModule
): GenericClassDecorator<Type<any>> => {

  return (target: Type<any>) => {
    target.prototype.states = options.states || [];
    target.prototype.actions = options.actions || [];
  };

};
