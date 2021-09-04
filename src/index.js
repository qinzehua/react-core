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
      <div id={`counter-${this.state.number}`}>
        <h1 id="title">counter:{this.state.number}</h1>
        {this.state.number === 2 ? null : (
          <ChildCounter count={this.state.number} />
        )}
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
    return <h3 id="childcounter">count:{this.props.count}</h3>;
  }
}

ReactDOM.render(<Counter />, document.getElementById("root"));
