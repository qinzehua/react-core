import { createDom } from "./react-dom";

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
    if (typeof cb === "function") {
      this.cbs.push(cb);
    }

    this.emitUpdate();
  }

  emitUpdate(newProps) {
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this);
    } else {
      this.updateComponent();
    }
  }

  updateComponent() {
    let { classInstance, pendingStates, cbs } = this;

    if (pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState());
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

function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState;
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(
      classInstance.props,
      classInstance.state
    )
  )
    return;

  classInstance.forceUpdate();
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
    if (this.componentWillUpdate) {
      this.componentWillUpdate();
    }
    updateClassComponent(this, this.render());
    if (this.componentDidUpdate) {
      this.componentWillUpdate();
    }
  }
}

function updateClassComponent(classInstance, newVdom) {
  let oldDom = classInstance.dom;
  let newDom = createDom(newVdom);
  oldDom.parentNode.replaceChild(newDom, oldDom);
  classInstance.dom = newDom;
}
