import Component from "./Component";
import { wrapToVdom } from "./utils";

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

const React = { createElement, Component, createRef, createContext };

export default React;
