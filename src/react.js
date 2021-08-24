import Component from "./Component";

function createElement(type, config, children) {
  let props = { ...config };
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2);
  }
  props.children = children;
  return {
    type,
    props,
  };
}

const React = { createElement, Component };

export default React;
