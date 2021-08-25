import { createDom } from "./react-dom";

export let updateQueue = {
  isBatchingUpdate: false,
  updaters: new Set(),
  batchUpdate() {
    for (const updater of this.updaters) {
      updater.updateClassComponent();
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

    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this);
    } else {
      this.updateClassComponent();
    }
  }

  updateClassComponent() {
    let { classInstance, pendingStates, cbs } = this;

    if (pendingStates.length > 0) {
      classInstance.state = this.getState();
      classInstance.forceUpdate();
      cbs.forEach((cb) => cb());
      cbs.length = 0;
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
    updateClassComponent(this, this.render());
  }
}

function updateClassComponent(classInstance, newVdom) {
  let oldDom = classInstance.dom;
  let newDom = createDom(newVdom);
  oldDom.parentNode.replaceChild(newDom, oldDom);
  classInstance.dom = newDom;
}
