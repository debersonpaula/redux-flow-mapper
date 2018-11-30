import { AxiosResponse, AxiosError, AxiosPromise } from 'axios';
// tslint:disable-next-line
import axios from 'axios';
export { axios as http };

import {
  GenericClassDecorator,
  Type,
  ENUM_PROPERTY_NAME,
  ENUM_FLOW_STATE
} from '../Types';
import { setConnProp } from '../utils/connProps';

/**
 * Class to be extended for states based on Axios Http requests
 */
export class FlowHttpState<Response> {
  /**
   * set to true when Promise is on going
   */
  isLoading: boolean = false;

  /**
   * set to true when Promise is done
   */
  isCompleted: boolean = false;

  /**
   * set to true when Promise is failed
   */
  isFailed: boolean = false;

  /**
   * contains the object from Axios then
   */
  response?: AxiosResponse<Response>;

  /**
   * contains the object from Axios catch
   */
  error?: AxiosError;
}

export interface FlowHttpActions {
  request: (...args) => AxiosPromise<any>;
}

// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
/**
 * Decorate the class with Actions for Http Requests
 *
 * To trigger events based on this action, use the
 * following methods as reference:
 *
 * @method loading > is called after dispatch the start
 * @method completed -> is called after Promise.then
 * @method failed -> is called after Promise.catch
 *
 * @param options Configuration parameters
 */
// tslint:disable-next-line
export const FlowHttpRequest = (
  options: IReduxFlowActionHttp
): GenericClassDecorator<Type<any>> => {
  return (target: Type<any>) => {
    // define name and type of state
    Reflect.defineMetadata(ENUM_PROPERTY_NAME, options.name, target);

    // get request function
    const promiseHandler: (...args) => Promise<any> =
      target.prototype['request'];

    target.prototype['request'] = function(...args) {
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
interface IReduxFlowActionHttp {
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
