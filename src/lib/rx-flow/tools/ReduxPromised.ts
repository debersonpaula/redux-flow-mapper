import {
  GenericClassDecorator,
  Type,
  ENUM_PROPERTY_NAME,
  ENUM_FLOW_STATE,
} from '../Types';
import { setConnProp } from '../utils/connProps';

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
  response: Response = undefined;
  error: Error = undefined;
}

export interface FlowPromiseActions {
  /**
   * Define the Promise handler to be executed and listened in the start event
   */
  start: (...args) => Promise<any>;
}
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
/**
 * Decorate the class with Actions based in Promise
 * 
 * To trigger events based on this action, use the
 * following methods as reference:
 * 
 * @method loading > is called after dispatch the start
 * @method completed -> is called after Promise.then
 * @method failed -> is called after Promise.catch
 * 
 * @param options 
 */
// tslint:disable-next-line
export const FlowActionsPromised = (
  options: IReduxFlowActionPromised
): GenericClassDecorator<Type<any>> => {
  return (target: Type<any>) => {
    // define name and type of state
    Reflect.defineMetadata(ENUM_PROPERTY_NAME, options.name, target);

    const promiseHandler: (...args) => Promise<any> = target.prototype['start'];

    target.prototype['start'] = function(...args) {
      if (promiseHandler) {
        this.loading();
        promiseHandler(...args)
          .then(response => this.completed(response))
          .catch(error => this.failed(error));
      }
    };

    target.prototype['loading'] = () => state => {
      return {
        ...state,
        isLoading: true,
        isCompleted: false,
        isFailed: false,
        response: undefined,
        error: undefined
      };
    };
    target.prototype['completed'] = (promiseResponse: any) => state => {
      return {
        ...state,
        isLoading: false,
        isCompleted: true,
        isFailed: false,
        response: promiseResponse,
        error: undefined
      };
    };
    target.prototype['failed'] = (promiseError: any) => state => {
      return {
        ...state,
        isLoading: false,
        isCompleted: false,
        isFailed: true,
        response: undefined,
        error: promiseError
      };
    };
    setConnProp(ENUM_FLOW_STATE, options.state)(target.prototype, 'loading');
    setConnProp(ENUM_FLOW_STATE, options.state)(target.prototype, 'completed');
    setConnProp(ENUM_FLOW_STATE, options.state)(target.prototype, 'failed');
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
