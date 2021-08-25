import { updateQueue } from "./Component";

export function addEvent(dom, eventType, listener) {
  let store = dom.store || (dom.store = {});
  store[eventType] = listener;

  if (!document[eventType]) {
    document[eventType] = dispatchEvent;
  }
}

let syntheticEvent = {};

function dispatchEvent(event) {
  let { target, type } = event;
  let eventType = `on${type}`;

  updateQueue.isBatchingUpdate = true;
  createSyntheticEvent(event);

  while (target) {
    let { store } = target;
    let listener = store && store[eventType];
    listener && listener.call(target, syntheticEvent);
    target = target.parentNode;
  }

  for (const key in syntheticEvent) {
    syntheticEvent[key] = null;
  }
  updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
  for (const key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key];
  }
}
