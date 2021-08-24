import React from "./react";
import ReactDOM from "./react-dom";

function Welcome(props) {
  const today = new Date();
  return (
    <h1 className="title" style={{ backgroundColor: "green", color: "#ddd" }}>
      hello, {props.name}. today is {today.toDateString()}
      {props.children}
    </h1>
  );
}

function Wrapper() {
  return (
    <Welcome name="珠峰">
      <p>x x x 1 2 3</p>
    </Welcome>
  );
}

ReactDOM.render(<Wrapper />, document.getElementById("root"));
