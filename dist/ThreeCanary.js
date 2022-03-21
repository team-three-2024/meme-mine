"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/taggedTemplateLiteral"));

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.regexp.test.js");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/slicedToArray"));

var THREE = _interopRequireWildcard(require("three"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _fiber = require("@react-three/fiber");

var _drei = require("@react-three/drei");

var _postprocessing = require("@react-three/postprocessing");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var color = new THREE.Color();
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

var formatHash = function formatHash(str) {
  if (!str) return "";
  var numChars = 6;
  var sep = "...";
  var strLen = str.length;
  var head = str.slice(0, numChars);
  var tail = str.slice(strLen - 5, strLen);
  return head + sep + tail;
};

function Points(_ref) {
  var objectUrl = _ref.objectUrl,
      nodesData = _ref.nodesData,
      onNodeClick = _ref.onNodeClick;

  // Note: useGLTF caches it already
  var _useGLTF = (0, _drei.useGLTF)(objectUrl),
      nodes = _useGLTF.nodes;

  var _useState = (0, _react.useState)(0),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      selected = _useState2[0],
      setSelected = _useState2[1]; // Or nodes.Scene.children[0].geometry.attributes.position


  var positions = nodes.canary.geometry.attributes.position;
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
    scale: 0.4
  }, /*#__PURE__*/_react.default.createElement(PointDialog, {
    position: selectedPositions[selected],
    dialogData: nodesData[selected],
    onNodeClick: onNodeClick
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
      onNodeClick: onNodeClick
    });
  })));
}

function Point(_ref2) {
  var nodeId = _ref2.nodeId,
      position = _ref2.position,
      dialogData = _ref2.dialogData,
      onNodeSelected = _ref2.onNodeSelected,
      onNodeClick = _ref2.onNodeClick;
  var ref = (0, _react.useRef)();

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      hovered = _useState4[0],
      setHover = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 1),
      active = _useState6[0];

  (0, _fiber.useFrame)(function (state) {
    var t = state.clock.getElapsedTime(); // ref.current.position.copy(new THREE.Vector3(position[0], -position[2], position[1]))

    ref.current.position.x = position[0];
    ref.current.position.y = -position[2];
    ref.current.position.z = position[1];
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = 0.1;
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 6 : 1, 0.1);
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, active ? 5 : 1, 0.1);
    ref.current.color.lerp(color.set(hovered || active ? brandPalette[0] : brandPalette[1]), hovered || active ? 1 : 0.1);

    if (hovered) {
      ref.current.color.lerp(color.set(hovered ? brandPalette[0] : brandPalette[1]), hovered ? 1 : 0.1);
    }

    if (active) {
      ref.current.scale.x = ref.current.scale.y = ref.current.scale.z += Math.sin(t) / 4;
      ref.current.color.lerp(color.set(active ? brandPalette[2] : brandPalette[1]), active ? 1 : 0.1);
    }
  });
  return /*#__PURE__*/_react.default.createElement("group", {
    scale: 0.4
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
}

function PointDialog(_ref3) {
  var position = _ref3.position,
      dialogData = _ref3.dialogData,
      onNodeClick = _ref3.onNodeClick;
  var ref = (0, _react.useRef)();

  var handleNodeClick = function handleNodeClick() {
    if (dialogData.hash) onNodeClick(dialogData.hash);
  };

  var scale = 1.002;
  (0, _fiber.useFrame)(function (state) {
    var t = state.clock.getElapsedTime();
    ref.current.position.copy(new THREE.Vector3(position[0] * scale, -position[2] * scale, position[1] * scale));
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
}

function Model(props) {
  var _useGLTF2 = (0, _drei.useGLTF)(props.objectUrl),
      scene = _useGLTF2.scene,
      nodes = _useGLTF2.nodes,
      materials = _useGLTF2.materials;

  (0, _react.useLayoutEffect)(function () {
    // nodes.canary.position.setY(-10)
    nodes.canary.scale.set(4, 4, 4);
    scene.traverse(function (obj) {
      return obj.type === 'Mesh' && (obj.receiveShadow = obj.castShadow = true);
    });
    Object.assign(materials["Default OBJ"], {
      wireframe: true,
      metalness: 0.1,
      roughness: 0.8,
      color: new THREE.Color(brandPalette[0])
    });
  }, [scene, nodes, materials]);
  return /*#__PURE__*/_react.default.createElement("primitive", Object.assign({
    object: scene
  }, props));
}

function Lights() {
  var groupL = (0, _react.useRef)();
  var groupR = (0, _react.useRef)();
  var front = (0, _react.useRef)();
  (0, _fiber.useFrame)(function (state) {
    var t = state.clock.getElapsedTime();
    groupL.current.position.x = Math.sin(t) / 2;
    groupL.current.position.y = Math.cos(t) / 2;
    groupL.current.position.z = Math.cos(t) / 2;
    groupR.current.position.x = Math.cos(t) / 2;
    groupR.current.position.y = Math.sin(t) / 2;
    groupR.current.position.z = Math.sin(t) / 2;
    front.current.position.x = Math.sin(t) / 2;
    front.current.position.y = Math.cos(t) / 2;
    front.current.position.z = Math.sin(t) / 2;
  });
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("group", {
    ref: groupL
  }, /*#__PURE__*/_react.default.createElement("pointLight", {
    color: brandPalette[0],
    position: [15, 0, 0],
    distance: 15,
    intensity: 10
  })), /*#__PURE__*/_react.default.createElement("group", {
    ref: groupR
  }, /*#__PURE__*/_react.default.createElement("pointLight", {
    color: brandPalette[1],
    position: [-15, 0, 0],
    distance: 15,
    intensity: 10
  })), /*#__PURE__*/_react.default.createElement("group", {
    ref: front
  }, /*#__PURE__*/_react.default.createElement("pointLight", {
    color: brandPalette[2],
    position: [0, 15, 0],
    distance: 15,
    intensity: 10
  })));
}

function Particles(_ref4) {
  var count = _ref4.count;
  var mesh = (0, _react.useRef)();
  var dummy = (0, _react.useMemo)(function () {
    return new THREE.Object3D();
  }, []);
  var particles = (0, _react.useMemo)(function () {
    var temp = [];

    for (var i = 0; i < count; i++) {
      var t = Math.random() * 100;
      var factor = 20 + Math.random() * 100;
      var speed = 0.01 + Math.random() / 200;
      var xFactor = -50 + Math.random() * 100;
      var yFactor = -50 + Math.random() * 100;
      var zFactor = -50 + Math.random() * 100;
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
      var s = Math.cos(t) / 2;
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
}

function ThreeCanary(props) {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return /*#__PURE__*/_react.default.createElement(_fiber.Canvas, {
    shadows: true,
    dpr: [1, 2],
    camera: {
      position: [2.3, 1, 1],
      fov: 50
    },
    performance: {
      min: 0.1
    }
  }, /*#__PURE__*/_react.default.createElement(Lights, null), /*#__PURE__*/_react.default.createElement("gridHelper", {
    position: [0, -0.135, 0],
    color: "#000",
    args: [40, 40]
  }), /*#__PURE__*/_react.default.createElement(_react.Suspense, {
    fallback: null
  }, /*#__PURE__*/_react.default.createElement(Model, {
    scale: 0.1,
    objectUrl: props.objectUrl
  }), /*#__PURE__*/_react.default.createElement(Points, {
    objectUrl: props.objectUrl,
    nodesData: props.nodes,
    onNodeClick: props.onNodeClick
  }), /*#__PURE__*/_react.default.createElement(Particles, {
    count: isMobile ? 50 : 200
  }), /*#__PURE__*/_react.default.createElement(_postprocessing.EffectComposer, {
    multisampling: 16
  }, /*#__PURE__*/_react.default.createElement(_postprocessing.Bloom, {
    kernelSize: 2,
    luminanceThreshold: 0.01,
    luminanceSmoothing: 0.05,
    intensity: 0.1
  }), /*#__PURE__*/_react.default.createElement(_postprocessing.Glitch, {
    delay: [20, 30]
  }))), /*#__PURE__*/_react.default.createElement(_drei.OrbitControls, {
    minPolarAngle: Math.PI / 2.8,
    maxPolarAngle: Math.PI / 1.8
  }));
} // Styling


var fadeIn = (0, _styledComponents.keyframes)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 0.9;\n  }\n"])));

var DialogContent = _styledComponents.default.div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  animation: ", " ease-in-out 0.5s;\n  animation-iteration-count: 1;\n  animation-fill-mode: forwards;\n\n  text-align: left;\n  background: ", ";\n\n  color: white;\n  padding: 10px 20px;\n  border-radius: 5px;\n\n  font-family: monospace;\n"])), fadeIn, brandPalette[1]);

var DialogImage = _styledComponents.default.img(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  width: 200px;\n\n  &:hover {\n    cursor: pointer;\n  }\n"])));

var DialogTitle = _styledComponents.default.h1(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  font-size: 12pt;\n  font-weight: bold;\n  text-transform: uppercase;\n  float: left;\n  width: 100px;\n\n  &:hover {\n    cursor: pointer;\n  }\n"])));

var DialogLabel = _styledComponents.default.div(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  background-color: ", ";\n  color: ", ";\n  border-radius: 20px;\n  padding: 5px;\n  margin-top: 10px;\n\n  float: right;\n  font-weight: bold;\n  font-size: 10pt;\n  text-transform: uppercase;\n"])), brandPalette[0], brandPalette[1]);

var DialogHash = _styledComponents.default.div(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n  padding-top: 5px;\n"])), brandPalette[2]);

var _default = ThreeCanary;
exports.default = _default;