import React from "./react";
import ReactDOM from "./react-dom";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
    this.handleCounter = (event) => {
      this.setState({ number: this.state.number + 1 });
    };
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount() {
    console.log("componentDidMount");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate", this.state, nextState);
    return nextState.number % 2 === 0;
  }

  componentWillUpdate() {
    console.log("componentWillUpdate", this.state);
  }

  componentDidUpdate() {
    console.log("componentDidUpdate", this.state);
  }

  render() {
    console.log("render");
    return (
      <div id={`counter-${this.state.number}`}>
        <h1 id="title">counter:{this.state.number}</h1>
        {/* {this.state.number === 2 ? null : (
          <ChildCounter count={this.state.number} />
        )} */}
        <button onClick={this.handleCounter}>+</button>
        {/* <FuncCounter count={this.state.number} /> */}
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
    return nextProps.count % 2 === 0;
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
    return <h3 id="childcounter">ChildCounter:{this.props.count}</h3>;
  }
}

function FuncCounter(props) {
  return <h2>{props.count}</h2>;
}

ReactDOM.render(<Counter />, document.getElementById("root"));
