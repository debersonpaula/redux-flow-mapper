import { getState } from '../ReduxFlowConnector';
import { IReduxFlowAction, GenericClassDecorator, Type, ENUM_PROPERTY_NAME } from '../Types';

interface IPromiseState<Response, Error> {
  /**
   * set to true when Promise is on going
   */
  isLoading: boolean;

  /**
   * set to true when Promise is done
   */
  isCompleted: boolean;

  /**
   * set to true when Promise is failed
   */
  isFailed: boolean;

  /**
   * contains the object from Promise's then
   */
  response?: Response;

  /**
   * contains the object from Promise's catch
   */
  error?: Error;
}

/**
 * Class to be extended for states based on Promise
 */
export class FlowPromiseState<Response, Error>
  implements IPromiseState<Response, Error> {
  isLoading = false;
  isCompleted = false;
  isFailed = false;
  response = undefined;
  error = undefined;
}

export class FlowPromiseActions {
  /**
   * Define the Promise handler to be executed and listened in the start event
   */
  promise: (...args) => Promise<any> = () => Promise.resolve({});

  /**
   * Start a Promise and listen to event
   */
  start(...args) {
    if (this.promise) {
      this.loading();
      this.promise(...args)
        .then(response => this.completed(response))
        .catch(error => this.failed(error));
    }
  }

  private loading = () => (state) => {
    return {
      ...state,
      isLoading: true,
      isCompleted: false,
      isFailed: false,
      response: undefined,
      error: undefined
    };
  };

  private completed = (promiseResponse: any) => (state) => {
    return {
      ...state,
      isLoading: false,
      isCompleted: true,
      isFailed: false,
      response: promiseResponse,
      error: undefined
    };
  };

  private failed = (promiseError: any) => (state) => {
    return {
      ...state,
      isLoading: false,
      isCompleted: false,
      isFailed: true,
      response: undefined,
      error: promiseError
    };
  };
}

// tslint:disable-next-line
export const FlowActionsPromised = (
  options: IReduxFlowActionPromised
): GenericClassDecorator<Type<any>> => {
  return (target: Type<any>) => {
    // define name and type of state
    Reflect.defineMetadata(ENUM_PROPERTY_NAME, options.name, target);
  };
};
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
export interface IReduxFlowActionPromised {
  /**
   * Name of action to be used as prefix
   */
  name: string;

  /**
   * State class to be reference
   */
  state: Type<any>;
}
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
