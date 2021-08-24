function render(vdom, container) {
  const dom = createDom(vdom);
  container.appendChild(dom);
}

export function createDom(vdom) {
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

  updateProps(dom, props);

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

  return dom;
}

function updateProps(dom, props) {
  for (let key in props) {
    const value = props[key];
    if (key === "children") continue;
    if (key === "style") {
      let styleObj = value;
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      dom[key.toLocaleLowerCase()] = value;
    } else {
      dom[key] = props[key];
    }
  }
}

function reconcilChildren(vdoms, parentDom) {
  for (const vdom of vdoms) {
    render(vdom, parentDom);
  }
}

function mountFuncCom(vdom) {
  let { type: FunctionComponent, props } = vdom;
  let renderVdom = FunctionComponent(props);
  return createDom(renderVdom);
}

function mountClassCom(vdom) {
  let { type, props } = vdom;
  let classInstance = new type(props);
  let renderVdom = classInstance.render();
  let dom = createDom(renderVdom);
  classInstance.dom = dom;
  return dom;
}

const ReactDOM = { render };

export default ReactDOM;
