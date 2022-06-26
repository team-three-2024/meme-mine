import React from "react"
import ReactDOM from "react-dom"
import ThreeCanary, { defaultCanaryConfig } from "./lib/ThreeCanary"

import "./styles.css"

/* eslint-disable-next-line */
const localCanaryConfig = {
  "nodeCoords": "Baked_GIL_BUSTO003_1.geometry.attributes.position",
  "nodeSigns": [-1, 1, -1],
  "nodeScale": 0.5,
  "nodeGroupScale": 0.1,
  "meshColorIndex": 3,
  "modelMaterial": "MatWireframe",
  "modelScale": 0.2,
  "gridPosition": [0, -0, 4, 0],
  "cameraPosition": [-1, 2.5, 4]
}

// Utils

const choose = (choices) => {
  let index = Math.floor(Math.random() * choices.length)
  return choices[index]
}

const nodesDataFactory = (n) => {
  let data = []
  for (let i = 0; i < n; i += 1) {
    data.push({
      "id": Math.floor(Math.random() * 100),
      "name": choose([
        "Arthur C. Clarke",
        "Douglas Adams",
        "Isaac Asimov"]),
      "level": choose([
        "human",
        "cyborg"]),
      "hash": choose([
        "0x08eded6a76d84e309e3f09705ea2853f",
        "0xdeadbeefe6a76d84e309e3f09705ea28589"]),
      "img": choose([
        "/assets/t1.jpg",
        "/assets/t2.jpg"])
    })
  }
  return data;
}

// Example hosting component

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodesData: nodesDataFactory(150),
      nodeSelected: null
    }
  }

  render() {

    return (
      <>
        <div
          className={"App"}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%"
          }}
        >
          <ThreeCanary
            objectUrl={"/assets/gil.glb"}
            nodes={this.state.nodesData}
            onNodeClick={(nodeId) => {
              console.log("onNodeClick", nodeId)
            }
            }
            config={defaultCanaryConfig["gil"]}
          />

          <div
            className={"Info"}
            style={{
              padding: 10,
              color: this.state.nodeSelected ?
                this.state.nodeSelected.color : "#ffffff"
            }}
          >
            {this.state.nodeSelected ?
              this.state.nodeSelected.name : ""}
          </div>
        </div>
      </>
    )
  }

}

const rootElement = document.getElementById("root")
ReactDOM.render(<App />, rootElement)
