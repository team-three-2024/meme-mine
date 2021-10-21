"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.object.assign.js");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/slicedToArray"));

var THREE = _interopRequireWildcard(require("three"));

var _react = _interopRequireWildcard(require("react"));

var _fiber = require("@react-three/fiber");

var _drei = require("@react-three/drei");

var _postprocessing = require("@react-three/postprocessing");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var color = new THREE.Color();
var brandPalette = [0x01ffff, 0xe6007a, 0xffffff, 0x000000]; // Generate a random integer between min and max

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

function Points(_ref) {
  var range = _ref.range;

  // Note: useGLTF caches it already
  var _useGLTF = (0, _drei.useGLTF)('/assets/canary.glb'),
      nodes = _useGLTF.nodes,
      materials = _useGLTF.materials; // Or nodes.Scene.children[0].geometry.attributes.position


  var positions = nodes.canary.geometry.attributes.position;
  var randomIndexes = randomN(0, positions.count, range);
  var selectedPositions = randomIndexes.map(function (i) {
    return [positions.getX(i), positions.getY(i), positions.getZ(i)];
  });
  (0, _react.useLayoutEffect)(function () {// nodes.canary.position.setY(-5)
    // nodes.canary.scale.set(4, 4, 4)
  }, [nodes, materials]);
  return /*#__PURE__*/_react.default.createElement(_drei.Instances, {
    range: range,
    material: new THREE.MeshBasicMaterial(),
    geometry: new THREE.SphereGeometry(0.2)
  }, selectedPositions.map(function (position, i) {
    return /*#__PURE__*/_react.default.createElement(Point, {
      key: i,
      position: position
    });
  }));
}

function Point(_ref2) {
  var position = _ref2.position;
  var ref = (0, _react.useRef)();

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      hovered = _useState2[0],
      setHover = _useState2[1];

  (0, _fiber.useFrame)(function (state) {
    ref.current.position.copy(new THREE.Vector3(position[0], -position[2], position[1]));
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = 0.02;
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 2 : 1, 0.1);
    ref.current.color.lerp(color.set(hovered ? brandPalette[0] : brandPalette[1]), hovered ? 1 : 0.1);
  });
  return /*#__PURE__*/_react.default.createElement("group", {
    scale: 0.4
  }, /*#__PURE__*/_react.default.createElement(_drei.Instance, {
    ref: ref,
    onPointerOver: function onPointerOver(e) {
      return e.stopPropagation(), setHover(true);
    },
    onPointerOut: function onPointerOut() {
      return setHover(false);
    }
  }));
}

function Model(props) {
  var _useGLTF2 = (0, _drei.useGLTF)('/assets/canary.glb'),
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

function ThreeCanary(props) {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_drei.Stats, null), /*#__PURE__*/_react.default.createElement(_fiber.Canvas, {
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
    scale: 0.1
  }), /*#__PURE__*/_react.default.createElement(Points, {
    range: 1500
  }), /*#__PURE__*/_react.default.createElement(_postprocessing.EffectComposer, {
    multisampling: 16
  }, /*#__PURE__*/_react.default.createElement(_postprocessing.Bloom, {
    kernelSize: 2,
    luminanceThreshold: 0.01,
    luminanceSmoothing: 0.05,
    intensity: 0.1
  }), /*#__PURE__*/_react.default.createElement(_postprocessing.Glitch, {
    delay: [5, 10]
  }))), /*#__PURE__*/_react.default.createElement(_drei.OrbitControls, {
    minPolarAngle: Math.PI / 2.8,
    maxPolarAngle: Math.PI / 1.8
  })));
}

var _default = ThreeCanary;
exports.default = _default;