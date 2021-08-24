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

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }

  handleClick = () => {
    this.setState({ number: ++this.state.number });
  };

  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

function Wrapper() {
  return (
    <div>
      <Welcome name="珠峰">
        <p>x x x 1 2 3</p>
      </Welcome>
      <Counter />
    </div>
  );
}

ReactDOM.render(<Wrapper />, document.getElementById("root"));
