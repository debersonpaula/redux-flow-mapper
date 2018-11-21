# Redux Flow Mapper

React/Redux utility to create flows that acts as Actions and Reducers with Typescript and Decorators.

[![NPM](https://nodei.co/npm/redux-flow-mapper.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/redux-flow-mapper)

[![NPM](https://nodei.co/npm-dl/redux-flow-mapper.png)](https://nodei.co/npm/redux-flow-mapper/)

Work in Progress:

- Core functionalities: done
- Actions dispatchers: done
- Reducer handlers: done
- Triggers handlers: done
- Promise based events: on-going
- Tests: TBD

## Requirements

```bash
# requires the following packages:
npm i --save react-redux
npm i --save rxjs
npm i --save-dev @babel/plugin-proposal-decorators
npm i --save-dev @babel/plugin-proposal-class-properties
```

## Install

```bash
# install Flow Mapper
npm i redux-flow-mapper
```

## Setup tsconfig and babelrc
Include support for decorators in the tsconfig.json file:
```js
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

If Babel is used to transpile the application, include the plugins below in the _.babelrc_ file. Consider these itens as firts in the plugins list and in the same order that appears below:

```js
"plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true}],
    ...
  ],
```


## Concept

This package is based in the common flow principles to control the activities in the frontend.
Any action of flow is build on FlowMapper and React just render the results.

The base flow of FlowMapper starts with flow actions and states, are intercepted by triggers, encapsulated with modules, created by mapper and distributed thru connections:
![Flow Chart Concept][img-flowchart]

## Redux by Class and Decorators

All Redux logics were designed to be a decorated classes and methods.

### FlowState
The development starts with states, that is the initial data for reducers.
```ts
import {FlowState} from 'redux-flow-mapper';

@FlowState({
  name: 'name-of-your-state'
})
export class MyState {
  myCustomData = '';
  ...
}
```
The name in the decorator, will be used as reducer name in redux store.

### FlowActions
Actions are designed to be dispatchers and reducers.
Any method decored by **getState** will be replaced by dispatcher function that emits an action with the name of method as type and the arguments as args in the dispatch.
```ts
import { FlowActions, getState } from "redux-flow-mapper";

@FlowActions({
  name: "name-of-your-action"
})
export class MyActions {
  @getState(MyState)
  start = () => (state: MyState): MyState => {
    return { ...state, myCustomData: "something" };
  };
}
```

### FlowTriggers
Triggers are interceptors that listen to action completion and returns the previous and new changed state.
```ts
import {FlowActions, getTrigger} from 'redux-flow-mapper';

@FlowActions({
  name: 'name-of-another-action'
})
export class MyAnotherActions {
  ...

  @getTrigger(MyState, MyActions, 'start')
  checkIfActionIfStarted = (
    previous: MyState,
    state: MyState
  ) => {
    if (!previous.myCustomData && state.myCustomData) {
      // make your actions
      ...
    }
  };

  ...
}
```

### FlowModules
Modules are encapsulation that holds all flow states and actions.
```ts
import { FlowModule } from "redux-flow-mapper";

@FlowModule({
  states: [MyState],
  actions: [MyActions, MyAnotherActions]
})
export class MyModule {}
```

### FlowMapper
The FlowMapper is the main class and instantiate all actions and states, transforming then in dispatchers and reducers.
```ts
import { FlowMapper } from "redux-flow-mapper";

export const myMapper = new FlowMapper({
  devExtension: true, // enables redux-dev-extension for chrome
  modules: [MyModule]
});
```

### Connecting in React

Use Redux Provider and connect it to the mapper store:
```tsx
import { Provider } from 'react-redux';
import * as React from 'react';

...

export class App extends React.Component {
  public render() {
    return (
      <Provider store={myMapper.createStore()}>
        ...
      </Provider>
    );
  }
}
```
The function _createStore_ instantiate a **Store** object, that can be used in the redux Provider.

### Render in component
Use FlowConnection to replace connect from Redux. This decorator automatically connect the component to the redux store and instantiate actions and states from mapper.
```tsx
import {FlowConnection, getAction, getState} from 'redux-flow-mapper';

class Props {
  // decorate property with action and send the action
  // object to the component thru props
  @getAction(MyActions) actions?: MyActions;

  // decorate property with state and send the action
  // object to the component thru props
  @getState(MyState) stateContent?: MyState;
}

@FlowConnection({
  flow: myMapper, // <-- set the instance of FlowMapper
  props: Props // <-- set to the Props class
})
// always use the Props class to incorporate the React component
export class MyComponent extends React.Component<Props> {
  render() {
    return (
      <div>
        <strong>Test Component</strong>
        <p>custom data = {this.props.stateContent.myCustomData}</p>
        <p><button onClick={this.start}>Start</button></p>
      </div>
    );
  }
  start = () => {
    this.props.actions.start();
  }
}
```

## Sample
The sample project is available in the source https://github.com/debersonpaula/redux-flow-mapper. Just install dependencies and run with ```npm start```.

## License

[MIT](LICENSE)

[img-flowchart]: https://github.com/debersonpaula/redux-flow-mapper/raw/master/docs/flowchart.png
[sample]
:https://github.com/debersonpaula/redux-flow-mapper/tree/master/src
