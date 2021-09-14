import { addEvent } from "./event";
import { REACT_TEXT } from "./consts";

let scheduleUpdate;

function render(vdom, parentNode, nextDOM, oldDOM) {
  let newDOM = createDom(vdom);
  if (oldDOM) {
    parentNode.replaceChild(newDOM, oldDOM);
  } else {
    if (nextDOM) {
      parentNode.insertBefore(newDOM, nextDOM);
    } else {
      parentNode.appendChild(newDOM);
    }
  }

  vdom.componentDidMount && vdom.componentDidMount();
}

export function createDom(vdom) {
  let { type, props, ref } = vdom;
  let dom;
  if (typeof type === "function") {
    if (type.isReactComponent) {
      return mountClassCom(vdom);
    } else {
      return mountFuncCom(vdom);
    }
  } else if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else {
    dom = document.createElement(type);
  }

  updateProps(dom, {}, props);

  if (typeof props.children === "object" && props.children.type) {
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {
    reconcilChildren(props.children, dom);
  }

  vdom.dom = dom;
  if (ref) {
    ref.current = dom;
  }
  return dom;
}

function updateProps(dom, oldProps, props) {
  for (let key in props) {
    const value = props[key];
    if (key === "children") continue;
    if (key === "style") {
      let styleObj = value;
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      addEvent(dom, key.toLocaleLowerCase(), value);
    } else {
      dom[key] = props[key];
    }
  }
}

function reconcilChildren(vdoms, parentDom) {
  for (const vdom of vdoms) {
    if (vdom !== null && vdom !== undefined) {
      render(vdom, parentDom);
    }
  }
}

function mountFuncCom(vdom) {
  let { type: FunctionComponent, props } = vdom;
  let renderVdom = FunctionComponent(props);
  vdom.oldRenderVdom = renderVdom;
  return createDom(renderVdom);
}

function mountClassCom(classVdom) {
  let { type, props } = classVdom;
  let classInstance = new type(props);

  if (type.contextType) {
    classInstance.context = type.contextType.Provider._value;
  }

  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
  }

  if (type.getDerivedStateFromProps) {
    let partialState = type.getDerivedStateFromProps(
      classInstance.props,
      classInstance.state
    );
    if (partialState) {
      classInstance.state = { ...classInstance.state, ...partialState };
    }
  }

  let renderVdom = classInstance.render();
  let dom = createDom(renderVdom);

  classInstance.oldRenderVdom = renderVdom;
  classVdom.classInstance = classInstance;

  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}

export function compareTwoVdom(parentNode, oldVdom, newVdom, nextDOM) {
  if (!oldVdom && !newVdom) {
    return null;
  } else if (oldVdom && !newVdom) {
    let currentDom = findDOM(oldVdom);
    if (currentDom) {
      parentNode.removeChild(currentDom);
    }

    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }

    return null;
  } else if (!oldVdom && newVdom) {
    render(newVdom, parentNode, nextDOM);
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    render(newVdom, parentNode, nextDOM, findDOM(oldVdom));
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }
    return newVdom;
  } else {
    updateElement(oldVdom, newVdom);
    return newVdom;
  }
}

function updateElement(oldVdom, newVdom) {
  // 原生dom， 进行递归对比
  if (typeof oldVdom.type === "string") {
    let currentDOM = (newVdom.dom = oldVdom.dom);
    updateProps(currentDOM, newVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);

    // 文本节点直接更新
  } else if (oldVdom.type === REACT_TEXT) {
    let currentDOM = (newVdom.dom = oldVdom.dom);
    currentDOM.textContent = newVdom.props.content;
  } else if (typeof oldVdom.type === "function") {
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom);
    } else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

function updateClassComponent(oldVdom, newVdom) {
  // 复用类的实例
  const classInstance = (newVdom.classInstance = oldVdom.classInstance);
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps();
  }
  classInstance.updater.emitUpdate(newVdom.props);
}

function updateFunctionComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom.oldRenderVdom).parentNode;
  let { type, props } = newVdom;
  let newRenderVdom = type(props);
  newVdom.oldRenderVdom = newRenderVdom;

  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);

  for (let i = 0; i < maxLength; i++) {
    let nextDOM = oldVChildren.find(
      (item, index) => index > i && item && item.dom
    );
    compareTwoVdom(
      parentDOM,
      oldVChildren[i],
      newVChildren[i],
      nextDOM && nextDOM.dom
    );
  }
}

export function findDOM(vdom) {
  let { type } = vdom;
  let dom;
  if (typeof type === "function") {
    if (type.isReactComponent) {
      dom = findDOM(vdom.classInstance.oldRenderVdom);
    } else {
      dom = findDOM(vdom.oldRenderVdom);
    }
  } else {
    dom = vdom.dom;
  }
  return dom;
}

let hookStates = [];
let hookIndex = 0;

export function useState(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState;
  let currentIndex = hookIndex;
  function setState(newState) {
    hookStates[currentIndex] = newState;
    scheduleUpdate();
  }

  return [hookStates[hookIndex++], setState];
}

const ReactDOM = { render };

export default ReactDOM;
