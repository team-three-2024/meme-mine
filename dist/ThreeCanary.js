import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import React, { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import Stats from 'three/examples/jsm/libs/stats.module.js'; // Generate a random integer between min and max

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

var Star = /*#__PURE__*/function () {
  function Star() {
    _classCallCheck(this, Star);
  }

  _createClass(Star, [{
    key: "setup",
    value: function setup(color) {
      var pixelRatio = 1;
      this.r = Math.random() * 30 + 3;
      this.phi = Math.random() * Math.PI * 2;
      this.theta = Math.random() * Math.PI;
      this.v = new THREE.Vector2().random().subScalar(0.5).multiplyScalar(0.0007);
      this.x = this.r * Math.sin(this.phi) * Math.sin(this.theta);
      this.y = this.r * Math.cos(this.phi);
      this.z = this.r * Math.sin(this.phi) * Math.cos(this.theta);
      this.size = Math.random() * 3 + 0.5 * pixelRatio;
      this.color = color;
    }
  }, {
    key: "update",
    value: function update() {
      this.phi += this.v.x;
      this.theta += this.v.y;
      this.x = this.r * Math.sin(this.phi) * Math.sin(this.theta);
      this.y = this.r * Math.cos(this.phi);
      this.z = this.r * Math.sin(this.phi) * Math.cos(this.theta);
    }
  }]);

  return Star;
}();

var ThreeCanary = /*#__PURE__*/function (_Component) {
  _inherits(ThreeCanary, _Component);

  function ThreeCanary(props) {
    var _this;

    _classCallCheck(this, ThreeCanary);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ThreeCanary).call(this, props));

    _this.onPointerMove = function (event) {
      event.preventDefault(); // Raycasting have to discount bounding box of rendering canvas

      var rect = _this.renderer.domElement.getBoundingClientRect();

      _this.pointer.x = (event.clientX - rect.left) / (rect.right - rect.left) * 2 - 1;
      _this.pointer.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    };

    _this.onNodeClicked = function (event) {
      if (_this.hoveredNodes) {
        for (var i = 0; i < _this.hoveredNodesObjs.length; i += 1) {
          if (_this.selectedNode !== _this.hoveredNodesObjs[i]) {
            // If node is hovered and we click on it, put it on selectedNode
            _this.selectedNode = _this.hoveredNodesObjs[i]; // Map clicked mesh to propsNodes and call props' callback function

            for (var j = 0; j < _this.propsNodes.length; j += 1) {
              if (_this.propsNodes[j].meshObj === _this.hoveredNodesObjs[i]) {
                // Call callback function passing clicked props Nodes as argument
                if (_this.propsOnNodeSelected) {
                  _this.propsOnNodeSelected(_this.propsNodes[j]);
                }
              }
            }
          } else {
            // If we click again in a node, remove from selectedNode
            _this.selectedNode = null;
          }
        }
      }
    };

    _this.onWindowResize = function () {
      _this.camera.aspect = window.innerWidth / window.innerHeight;

      _this.camera.updateProjectionMatrix();

      _this.renderer.setSize(window.innerWidth, window.innerHeight);

      _this.renderer.setPixelRatio(window.devicePixelRatio);
    };

    _this.start = function () {
      if (!_this.frameId) {
        _this.frameId = requestAnimationFrame(_this.animate);
      }
    };

    _this.stop = function () {
      cancelAnimationFrame(_this.frameId);
    };

    _this.animate = function () {
      var delta = _this.clock.getDelta();

      var time = -performance.now() * 0.0005;
      _this.galaxyPoints.rotation.y += 0.002; // Change shader params

      if (_this.uniforms) _this.uniforms["time"].value += delta * 5;

      _this.raycaster.setFromCamera(_this.pointer, _this.camera);

      _this.camera.lookAt(_this.scene.position);

      _this.hoveredNodes = [];
      _this.hoveredNodesObjs = [];

      if (_this.canaryPointCloudGroup) {
        var intersects = _this.raycaster.intersectObject(_this.canaryPointCloudGroup, true);

        if (intersects != null && intersects.length > 0) {
          for (var i = 0; i < intersects.length; i += 1) {
            if (!_this.hoveredNodes.includes(intersects[i].object.id)) _this.hoveredNodes.push(intersects[i].object.id);
          }
        } // Render hovered nodes


        for (var _i = 0; _i < _this.canaryPointCloudGroup.children.length; _i += 1) {
          if (_this.hoveredNodes.includes(_this.canaryPointCloudGroup.children[_i].id)) {
            // Hovered node style
            _this.canaryPointCloudGroup.children[_i].material.color.set(_this.brandPalette[2]);

            _this.canaryPointCloudGroup.children[_i].material.wireframe = false;
            var s = 0.2;

            _this.canaryPointCloudGroup.children[_i].scale.set(s, s, s);

            _this.canaryPointCloudGroup.children[_i].rotateX(Math.sin(_this.frameId / 70) / 20);

            _this.canaryPointCloudGroup.children[_i].rotateY(Math.sin(_this.frameId / 100) / 20);

            _this.canaryPointCloudGroup.children[_i].rotateZ(Math.sin(_this.frameId / 80) / 20);

            _this.hoveredNodesObjs.push(_this.canaryPointCloudGroup.children[_i]);
          } else {
            // Default node style, from propsNodes' color
            for (var j = 0; j < _this.propsNodes.length; j += 1) {
              if (_this.propsNodes[j].meshObj === _this.canaryPointCloudGroup.children[_i]) {
                _this.canaryPointCloudGroup.children[_i].material.color.set(_this.propsNodes[j].color);
              }
            }

            _this.canaryPointCloudGroup.children[_i].material.wireframe = false;

            _this.canaryPointCloudGroup.children[_i].scale.set(0.05, 0.05, 0.05);
          }
        }
      }

      if (_this.lights) {
        _this.lights[0].position.x = Math.sin(time * 0.7) * 30;
        _this.lights[0].position.y = Math.cos(time * 0.5) * 40;
        _this.lights[0].position.z = Math.cos(time * 0.3) * 30;
        _this.lights[1].position.x = Math.cos(time * 0.3) * 30;
        _this.lights[1].position.y = Math.sin(time * 0.5) * 40;
        _this.lights[1].position.z = Math.sin(time * 0.7) * 30;
        _this.lights[2].position.x = Math.sin(time * 0.7) * 30;
        _this.lights[2].position.y = Math.cos(time * 0.3) * 40;
        _this.lights[2].position.z = Math.sin(time * 0.5) * 30;
      }

      _this.renderScene();

      _this.frameId = window.requestAnimationFrame(_this.animate);

      if (_this.frameId % 220 === 0) {
        _this.glitchEffect.enabled = true;
      }

      if (_this.frameId % 230 === 0) {
        _this.glitchEffect.enabled = false;
      }

      var tempStarsArray = [];

      _this.stars.forEach(function (s) {
        s.update();
        tempStarsArray.push(s.x, s.y, s.z);
      });

      _this.starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(tempStarsArray, 3));

      _this.composer.render();

      if (_this.isDebug) _this.stats.update();
    };

    _this.renderScene = function () {
      if (_this.renderer) _this.renderer.render(_this.scene, _this.camera);
    };

    _this.objectUrl = props.objectUrl;
    _this.propsOnNodeSelected = props.onNodeSelected;
    _this.propsNodes = props.nodes;
    _this.brandPalette = [0x01ffff, 0xe6007a, 0xffffff, 0x000000];
    console.log(_this.isDebug, props.debug);
    _this.isDebug = false;

    if (props.debug) {
      _this.isDebug = true;
    }

    _this.glitchRunning = false;
    return _this;
  }

  _createClass(ThreeCanary, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.addScene();
      this.addRenderer();
      this.addCamera();
      this.addEffects();
      this.addControls();
      this.addLights();
      this.addMaterials();
      this.addModels();
      this.addGalaxy();
      this.renderScene();
      this.start();
    }
  }, {
    key: "addScene",
    value: function addScene() {
      this.width = this.mount.clientWidth;
      this.height = this.mount.clientHeight;
      this.scene = new THREE.Scene();
      this.clock = new THREE.Clock();
      this.scene.fog = new THREE.Fog(this.brandPalette[1], 20, 100);
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

      if (this.isDebug) {
        this.stats = new Stats();
        this.mount.appendChild(this.stats.dom);
      }
    }
  }, {
    key: "addCamera",
    value: function addCamera() {
      this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 1, 3000);
      this.camera.position.z = 12;
      this.camera.position.y = 10;
      this.camera.position.x = 20;
    }
  }, {
    key: "addEffects",
    value: function addEffects() {
      var renderScene = new RenderPass(this.scene, this.camera);
      var bloomPass = new UnrealBloomPass(new THREE.Vector2(this.mount.offsetWidth, this.mount.offsetHeight), 1.5, 0.4, 0.85);
      bloomPass.threshold = 0;
      bloomPass.strength = 2;
      bloomPass.radius = 0.4;
      var glitchPass = new GlitchPass();
      this.glitchEffect = glitchPass;
      this.glitchEffect.enabled = false;
      var composer = new EffectComposer(this.renderer);
      composer.setPixelRatio(2);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
      composer.addPass(glitchPass);
      this.composer = composer;
    }
  }, {
    key: "addControls",
    value: function addControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement); // Raycaster from camera to vertex pointer so we can interactive with 3D vertices

      this.pointer = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster(); // this.raycaster.params.Points.threshold = 2;

      this.hoveredNodes = [];
      this.hoveredNodesObjs = [];
      this.clickedNodes = [];
      this.selectedNode = null;
      window.addEventListener("resize", this.onWindowResize);
      document.addEventListener("pointermove", this.onPointerMove);

      if (this.renderer) {
        this.renderer.domElement.addEventListener("click", this.onNodeClicked, true);
      }
    }
  }, {
    key: "addLights",
    value: function addLights() {
      var lights = [];
      lights[0] = new THREE.PointLight(this.brandPalette[0], 10, 50);
      lights[1] = new THREE.PointLight(this.brandPalette[1], 10, 50);
      lights[2] = new THREE.PointLight(this.brandPalette[2], 5, 50);
      lights[0].position.set(15, 0, 0);
      lights[1].position.set(-15, 0, 0);
      lights[2].position.set(0, 15, 0);
      this.lights = lights;
      this.scene.add(lights[0]);
      this.scene.add(lights[1]);
      this.scene.add(new THREE.AmbientLight(0x404040)); // this.scene.add(lights[2]);
      // this.scene.add( new THREE.PointLightHelper( lights[0], 3 ) );
      // this.scene.add( new THREE.PointLightHelper( lights[1], 3 ) );
      // this.scene.add( new THREE.PointLightHelper( lights[2], 3 ) );

      var gridHelper = new THREE.GridHelper(400, 40, 0x222222, 0x222222);
      gridHelper.position.y = -3;
      gridHelper.position.x = 0;
      gridHelper.position.z = 0;
      this.scene.add(gridHelper);
    }
  }, {
    key: "addMaterials",
    value: function addMaterials() {
      this.canaryMtlMesh = new THREE.PointsMaterial({
        color: this.brandPalette[0],
        size: 15,
        vertexColors: true
      }); // this.canaryMtlPoints = new THREE.PointsMaterial( {
      //   color: 0x8200f9,
      //   size: 0.1
      // } );
    }
  }, {
    key: "addModels",
    value: function addModels() {
      var _this2 = this;

      var gltfLoader = new GLTFLoader();
      gltfLoader.load(this.objectUrl, function (gltf) {
        if (!gltf.scene) {
          throw new Error("Loaded model contains no scene!");
        }

        var object = gltf.scene.children[0]; // object.geometry.computeTangents();

        if (!object) {
          throw new Error("Loaded model contains no objects!");
        }

        var uniforms = {
          "time": {
            value: 0.2
          }
        };
        _this2.uniforms = uniforms;
        var vertexShader = "\n          varying vec2 vUv;\n\n          void main()\t{\n    \n            vUv = uv;\n    \n            gl_Position = vec4( position, 1.0 );\n    \n          }\n        ";
        var fragmentShader = "\n          varying vec2 vUv;\n\n          uniform float time;\n    \n          void main()\t{\n    \n            vec2 p = - 1.0 + 2.0 * vUv;\n            float a = time * 40.0;\n            float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;\n    \n            e = 400.0 * ( p.x * 0.5 + 0.5 );\n            f = 400.0 * ( p.y * 0.5 + 0.5 );\n            i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;\n            d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;\n            r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );\n            q = f / r;\n            e = ( r * cos( q ) ) - a / 2.0;\n            f = ( r * sin( q ) ) - a / 2.0;\n            d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;\n            h = ( ( f + d ) + a / 2.0 ) * g;\n            i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );\n            h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;\n            h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;\n            i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g ) + tan( r * g + h ) * 184.0 * cos( r * g + h );\n            i = mod( i / 5.6, 256.0 ) / 64.0;\n            if ( i < 0.0 ) i += 4.0;\n            if ( i >= 2.0 ) i = 4.0 - i;\n            d = r / 350.0;\n            d += sin( d * d * 8.0 ) * 0.52;\n            f = ( sin( a * g ) + 1.0 ) / 2.0;\n            gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );\n    \n          }\n        ";
        var shaderMaterial = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          alphaTest: 1.0,
          transparent: true
        });
        _this2.canaryMesh = new THREE.Mesh(object.geometry, shaderMaterial);
        _this2.canaryMesh = object;

        _this2.canaryMesh.position.setY(-2); // this.canaryMesh.rotation.z = Math.PI/4;


        _this2.canaryMesh.scale.set(4, 4, 4); // this.canaryMesh.material = shaderMaterial;


        _this2.canaryMesh.material.wireframe = true;
        _this2.canaryMesh.needsUpdate = true;
        _this2.canaryMesh.material.transparent = true;
        _this2.canaryMesh.material.opacity = 0.1;
        _this2.canaryMesh.material.depthTest = false;

        _this2.scene.add(_this2.canaryMesh);

        var wireframe = new THREE.WireframeGeometry(object.geometry);
        var line = new THREE.LineSegments(wireframe);
        line.material.depthTest = false;
        line.material.opacity = 0.1;
        line.material.transparent = true;
        line.position.setY(-2); // line.rotation.y = -Math.PI/4;

        line.rotation.x = Math.PI / 2;
        line.scale.set(4, 4, 4); // line.position.x = 4;
        // group.add( line );
        // this.scene.add( line );
        // It's a group, traverse it

        object.traverse(function (child) {
          if (child.isMesh) {
            // Create point clouds based on mesh
            var childGeometry = child.geometry.clone(); // Create a group of meshes as a point cloud instead of points, to have
            // per-mesh control

            var pos = childGeometry.attributes.position;
            var numMeshPoints = pos.count; // Randomly select n mesh points to use as placement for propsNodes

            _this2.propsNodesIndexes = randomN(0, numMeshPoints, _this2.propsNodes.length);
            _this2.canaryPointCloudGroup = new THREE.Group();

            for (var i = 0; i < _this2.propsNodesIndexes.length; i += 1) {
              var nodeIndex = _this2.propsNodesIndexes[i];
              var geometry = new THREE.SphereGeometry(0.25);
              var mtlColor = _this2.brandPalette[0];

              if (_this2.propsNodes[i].color) {
                mtlColor = _this2.propsNodes[i].color;
              }

              var material = new THREE.MeshBasicMaterial({
                color: mtlColor
              });
              material.wireframe = false;
              material.needsUpdate = true;
              var cube = new THREE.Mesh(geometry);
              cube.position.copy(new THREE.Vector3(pos.getX(nodeIndex), -pos.getZ(nodeIndex), pos.getY(nodeIndex)));

              var _scale = Math.random() * 200;

              cube.scale.set(_scale, _scale, _scale);

              _this2.canaryPointCloudGroup.add(cube); // Map mesh ids to propsNodes


              _this2.propsNodes[i].meshIndex = nodeIndex;
              _this2.propsNodes[i].meshObj = cube;
            }

            _this2.canaryPointCloudGroup.position.setY(-2); // this.canaryPointCloudGroup.rotation.y = -Math.PI/4;


            _this2.canaryPointCloudGroup.scale.set(4, 4, 4);

            _this2.scene.add(_this2.canaryPointCloudGroup);
          }
        });
      }, function (xhr) {
        console.log(xhr.loaded / xhr.total * 100 + "% loaded");
      }, function (error) {
        console.log("Error while loading: " + error);
      });
    }
  }, {
    key: "addGalaxy",
    value: function addGalaxy() {
      var stars = [];
      var galaxyGeometryVertices = [];
      var galaxyGeometryColors = [];
      var galaxyGeometrySizes = [];
      var galaxyColors = [new THREE.Color("#f9fbf2").multiplyScalar(0.8), new THREE.Color("#ffede1").multiplyScalar(0.8), new THREE.Color("#05c7f2").multiplyScalar(0.8), new THREE.Color("#0597f2").multiplyScalar(0.8), new THREE.Color("#0476d9").multiplyScalar(0.8)];
      var sparklesMaterial = new THREE.PointsMaterial({
        color: this.brandPalette[0],
        size: 15,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false,
        opacity: 0.02
      });

      for (var i = 0; i < 200; i++) {
        var star = new Star();
        star.setup(galaxyColors[Math.floor(Math.random() * galaxyColors.length)]);
        galaxyGeometryVertices.push(star.x, star.y, star.z);
        galaxyGeometryColors.push(star.color.r, star.color.g, star.color.b);
        galaxyGeometrySizes.push(star.size);
        stars.push(star);
      }

      var starsGeometry = new THREE.SphereGeometry(1);
      this.starsGeometry = starsGeometry;
      this.galaxyPoints = new THREE.Points(starsGeometry, sparklesMaterial);
      this.galaxyPoints.scale.set(2, 2, 2);
      this.stars = stars;
      this.scene.add(this.galaxyPoints);
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
          width: "100%",
          height: "900px"
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