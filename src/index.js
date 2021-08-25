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
    this.setState(
      (oldState) => ({
        number: oldState.number + 1,
      }),
      () => {
        console.log("cb1", this.state.number);
      }
    );
    console.log(this.state.number);
    this.setState(
      (oldState) => ({
        number: oldState.number + 1,
      }),
      () => {
        console.log("cb2", this.state.number);
      }
    );
    console.log(this.state.number);

    Promise.resolve().then(() => {
      this.setState({ number: this.state.number + 1 }, () => {
        console.log("cb3", this.state.number);
      });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 }, () => {
        console.log("cb4", this.state.number);
      });
      console.log(this.state.number);
    });
  };

  render() {
    return (
      <div>
        {this.state.number < 3 ? (
          <p>{this.state.number}</p>
        ) : (
          <h1>{this.state.number}</h1>
        )}

        <button onClick={this.handleClick}>
          <span>+</span>
        </button>
        <button onClick={this.handleClick}>
          <span>+</span>
        </button>
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
