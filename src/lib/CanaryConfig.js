const canaryConfig = {
  "objectUrl": "/assets/canary_idle.glb",
  "nodeCoords": "canary.geometry.attributes.position",
  "nodeSigns": [1, -1, -1],
  "nodeScale": 2.5,
  "nodeGroupScale": 0.02,
  "meshColorIndex": "ciano",
  "meshScale": 1,
  "debug": false,
  "model": {
      "material": "Default_OBJ",
      "scale": 0.02,
      "metalness": 0.2,
      "roughness": 2,
      "opacity": 1,
      "color": "white"
  },
  "gridPosition": [0, -0.12, 0.28],
  "cameraPosition": [3, 0, 0],
  "pointColorIndex": {
      "primary": "ciano",
      "hovered": "magenta",
      "active": "magenta"
  },
  "pointLight": {
      "position": [0, 0, 0],
      "intensity": [2, 2, 2],
      "distance": 15,
      "color": ["ciano", "magenta", "magenta"]
  },
  "bloom": {
      "kernelSize": 1,
      "luminanceThreshold": 0.1,
      "luminanceSmoothing": 0.05,
      "intensity": 0.1
  },
  "glitch": {
      "delay": [20, 30],
      "duration": [0.3, 0.5],
      "strength": [0.1, 0.3],
  },
  "lights": {
    "front": {
        "color": "ciano"
    },
    "left": {
        "color": "white"
    },
    "right": {
        "color": "magenta"
    }
  }
}

export { canaryConfig }
