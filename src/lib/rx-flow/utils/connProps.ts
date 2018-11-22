import { ENUM_PROPS_KEY, ComponentProps, ComponentPropInfo } from '../Types';

type propertyFunction = (target, key) => void;

export function setConnProp(flowType: string, type: any, data?: any): propertyFunction {
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
