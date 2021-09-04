import { addEvent } from "./event";

function render(vdom, container) {
  const dom = createDom(vdom);
  container.appendChild(dom);
  dom.componentDidMount && dom.componentDidMount();
}

export function createDom(vdom) {
  debugger;
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }

  let { type, props } = vdom;
  let dom;
  if (typeof type === "function") {
    if (type.isReactComponent) {
      return mountClassCom(vdom);
    } else {
      return mountFuncCom(vdom);
    }
  } else {
    dom = document.createElement(type);
  }

  updateProps(dom, {}, props);

  if (
    typeof props.children === "string" ||
    typeof props.children === "number"
  ) {
    dom.textContent = props.children;
  } else if (typeof props.children === "object" && props.children.type) {
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {
    reconcilChildren(props.children, dom);
  } else {
    document.textContent = props.children ? props.children.toString() : "";
  }

  vdom.dom = dom;
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
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
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
    let newDOM = createDom(newVdom);
    if (nextDOM) {
      parentNode.insetBefore(newDOM, nextDOM);
    } else {
      parentNode.appendChild(newDOM);
    }

    return newVdom;
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    let oldDom = findDOM(oldVdom);
    let newDom = createDom(newVdom);
    parentNode.replaceChild(newDom, oldDom);
    if (oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }

    return newDom;
  } else {
    updateElement(oldVdom, newVdom);
    return newVdom;
  }
}

function updateElement(oldVdom, newVdom) {
  if (typeof oldVdom.type === "string") {
    let currentDOM = (newVdom.dom = oldVdom.dom);
    updateProps(currentDOM, newVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  }
}

function updateChildren() {
  
}

function findDOM(vdom) {
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

const ReactDOM = { render };

export default ReactDOM;
