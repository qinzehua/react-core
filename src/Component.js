import { createDom } from "./react-dom";
export default class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
  }

  render() {}

  setState(partialState) {
    let state = this.state;
    this.state = { ...state, ...partialState };
    let newVdom = this.render();
    updateClassComponent(this, newVdom);
  }
}

function updateClassComponent(classInstance, newVdom) {
  let oldDom = classInstance.dom;
  let newDom = createDom(newVdom);
  oldDom.parentNode.replaceChild(newDom, oldDom);
  classInstance.dom = newDom;
}
