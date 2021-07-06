import React from "react";
import ReactDOM from "react-dom";
import ThreeCanary from "./ThreeCanary";

import "./styles.css";

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <ThreeCanary />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
