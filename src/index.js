import React from "react";
import ReactDOM from "react-dom";
import ThreeCanary from "./lib/ThreeCanary";

import "./styles.css";

// Utils

const choose = (choices) => {
  let index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

const nodesDataFactory = (n) => {
  let data = [];
  for (let i=0; i<n; i+=1) {
    data.push({
      "id": Math.floor(Math.random()*100),
      "name": choose(["Arthur C. Clarke", "Douglas Adams", "Isaac Asimov"]),
      "color": choose(["#e6007a"])
    })
  }
  return data;
}

// Example hosting component

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodesData: nodesDataFactory(50),
      nodeSelected: null
    };
  }

  onNodeSelected(node) {
    this.setState({nodeSelected: node});
    console.log("Node Selected:", this.state.nodeSelected);
  }

  render() {

    return (
      <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
      >
        <ThreeCanary
          objectUrl={"/assets/canary.glb"}
          nodes={this.state.nodesData}
          onNodeSelected={this.onNodeSelected.bind(this)}
        />
        <div
          className="Info"
          style={{
            padding: 10,
            color: this.state.nodeSelected ? this.state.nodeSelected.color: "#ffffff"
          }}
        >
          {this.state.nodeSelected ? this.state.nodeSelected.name: ""}
        </div>
      </div>
    );
  }
  
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
