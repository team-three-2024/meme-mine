"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = void 0;

var _drei = require("@react-three/drei");

var _fiber = require("@react-three/fiber");

var _postprocessing = require("@react-three/postprocessing");

var _react = _interopRequireWildcard(require("react"));

var _CameraController = require("../components/CameraController");

var _Canary = require("../components/Canary");

var _Lights = require("../components/Lights");

var _Obstacle = require("../components/Obstacle");

var _Path = require("../components/Path");

var _config = require("../config");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Game = () => {
  const playerRef = (0, _react.useRef)();
  return /*#__PURE__*/_react.default.createElement(_fiber.Canvas, {
    shadows: true,
    dpr: [1, 2],
    camera: {
      position: _config.canaryConfig.cameraPosition,
      fov: 50
    },
    performance: {
      min: 0.1
    }
  }, /*#__PURE__*/_react.default.createElement(_CameraController.CameraController, null), /*#__PURE__*/_react.default.createElement(_Lights.Lights, {
    config: _config.canaryConfig
  }), /*#__PURE__*/_react.default.createElement(_Path.Path, {
    ref: playerRef
  }), /*#__PURE__*/_react.default.createElement(_Obstacle.Obstacle, {
    ref: playerRef
  }), /*#__PURE__*/_react.default.createElement(_react.Suspense, {
    fallback: null
  }, /*#__PURE__*/_react.default.createElement(_Canary.Canary, {
    animation: "walk",
    speed: "3",
    scale: _config.canaryConfig.model.scale,
    meshColorIndex: _config.canaryConfig.meshColorIndex,
    meshScale: _config.canaryConfig.meshScale,
    model: _config.canaryConfig.model,
    ref: playerRef
  }), /*#__PURE__*/_react.default.createElement(_postprocessing.EffectComposer, {
    multisampling: 16
  }, /*#__PURE__*/_react.default.createElement(_postprocessing.Bloom, {
    kernelSize: _config.canaryConfig.bloom.kernelSize,
    luminanceThreshold: _config.canaryConfig.bloom.luminanceThreshold,
    luminanceSmoothing: _config.canaryConfig.bloom.luminanceSmoothing,
    intensity: _config.canaryConfig.bloom.intensity
  }))), /*#__PURE__*/_react.default.createElement(_drei.OrbitControls, {
    minPolarAngle: Math.PI / 2.8,
    maxPolarAngle: Math.PI / 1.8
  }));
};

exports.Game = Game;