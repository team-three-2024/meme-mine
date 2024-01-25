"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StartScreen = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

var _drei = require("@react-three/drei");

var _fiber = require("@react-three/fiber");

var _postprocessing = require("@react-three/postprocessing");

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _Game = require("./Game");

var _Canary = require("../components/Canary");

var _Lights = require("../components/Lights");

var _config = require("../config");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

const StartScreen = () => {
  const [showStartScreen, setShowStartScreen] = (0, _react.useState)(true);
  (0, _react.useEffect)(() => {
    const handleKeyPress = event => {
      if (event.key === 'Enter') {
        setShowStartScreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  const playerRef = (0, _react.useRef)();
  return showStartScreen ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_fiber.Canvas, {
    shadows: true,
    dpr: [1, 2],
    camera: {
      position: [3, 1, 3],
      fov: 50
    },
    performance: {
      min: 0.1
    }
  }, /*#__PURE__*/_react.default.createElement(_Lights.Lights, {
    config: _config.canaryConfig
  }), /*#__PURE__*/_react.default.createElement(_react.Suspense, {
    fallback: null
  }, /*#__PURE__*/_react.default.createElement(_Canary.Canary, {
    animation: "idle",
    speed: "1",
    position: [0, 0.2, 0],
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
  })), /*#__PURE__*/_reactDom.default.createPortal( /*#__PURE__*/_react.default.createElement(OverlayContainer, null, /*#__PURE__*/_react.default.createElement(Title, null, "canary in a meme mine"), /*#__PURE__*/_react.default.createElement(Subtitle, null, "press enter to start")), document.body)) : /*#__PURE__*/_react.default.createElement(_Game.Game, null);
};

exports.StartScreen = StartScreen;
const blinkAnimation = (0, _styledComponents.keyframes)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0; }\n"])));

const OverlayContainer = _styledComponents.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  pointer-events: none;\n"])));

const Title = _styledComponents.default.h1(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  color: #fff;\n  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;\n"])));

const Subtitle = _styledComponents.default.h2(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  color: #fff;\n  margin-top: 100px;\n  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;\n  animation: ", " 1500ms linear infinite;\n"])), blinkAnimation);