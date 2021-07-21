import React, { Component } from "react";
import * as THREE from "three";
import { OBJLoader } from "three-obj-mtl-loader";
import OrbitControls from "three-orbitcontrols";

class ThreeCanary extends Component {
  constructor(props) {
    super(props);
    this.objectUrl = props.objectUrl;
  }

  componentDidMount() {
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

  addScene() {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.scene = new THREE.Scene();
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
    this.camera.position.z = 30;
    this.camera.position.y = 5;
  }

  addControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  addLights() {
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

  addMaterials() {
    // TODO: Move to brand color pallet
    this.canaryMtlMesh =  new THREE.PointsMaterial( { color: 0xe6007a });
    this.canaryMtlPoints = new THREE.PointsMaterial( {
      color: 0x8200f9,
      size: 0.3,
      sizeAttenuation: true
    } );
  }

  addModels() {
    var objLoader = new OBJLoader();
    objLoader.load(
      this.objectUrl,
      object => {
        this.canaryMesh = object;
        this.canaryMesh.position.setY(-2);
        this.canaryMesh.rotation.y = Math.PI/4;
        this.canaryMesh.scale.set(4, 4, 4);
        this.scene.add(this.canaryMesh);

        // It's a group, traverse it
        this.canaryMesh.traverse((child) => {
          if (child.isMesh) {
            // Set material to mesh (eg wireframe)
            child.material = this.canaryMtlMesh;
            child.material.wireframe = true;
            child.material.needsUpdate = true;
            child.material.transparent = true;

            // Create point clouds based on mesh
            var childGeometry = child.geometry.clone();
            this.canaryPointCloud = new THREE.Points(childGeometry);
            this.canaryPointCloud.position.setY(-2);
            this.canaryPointCloud.rotation.y = Math.PI/4;
            this.canaryPointCloud.scale.set(4, 4, 4);
            this.canaryPointCloud.material = this.canaryMtlPoints;
            this.scene.add(this.canaryPointCloud);
          }
        })


      },
      xhr => {
        // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      error => {
        console.log("Error while loading: " + error);
      }
    );
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

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene = () => {
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        style={{ width: "800px", height: "800px" }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }

}

export default ThreeCanary;
