import { compareTwoVdom } from "./react-dom";

export let updateQueue = {
  isBatchingUpdate: false,
  updaters: new Set(),
  batchUpdate() {
    for (const updater of this.updaters) {
      updater.updateComponent();
    }
    this.isBatchingUpdate = false;
  },
};

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
    this.cbs = [];
  }

  addState(partialState, cb) {
    this.pendingStates.push(partialState);
    if (typeof cb === "function") this.cbs.push(cb);
    this.emitUpdate();
  }

  emitUpdate(newProps) {
    this.newProps = newProps;

    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this);
    } else {
      this.updateComponent();
    }
  }

  updateComponent() {
    let { classInstance, pendingStates, newProps } = this;

    if (newProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, newProps, this.getState());
    }
  }

  getState() {
    let { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      if (typeof nextState === "function") {
        nextState = nextState(state);
      }
      state = { ...state, ...nextState };
    });
    pendingStates = [];
    return state;
  }
}

function shouldUpdate(classInstance, newProps, nextState) {
  let willUpdate = true;

  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(newProps, nextState)
  ) {
    willUpdate = false;
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }
  if (newProps) {
    classInstance.props = newProps;
  }
  classInstance.state = nextState;
  if (willUpdate) classInstance.forceUpdate();
}

export default class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.updater = new Updater(this);
  }

  render() {}

  setState(partialState, cb) {
    this.updater.addState(partialState, cb);
  }

  forceUpdate() {
    let newRenderVdom = this.render();
    let oldRenderVdom = this.oldRenderVdom;
    let oldDOM = oldRenderVdom.dom;

    let currentRenderVdom = compareTwoVdom(
      oldDOM.parentNode,
      oldRenderVdom,
      newRenderVdom
    );

    this.oldRenderVdom = currentRenderVdom;

    if (this.componentDidUpdate) {
      this.componentDidUpdate();
    }
  }
}
