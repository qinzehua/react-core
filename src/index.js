import React from "./react";
import ReactDOM from "./react-dom";

class Counter extends React.Component {
  static defaultProps = {
    name: "计数器",
  };

  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };

    console.log("constructor");
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount() {
    console.log("componentDidMount");
  }

  handleCounter = (event) => {
    this.setState({ number: this.state.number + 1 });
  };

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate");
    return nextState.number % 2 === 0;
  }

  componentWillUpdate() {
    console.log("componentWillUpdate");
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  render() {
    console.log("render");
    return (
      <div>
        <h1>counter: {this.state.number}</h1>
        {this.state.number === 4 ? (
          <ChildCounter count={this.state.number} />
        ) : null}
        <button onClick={this.handleCounter}>+</button>
      </div>
    );
  }
}

class ChildCounter extends React.Component {
  componentWillMount() {
    console.log("ChildCounter componentWillMount");
  }

  componentDidMount() {
    console.log("ChildCounter componentDidMount");
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("ChildCounter shouldComponentUpdate");
    return nextState.number % 2 === 0;
  }

  componentWillUpdate() {
    console.log("ChildCounter componentWillUpdate");
  }

  componentDidUpdate() {
    console.log("ChildCounter componentDidUpdate");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  render() {
    console.log("ChildCounter render");
    return <div>count:{this.props.count}</div>;
  }
}

ReactDOM.render(<Counter />, document.getElementById("root"));
