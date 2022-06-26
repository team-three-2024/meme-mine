"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultCanaryConfig = exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/taggedTemplateLiteral"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/slicedToArray"));

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.regexp.test.js");

var THREE = _interopRequireWildcard(require("three"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _fiber = require("@react-three/fiber");

var _drei = require("@react-three/drei");

var _postprocessing = require("@react-three/postprocessing");

var _templateObject, _templateObject2, _templateObject3;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _defaultCanaryConfig = {
  "canary": {
    "nodeCoords": "canary.geometry.attributes.position",
    "nodeSigns": [1, 1, -1],
    "nodeScale": 0.1,
    "nodeGroupScale": 0.4,
    "meshColorIndex": 0,
    "meshScale": 4,
    "model": {
      "material": "Default OBJ",
      "scale": 0.1,
      "metalness": 0.2,
      "roughness": 2,
      "opacity": 1,
      "color": 0
    },
    "gridPosition": [0, -0.135, 0],
    "cameraPosition": [2.3, 1, 1],
    "pointColorIndex": {
      "primary": 3,
      "secondary": 1
    },
    "pointLight": {
      "position": [0, 0, 0],
      "intensity": [2, 2, 2],
      "distance": 15
    }
  },
  "gil": {
    "nodeCoords": "Baked_GIL_BUSTO003_1.geometry.attributes.position",
    "nodeSigns": [-1, 1, -1],
    "nodeScale": 1.5,
    "nodeGroupScale": 0.1,
    "meshColorIndex": 3,
    "model": {
      "material": "MatWireframe",
      "scale": 0.2,
      "metalness": 0.1,
      "roughness": 0.1,
      "opacity": 0.1,
      "color": 3
    },
    "gridPosition": [0, -0, 4, 0],
    "cameraPosition": [-1, 2.5, 4],
    "pointColorIndex": {
      "primary": 2,
      "secondary": 0
    },
    "pointLight": {
      "position": [0, 5, 0],
      "intensity": [2, 15, 15],
      "distance": 15
    }
  }
};
var color = new THREE.Color(); // ciano, magenta, white, black

var brandPalette = ["#01ffff", "#e6007a", "#ffffff", "#000000"]; // Generate a random integer between min and max

var random = function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}; // Generate N integer numbers (with no repetition) between mix and max


var randomN = function randomN(min, max, n) {
  var numbers = [];

  while (numbers.length < n) {
    var num = random(min, max);

    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }

  return numbers;
};

var resolve = function resolve(path, obj) {
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  var properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce(function (prev, curr) {
    return prev && prev[curr];
  }, obj);
};

var Points = function Points(_ref) {
  var objectUrl = _ref.objectUrl,
      nodesData = _ref.nodesData,
      onNodeClick = _ref.onNodeClick,
      config = _ref.config;

  // Note: useGLTF caches it already
  var _useGLTF = (0, _drei.useGLTF)(objectUrl),
      nodes = _useGLTF.nodes;

  var _useState = (0, _react.useState)(0),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      selected = _useState2[0],
      setSelected = _useState2[1]; // Or nodes.Scene.children[0].geometry.attributes.position


  var positions = config.nodeCoords ? resolve(config.nodeCoords, nodes) : [];
  var numPositions = positions.count;
  var numNodes = nodesData.length;
  var randomIndexes = (0, _react.useMemo)(function () {
    return randomN(0, numPositions, numNodes);
  }, [numPositions, numNodes]);
  var selectedPositions = randomIndexes.map(function (i) {
    return [positions.getX(i), positions.getY(i), positions.getZ(i)];
  });

  var handleSelectedNode = function handleSelectedNode(nodeId) {
    setSelected(nodeId);
  };

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, selected ? /*#__PURE__*/_react.default.createElement("group", {
    scale: config.nodeGroupScale
  }, /*#__PURE__*/_react.default.createElement(PointDialog, {
    position: selectedPositions[selected],
    dialogData: nodesData[selected],
    onNodeClick: onNodeClick,
    config: config
  })) : null, /*#__PURE__*/_react.default.createElement(_drei.Instances, {
    range: selectedPositions.length,
    material: new THREE.MeshBasicMaterial(),
    geometry: new THREE.SphereGeometry(0.1)
  }, selectedPositions.map(function (position, i) {
    return /*#__PURE__*/_react.default.createElement(Point, {
      key: i,
      nodeId: i,
      position: position,
      onNodeSelected: handleSelectedNode,
      dialogData: nodesData[selected],
      onNodeClick: onNodeClick,
      config: config
    });
  })));
};

var Point = function Point(_ref2) {
  var nodeId = _ref2.nodeId,
      position = _ref2.position,
      dialogData = _ref2.dialogData,
      onNodeSelected = _ref2.onNodeSelected,
      onNodeClick = _ref2.onNodeClick,
      config = _ref2.config;
  var ref = (0, _react.useRef)();

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      hovered = _useState4[0],
      setHover = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 1),
      active = _useState6[0];

  (0, _fiber.useFrame)(function (state) {
    var t = state.clock.getElapsedTime();
    var defaultScale = config.nodeScale;
    ref.current.position.x = position[0] * config.nodeSigns[0];
    ref.current.position.z = position[1] * config.nodeSigns[1];
    ref.current.position.y = position[2] * config.nodeSigns[2];
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = defaultScale;
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 6 : 1, defaultScale);
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, active ? 5 : 1, defaultScale);
    ref.current.color.lerp(color.set(hovered || active ? brandPalette[config.pointColorIndex.primary] : brandPalette[config.pointColorIndex.secondary]), hovered || active ? 1 : defaultScale);

    if (hovered) {
      ref.current.color.lerp(color.set(hovered ? brandPalette[0] : brandPalette[1]), hovered ? 1 : defaultScale);
    }

    if (active) {
      ref.current.scale.x = ref.current.scale.y = ref.current.scale.z += Math.sin(t) / 4;
      ref.current.color.lerp(color.set(active ? brandPalette[2] : brandPalette[1]), active ? 1 : defaultScale);
    }
  });
  return /*#__PURE__*/_react.default.createElement("group", {
    scale: config.nodeGroupScale
  }, /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_drei.Instance, {
    ref: ref
    /* eslint-disable-next-line */
    ,
    onPointerOver: function onPointerOver(e) {
      return e.stopPropagation(), setHover(true), onNodeSelected(nodeId);
    },
    onPointerOut: function onPointerOut() {
      return setHover(false);
    },
    onClick: function onClick(e) {
      return onNodeClick(dialogData.hash);
    }
  })));
};

var PointDialog = function PointDialog(_ref3) {
  var position = _ref3.position,
      dialogData = _ref3.dialogData,
      onNodeClick = _ref3.onNodeClick,
      config = _ref3.config;
  var ref = (0, _react.useRef)();
  var scale = 1.002;
  (0, _fiber.useFrame)(function (state) {
    var t = state.clock.getElapsedTime();
    ref.current.position.copy(new THREE.Vector3(position[0] * config.nodeSigns[0] * scale, position[2] * config.nodeSigns[2] * scale, position[1] * config.nodeSigns[1] * scale));
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = 0.05;
    ref.current.position.y += Math.sin(t) / 16;
  });
  return /*#__PURE__*/_react.default.createElement("mesh", {
    ref: ref
  }, /*#__PURE__*/_react.default.createElement("meshStandardMaterial", {
    roughness: 0.75,
    metalness: 0.8,
    emissive: brandPalette[0]
  }), /*#__PURE__*/_react.default.createElement(_drei.Html, {
    distanceFactor: 2
  }, /*#__PURE__*/_react.default.createElement(DialogContent, null, dialogData.hash ? /*#__PURE__*/_react.default.createElement(DialogHash, null, dialogData.hash) : null)));
};

var Model = function Model(props) {
  var _useGLTF2 = (0, _drei.useGLTF)(props.objectUrl),
      scene = _useGLTF2.scene,
      nodes = _useGLTF2.nodes,
      materials = _useGLTF2.materials;

  (0, _react.useLayoutEffect)(function () {
    if (props.meshScale) {
      if (nodes.canary) {
        nodes.canary.scale.set(4, 4, 4);
      }
    }

    scene.traverse(function (obj) {
      obj.type === 'Mesh' && (obj.receiveShadow = obj.castShadow = true);
    }); // 0.8 0.2

    Object.assign(materials[props.model.material], {
      wireframe: true,
      metalness: props.model.metalness,
      roughness: props.model.moughness,
      opacity: props.model.opacity,
      color: new THREE.Color(brandPalette[props.model.color])
    });
  }, [scene, nodes, materials]);
  return /*#__PURE__*/_react.default.createElement("primitive", Object.assign({
    object: scene
  }, props));
};

var Lights = function Lights(_ref4) {
  var config = _ref4.config;
  var groupL = (0, _react.useRef)();
  var groupR = (0, _react.useRef)();
  var front = (0, _react.useRef)();
  var lightL = (0, _react.useRef)();
  var lightR = (0, _react.useRef)();
  var lightF = (0, _react.useRef)();
  (0, _fiber.useFrame)(function (state) {
    var t = state.clock.getElapsedTime(); // 4 * 15, 4 * 10, 4 * 10

    groupL.current.position.x = Math.sin(t) / 4 * 15;
    groupL.current.position.y = Math.cos(t) / 4 * 15;
    groupL.current.position.z = Math.cos(t) / 4 * 15;
    groupR.current.position.x = Math.cos(t) / 4 * 10;
    groupR.current.position.y = Math.sin(t) / 4 * 10;
    groupR.current.position.z = Math.sin(t) / 4 * 10;
    front.current.position.x = Math.sin(t) / 4 * 10;
    front.current.position.y = Math.cos(t) / 4 * 10;
    front.current.position.z = Math.sin(t) / 4 * 10;
  });

  if (config.debug === true) {
    (0, _drei.useHelper)(lightL, THREE.PointLightHelper);
    (0, _drei.useHelper)(lightR, THREE.PointLightHelper);
    (0, _drei.useHelper)(lightF, THREE.PointLightHelper);
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("group", {
    ref: groupL
  }, /*#__PURE__*/_react.default.createElement("pointLight", {
    ref: lightL,
    color: brandPalette[0],
    position: config.pointLight.position,
    distance: config.pointLight.distance,
    intensity: config.pointLight.intensity[0]
  })), /*#__PURE__*/_react.default.createElement("group", {
    ref: groupR
  }, /*#__PURE__*/_react.default.createElement("pointLight", {
    ref: lightR,
    color: brandPalette[1],
    position: config.pointLight.position,
    distance: config.pointLight.distance,
    intensity: config.pointLight.intensity[1]
  })), /*#__PURE__*/_react.default.createElement("group", {
    ref: front
  }, /*#__PURE__*/_react.default.createElement("pointLight", {
    ref: lightF,
    color: brandPalette[2],
    position: config.pointLight.position,
    distance: config.pointLight.distance,
    intensity: config.pointLight.intensity[2]
  })));
};

var Particles = function Particles(_ref5) {
  var count = _ref5.count;
  var mesh = (0, _react.useRef)();
  var dummy = (0, _react.useMemo)(function () {
    return new THREE.Object3D();
  }, []);
  var particles = (0, _react.useMemo)(function () {
    var temp = [];

    for (var i = 0; i < count; i++) {
      var t = Math.random() * 100;
      var factor = 20 + Math.random() * 10;
      var speed = 0.01 + Math.random() / 200;
      var xFactor = -5 + Math.random() * 10;
      var yFactor = -5 + Math.random() * 10;
      var zFactor = -5 + Math.random() * 10;
      temp.push({
        t: t,
        factor: factor,
        speed: speed,
        xFactor: xFactor,
        yFactor: yFactor,
        zFactor: zFactor,
        mx: 0,
        my: 0
      });
    }

    return temp;
  }, [count]);
  (0, _fiber.useFrame)(function (state) {
    particles.forEach(function (particle, i) {
      var t = particle.t,
          factor = particle.factor,
          speed = particle.speed,
          xFactor = particle.xFactor,
          yFactor = particle.yFactor,
          zFactor = particle.zFactor;
      t = particle.t += speed / 4;
      var a = Math.cos(t) + Math.sin(t * 1) / 10;
      var b = Math.sin(t) + Math.cos(t * 2) / 10;
      var s = Math.cos(t) / 4;
      dummy.position.set(particle.mx / 10 * a + xFactor + Math.cos(t / 10 * factor) + Math.sin(t * 1) * factor / 10, particle.my / 10 * b + yFactor + Math.sin(t / 10 * factor) + Math.cos(t * 2) * factor / 10, particle.my / 10 * b + zFactor + Math.cos(t / 10 * factor) + Math.sin(t * 3) * factor / 10);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("instancedMesh", {
    ref: mesh,
    args: [null, null, count]
  }, /*#__PURE__*/_react.default.createElement("boxGeometry", {
    args: [1]
  }), /*#__PURE__*/_react.default.createElement("pointsMaterial", {
    color: brandPalette[1],
    size: 0.02,
    transparent: true,
    sizeAttenuation: false,
    opacity: 0.3
  })));
};

var ThreeCanary = function ThreeCanary(props) {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  var config = props.config ? props.config : _defaultCanaryConfig["canary"];
  return /*#__PURE__*/_react.default.createElement(_fiber.Canvas, {
    shadows: true,
    dpr: [1, 2],
    camera: {
      position: config.cameraPosition,
      fov: 50
    },
    performance: {
      min: 0.1
    }
  }, /*#__PURE__*/_react.default.createElement(Lights, {
    config: config
  }), /*#__PURE__*/_react.default.createElement("gridHelper", {
    position: config.gridPosition,
    color: "#000",
    args: [40, 40]
  }), /*#__PURE__*/_react.default.createElement(_react.Suspense, {
    fallback: null
  }, /*#__PURE__*/_react.default.createElement(Model, {
    scale: config.model.scale,
    objectUrl: props.objectUrl,
    meshColorIndex: config.meshColorIndex,
    meshScale: config.meshScale,
    model: config.model
  }), /*#__PURE__*/_react.default.createElement(Points, {
    objectUrl: props.objectUrl,
    nodesData: props.nodes,
    onNodeClick: props.onNodeClick,
    config: config
  }), /*#__PURE__*/_react.default.createElement(Particles, {
    count: isMobile ? 50 : 200
  }), /*#__PURE__*/_react.default.createElement(_postprocessing.EffectComposer, {
    multisampling: 16
  }, /*#__PURE__*/_react.default.createElement(_postprocessing.Bloom, {
    kernelSize: 2,
    luminanceThreshold: 0.1,
    luminanceSmoothing: 0.05,
    intensity: 1
  }), /*#__PURE__*/_react.default.createElement(_postprocessing.Glitch, {
    delay: [20, 30]
  }))), /*#__PURE__*/_react.default.createElement(_drei.OrbitControls, {
    minPolarAngle: Math.PI / 2.8,
    maxPolarAngle: Math.PI / 1.8
  }));
}; // Styling


var fadeIn = (0, _styledComponents.keyframes)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 0.9;\n  }\n"])));

var DialogContent = _styledComponents.default.div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  animation: ", " ease-in-out 0.5s;\n  animation-iteration-count: 1;\n  animation-fill-mode: forwards;\n\n  text-align: left;\n  background: ", ";\n\n  color: white;\n  padding: 10px 20px;\n  border-radius: 5px;\n\n  font-family: monospace;\n"])), fadeIn, brandPalette[1]);

var DialogHash = _styledComponents.default.div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n  padding-top: 5px;\n"])), brandPalette[2]);

var _default = ThreeCanary;
exports.default = _default;
var defaultCanaryConfig = _defaultCanaryConfig;
exports.defaultCanaryConfig = defaultCanaryConfig;