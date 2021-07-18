import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import React, { Component } from "react";
import * as THREE from "three";
import { OBJLoader } from "three-obj-mtl-loader";
import OrbitControls from "three-orbitcontrols";

var ThreeCanary = /*#__PURE__*/function (_Component) {
  _inherits(ThreeCanary, _Component);

  function ThreeCanary() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ThreeCanary);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ThreeCanary)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.start = function () {
      if (!_this.frameId) {
        _this.frameId = requestAnimationFrame(_this.animate);
      }
    };

    _this.stop = function () {
      cancelAnimationFrame(_this.frameId);
    };

    _this.animate = function () {
      if (_this.canaryMesh) _this.canaryMesh.rotation.y += 0.01;
      if (_this.canaryPointCloud) _this.canaryPointCloud.rotation.y += 0.01;

      _this.renderScene();

      _this.frameId = window.requestAnimationFrame(_this.animate);
    };

    _this.renderScene = function () {
      if (_this.renderer) _this.renderer.render(_this.scene, _this.camera);
    };

    return _this;
  }

  _createClass(ThreeCanary, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.addScene();
      this.addRenderer();
      this.addCamera();
      this.addControls();
      this.addLights();
      this.addMaterials();
      this.addModels();
      this.renderScene();
      this.start();
    }
  }, {
    key: "addScene",
    value: function addScene() {
      this.width = this.mount.clientWidth;
      this.height = this.mount.clientHeight;
      this.scene = new THREE.Scene();
    }
  }, {
    key: "addRenderer",
    value: function addRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor("#000000");
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.mount.appendChild(this.renderer.domElement);
    }
  }, {
    key: "addCamera",
    value: function addCamera() {
      this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 1, 3000);
      this.camera.position.z = 30;
      this.camera.position.y = 5;
    }
  }, {
    key: "addControls",
    value: function addControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
  }, {
    key: "addLights",
    value: function addLights() {
      var lights = [];
      lights[0] = new THREE.PointLight(0xff00ff, 1, 0);
      lights[1] = new THREE.PointLight(0xffffff, 1, 0);
      lights[2] = new THREE.PointLight(0xffffff, 1, 0);
      lights[0].position.set(0, 200, 0);
      lights[1].position.set(100, 200, 100);
      lights[2].position.set(-100, -200, -100);
      this.scene.add(lights[0]);
      this.scene.add(lights[1]);
      this.scene.add(lights[2]);
    }
  }, {
    key: "addMaterials",
    value: function addMaterials() {
      // TODO: Move to brand color pallet
      this.canaryMtlMesh = new THREE.PointsMaterial({
        color: 0xe6007a
      });
      this.canaryMtlPoints = new THREE.PointsMaterial({
        color: 0x8200f9,
        size: 0.3,
        sizeAttenuation: true
      });
    }
  }, {
    key: "addModels",
    value: function addModels() {
      var _this2 = this;

      var objLoader = new OBJLoader();
      objLoader.load("./assets/canario_3d.obj", function (object) {
        _this2.canaryMesh = object;

        _this2.canaryMesh.position.setY(-2);

        _this2.canaryMesh.scale.set(4, 4, 4);

        _this2.scene.add(_this2.canaryMesh); // It's a group, traverse it


        _this2.canaryMesh.traverse(function (child) {
          if (child.isMesh) {
            // Set material to mesh (eg wireframe)
            child.material = _this2.canaryMtlMesh;
            child.material.wireframe = true;
            child.material.needsUpdate = true;
            child.material.transparent = true; // Create point clouds based on mesh

            var childGeometry = child.geometry.clone();
            _this2.canaryPointCloud = new THREE.Points(childGeometry);

            _this2.canaryPointCloud.position.setY(-2);

            _this2.canaryPointCloud.scale.set(4, 4, 4);

            _this2.canaryPointCloud.material = _this2.canaryMtlPoints;

            _this2.scene.add(_this2.canaryPointCloud);
          }
        });
      }, function (xhr) {// console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      }, function (error) {
        console.log("Error while loading: " + error);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stop();
      this.mount.removeChild(this.renderer.domElement);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return /*#__PURE__*/React.createElement("div", {
        style: {
          width: "800px",
          height: "800px"
        },
        ref: function ref(mount) {
          _this3.mount = mount;
        }
      });
    }
  }]);

  return ThreeCanary;
}(Component);

export default ThreeCanary;
