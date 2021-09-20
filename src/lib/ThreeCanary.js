import React, { Component } from "react";

import * as THREE from "three";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

// Generate a random integer between min and max
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// Generate N integer numbers (with no repetition) between mix and max
const randomN = (min, max, n) => {
  let numbers = [];
  while (numbers.length < n) {
    let num = random(min, max);
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
}

class Star {
  setup(color) {
    const pixelRatio = 2;

    this.r = Math.random() * 12 + 3;
    this.phi = Math.random() * Math.PI * 2;
    this.theta = Math.random() * Math.PI;
    this.v = new THREE.Vector2().random().subScalar(0.5).multiplyScalar(0.0007);

    this.x = this.r * Math.sin(this.phi) * Math.sin(this.theta);
    this.y = this.r * Math.cos(this.phi);
    this.z = this.r * Math.sin(this.phi) * Math.cos(this.theta);

    this.size = Math.random() * 4 + 0.5 * pixelRatio;
    this.color = color;
  }
  update() {
    this.phi += this.v.x;
    this.theta += this.v.y;
    this.x = this.r * Math.sin(this.phi) * Math.sin(this.theta);
    this.y = this.r * Math.cos(this.phi);
    this.z = this.r * Math.sin(this.phi) * Math.cos(this.theta);
  }
}

class ThreeCanary extends Component {
  constructor(props) {
    super(props);
    this.objectUrl = props.objectUrl;
    this.propsOnNodeSelected = props.onNodeSelected;
    this.propsNodes = props.nodes;
    this.brandPalette = [0x01ffff, 0xe6007a, 0xffffff, 0x000000];

    this.glitchRunning = false;
  }

  componentDidMount() {
    this.addScene();
    this.addRenderer();
    this.addCamera();
    this.addEffects();
    this.addControls();
    this.addLights();
    this.addMaterials();
    this.addModels();

    const stars = [];
    const galaxyGeometryVertices = [];
    const galaxyGeometryColors = [];
    const galaxyGeometrySizes = [];

    let galaxyColors = [
      new THREE.Color("#f9fbf2").multiplyScalar(0.8),
      new THREE.Color("#ffede1").multiplyScalar(0.8),
      new THREE.Color("#05c7f2").multiplyScalar(0.8),
      new THREE.Color("#0597f2").multiplyScalar(0.8),
      new THREE.Color("#0476d9").multiplyScalar(0.8)
    ];

    const sparklesMaterial = new THREE.PointsMaterial( {
      color: this.brandPalette[1],
      size: 15,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: false,
      opacity: 0.1
    } );

    for (let i = 0; i < 5000; i++) {
      const star = new Star();
      star.setup(galaxyColors[Math.floor(Math.random() * galaxyColors.length)]);
      galaxyGeometryVertices.push(star.x, star.y, star.z);
      galaxyGeometryColors.push(star.color.r, star.color.g, star.color.b);
      galaxyGeometrySizes.push(star.size);
      stars.push(star);
    }
    const starsGeometry = new THREE.SphereGeometry( 10, 10, 10 );
    this.starsGeometry = starsGeometry;
    // starsGeometry.scale(20,2,2);
    // const starsGeometry = new THREE.BufferGeometry();
    // starsGeometry.setAttribute(
    //   "size",
    //   new THREE.Float32BufferAttribute(galaxyGeometrySizes, 1)
    // );
    // starsGeometry.setAttribute(
    //   "color",
    //   new THREE.Float32BufferAttribute(galaxyGeometryColors, 3)
    // );
    this.galaxyPoints = new THREE.Points(starsGeometry, sparklesMaterial);
    
    this.galaxyPoints.scale.set(2, 1, 1);
    this.stars = stars;
    this.scene.add(this.galaxyPoints);

    
    this.renderScene();
    this.start();
  }

  addScene() {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    // this.scene.fog = new THREE.Fog( this.brandPalette[0], 100, 200 );
  }

  addRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#000000");
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.mount.appendChild(this.renderer.domElement);
  }

  addCamera() {
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 1, 3000);
    this.camera.position.z = 12;
    this.camera.position.y = 10;
    this.camera.position.x = 20;
  }

  addEffects() {
    const renderScene = new RenderPass(this.scene, this.camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.mount.offsetWidth, this.mount.offsetHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 0.8;
    bloomPass.radius = 0.4;

    const glitchPass = new GlitchPass();
    this.glitchEffect = glitchPass;
    this.glitchEffect.enabled = false;

    const composer = new EffectComposer(this.renderer);
    composer.setPixelRatio(2);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(glitchPass);

    this.composer = composer;
  }

  addControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Raycaster from camera to vertex pointer so we can interactive with 3D vertices
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    // this.raycaster.params.Points.threshold = 2;
    this.hoveredNodes = [];
    this.hoveredNodesObjs = [];
    this.clickedNodes = [];
    this.selectedNode = null;

    // window.addEventListener("resize", this.onWindowResize);
    document.addEventListener("pointermove", this.onPointerMove);

    if (this.renderer) {
      this.renderer.domElement.addEventListener("click", this.onNodeClicked, true);
    }
  }

  addLights() {
    const lights = [];

    lights[0] = new THREE.PointLight( this.brandPalette[0], 10, 50 );
    lights[1] = new THREE.PointLight( this.brandPalette[1], 10, 50 );
    lights[2] = new THREE.PointLight( this.brandPalette[2], 5, 50 );

    lights[0].position.set(15, 0, 0);
    lights[1].position.set(-15, 0, 0);
    lights[2].position.set(0, 15, 0);

    this.lights = lights;

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);

    this.scene.add( new THREE.AmbientLight( 0x404040 ) );
    // this.scene.add(lights[2]);

    // this.scene.add( new THREE.PointLightHelper( lights[0], 3 ) );
    // this.scene.add( new THREE.PointLightHelper( lights[1], 3 ) );
    // this.scene.add( new THREE.PointLightHelper( lights[2], 3 ) );

    // const gridHelper = new THREE.GridHelper( 400, 40, 0x222222, 0x222222 );
    // gridHelper.position.y = -3;
    // gridHelper.position.x = 0;
    // gridHelper.position.z = 0;
    // this.scene.add( gridHelper );
  }

  addMaterials() {
    // TODO: Move to brand color pallet
    this.canaryMtlMesh =  new THREE.PointsMaterial( {
      color: this.brandPalette[0],
      size: 15,
      vertexColors: true
    });
    // this.canaryMtlPoints = new THREE.PointsMaterial( {
    //   color: 0x8200f9,
    //   size: 0.1
    // } );
  }

  addModels() {
    const gltfLoader = new GLTFLoader()

    gltfLoader.load(
      this.objectUrl,
      gltf => {
        
        if (!gltf.scene) {
          throw new Error(
            "Loaded model contains no scene!"
          );
        }

        const object = gltf.scene.children[0];

        // object.geometry.computeTangents();

        if (!object) {
          throw new Error(
            "Loaded model contains no objects!"
          );
        }

        const uniforms = {
          "time": {
            value: 0.2
          }
        };
        this.uniforms = uniforms;
        const vertexShader = `
          varying vec2 vUv;

          void main()	{
    
            vUv = uv;
    
            gl_Position = vec4( position, 1.0 );
    
          }
        `;
        const fragmentShader = `
          varying vec2 vUv;

          uniform float time;
    
          void main()	{
    
            vec2 p = - 1.0 + 2.0 * vUv;
            float a = time * 40.0;
            float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;
    
            e = 400.0 * ( p.x * 0.5 + 0.5 );
            f = 400.0 * ( p.y * 0.5 + 0.5 );
            i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
            d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;
            r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
            q = f / r;
            e = ( r * cos( q ) ) - a / 2.0;
            f = ( r * sin( q ) ) - a / 2.0;
            d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;
            h = ( ( f + d ) + a / 2.0 ) * g;
            i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
            h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
            h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
            i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g ) + tan( r * g + h ) * 184.0 * cos( r * g + h );
            i = mod( i / 5.6, 256.0 ) / 64.0;
            if ( i < 0.0 ) i += 4.0;
            if ( i >= 2.0 ) i = 4.0 - i;
            d = r / 350.0;
            d += sin( d * d * 8.0 ) * 0.52;
            f = ( sin( a * g ) + 1.0 ) / 2.0;
            gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );
    
          }
        `;

        const shaderMaterial = new THREE.ShaderMaterial( {

          uniforms: uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          alphaTest: 1.0,
          transparent: true

        } );

        this.canaryMesh = new THREE.Mesh( object.geometry, shaderMaterial);
        this.canaryMesh = object;
        this.canaryMesh.position.setY(-2);
        // this.canaryMesh.rotation.z = Math.PI/4;
        this.canaryMesh.scale.set(4, 4, 4);

        // this.canaryMesh.material = shaderMaterial;
        this.canaryMesh.material.wireframe = true;
        this.canaryMesh.needsUpdate = true;
        this.canaryMesh.material.transparent = true;
        this.canaryMesh.material.opacity = 0.1;
        this.canaryMesh.material.depthTest = false;
        this.scene.add( this.canaryMesh );
        
        const wireframe = new THREE.WireframeGeometry( object.geometry );
        let line = new THREE.LineSegments( wireframe );
        line.material.depthTest = false;
        line.material.opacity = 0.1;
        line.material.transparent = true;

        line.position.setY(-2);
        // line.rotation.y = -Math.PI/4;
        line.rotation.x = Math.PI/2;
        line.scale.set(4, 4, 4);

        // line.position.x = 4;
        // group.add( line );
        this.scene.add( line );

        // It's a group, traverse it
        object.traverse((child) => {
          if (child.isMesh) {

            // Create point clouds based on mesh
            var childGeometry = child.geometry.clone();

            // Create a group of meshes as a point cloud instead of points, to have
            // per-mesh control
            let pos = childGeometry.attributes.position;
            let numMeshPoints = pos.count;

            // Randomly select n mesh points to use as placement for propsNodes
            this.propsNodesIndexes = randomN(0, numMeshPoints, this.propsNodes.length);

            this.canaryPointCloudGroup = new THREE.Group();

            for (let i=0; i<this.propsNodesIndexes.length; i+=1) {
              let nodeIndex = this.propsNodesIndexes[i];

              let geometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
              let mtlColor = this.brandPalette[0];
              if (this.propsNodes[i].color) {
                mtlColor = this.propsNodes[i].color;
              }
              let material = new THREE.MeshBasicMaterial( { color: mtlColor } );
              material.wireframe = false;
              material.needsUpdate = true;
              let cube = new THREE.Mesh( geometry );

              cube.position.copy(new THREE.Vector3(pos.getX(nodeIndex), -pos.getZ(nodeIndex), pos.getY(nodeIndex)));
              let _scale = Math.random()*200;
              cube.scale.set(_scale, _scale, _scale);
              this.canaryPointCloudGroup.add( cube );

              // Map mesh ids to propsNodes
              this.propsNodes[i].meshIndex = nodeIndex;
              this.propsNodes[i].meshObj = cube;

            }
            this.canaryPointCloudGroup.position.setY(-2);
            // this.canaryPointCloudGroup.rotation.y = -Math.PI/4;
            this.canaryPointCloudGroup.scale.set(4, 4, 4);
            this.scene.add( this.canaryPointCloudGroup );
          }
        })


      },
      xhr => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      error => {
        console.log("Error while loading: " + error);
      }
    );
  }

  onPointerMove = (event) => {
    event.preventDefault();

    // Raycasting have to discount bounding box of rendering canvas
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    this.pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
  }

  onNodeClicked = (event) => {

    if (this.hoveredNodes) {

      for (let i=0; i<this.hoveredNodesObjs.length; i+=1) {
        if (this.selectedNode !== this.hoveredNodesObjs[i]) {
          // If node is hovered and we click on it, put it on selectedNode
          this.selectedNode = this.hoveredNodesObjs[i];

          // Map clicked mesh to propsNodes and call props' callback function
          for (let j=0; j<this.propsNodes.length; j+=1) {
            if (this.propsNodes[j].meshObj === this.hoveredNodesObjs[i]) {
              // Call callback function passing clicked props Nodes as argument
              if (this.propsOnNodeSelected) {
                this.propsOnNodeSelected(this.propsNodes[j]);
              }
            }
          }
        } else {
          // If we click again in a node, remove from selectedNode
          this.selectedNode = null;
        }
      }

    }

  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    
    const delta = this.clock.getDelta();
    const time = -performance.now() * 0.0005;


    this.galaxyPoints.rotation.y += 0.005;
    // Change shader params
    if (this.uniforms)
      this.uniforms[ "time" ].value += delta * 5;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    this.camera.lookAt( this.scene.position );

    this.hoveredNodes = [];
    this.hoveredNodesObjs = [];
    if (this.canaryPointCloudGroup) {
      const intersects = this.raycaster.intersectObject(this.canaryPointCloudGroup, true);
      if (intersects != null && intersects.length > 0) {
        for (let i=0; i<intersects.length; i+=1) {
          if (!this.hoveredNodes.includes(intersects[i].object.id))
            this.hoveredNodes.push(intersects[i].object.id);
        }
      }

      // Render hovered nodes
      for (let i=0; i<this.canaryPointCloudGroup.children.length; i+=1) {

        if (this.hoveredNodes.includes(this.canaryPointCloudGroup.children[i].id)) {
          
          // Hovered node style
          this.canaryPointCloudGroup.children[i].material.color.set( this.brandPalette[2] );
          this.canaryPointCloudGroup.children[i].material.wireframe = false;
          const s = 0.1;
          this.canaryPointCloudGroup.children[i].scale.set(s, s, s);
          this.canaryPointCloudGroup.children[i].rotateX(Math.sin(this.frameId / 70)/20);
          this.canaryPointCloudGroup.children[i].rotateY(Math.sin(this.frameId / 100)/20);
          this.canaryPointCloudGroup.children[i].rotateZ(Math.sin(this.frameId / 80)/20);
          this.hoveredNodesObjs.push(this.canaryPointCloudGroup.children[i]);
        } else {

          // Default node style, from propsNodes' color
          for (let j=0; j<this.propsNodes.length; j+=1) {
            if (this.propsNodes[j].meshObj === this.canaryPointCloudGroup.children[i]) {
              this.canaryPointCloudGroup.children[i].material.color.set( this.propsNodes[j].color );
            }
          }
          this.canaryPointCloudGroup.children[i].material.wireframe = false;
          this.canaryPointCloudGroup.children[i].scale.set(0.05, 0.05, 0.05);
        }
      }    

    }

    if (this.lights) {

      this.lights[0].position.x = Math.sin( time * 0.7 ) * 30;
      this.lights[0].position.y = Math.cos( time * 0.5 ) * 40;
      this.lights[0].position.z = Math.cos( time * 0.3 ) * 30;

      this.lights[1].position.x = Math.cos( time * 0.3 ) * 30;
      this.lights[1].position.y = Math.sin( time * 0.5 ) * 40;
      this.lights[1].position.z = Math.sin( time * 0.7 ) * 30;

      this.lights[2].position.x = Math.sin( time * 0.7 ) * 30;
      this.lights[2].position.y = Math.cos( time * 0.3 ) * 40;
      this.lights[2].position.z = Math.sin( time * 0.5 ) * 30;

    }

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);

    if (this.frameId%120 === 0) {
      this.glitchEffect.enabled = true;
    }

    if (this.frameId%160 === 0) {
      this.glitchEffect.enabled = false;
    }

    let tempStarsArray = [];
    this.stars.forEach((s) => {
      s.update();
      tempStarsArray.push(s.x, s.y, s.z);
    });
  
    this.starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(tempStarsArray, 3));

    this.composer.render();
  }

  renderScene = () => {
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        style={{ width: "100%", height: "900px" }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }

}

export default ThreeCanary;
