import React from "./react";
import ReactDOM from "./react-dom";
let PContext = React.createContext();
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      age: 30,
    };
    this.handleCounter = (event) => {
      this.setState({ number: this.state.number + 1, age: 32 });
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
    return true;
  }

  componentWillUpdate() {
    console.log("componentWillUpdate", this.state);
  }

  componentDidUpdate() {
    console.log("componentDidUpdate", this.state);
  }

  render() {
    console.log("render");

    let contextValue = { name: "Person", age: this.state.age };
    return (
      <PContext.Provider value={contextValue}>
        <div id={`counter-${this.state.number}`}>
          {this.state.number === 4 ? null : (
            <ChildCounter count={this.state.number} />
          )}
          <button onClick={this.handleCounter}>+</button>
          {/* <FuncCounter count={this.state.number} /> */}
        </div>
      </PContext.Provider>
    );
  }
}

class ChildCounter extends React.Component {
  static contextType = PContext;

  domRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = { number: -1 };
  }
  static getDerivedStateFromProps(nextProps, preState) {
    const { count } = nextProps;

    return { number: count * 3 };
  }
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
    return true;
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
    return (
      <div>
        <p>
          name: {this.context.name}, age: {this.context.age}
        </p>
        <h2 ref={this.domRef}>pros count:{this.props.count}</h2>
        <h4>cal number: {this.state.number}</h4>
      </div>
    );
  }
}

function FuncCounter(props) {
  return <h2>{props.count}</h2>;
}

ReactDOM.render(<Counter />, document.getElementById("root"));
