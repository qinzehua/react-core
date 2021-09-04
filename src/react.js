import Component from "./Component";
import { wrapToVdom } from "./utils";

function createElement(type, config, children) {
  let props = { ...config };
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    children = wrapToVdom(children);
  }
  props.children = children;
  return {
    type,
    props,
  };
}

const React = { createElement, Component };

export default React;
