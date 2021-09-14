import Component, { PureComponent } from "./Component";
import { wrapToVdom } from "./utils";
import { useState } from "./react-dom";

function createElement(type, config, children) {
  let ref;
  let key;
  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    delete config.ref;
    key = config.key;
    delete config.key;
  }

  let props = { ...config };
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    children = wrapToVdom(children);
  }
  props.children = children;
  return {
    type,
    ref,
    key,
    props,
  };
}

function createRef() {
  return { current: undefined };
}

function createContext() {
  function Provider(props) {
    if (!Provider._value) Provider._value = {};
    Object.assign(Provider._value, props.value);
    return props.children;
  }

  function Consumer() {}

  return { Provider, Consumer };
}

function memo(FunctionComponent) {
  return class extends PureComponent {
    render() {
      return <FunctionComponent {...this.props} />;
    }
  };
}

const React = {
  createElement,
  Component,
  createRef,
  createContext,
  useState,
  memo,
};

export default React;
