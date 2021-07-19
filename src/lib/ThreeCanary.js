import React, { Component } from "react";
import * as THREE from "three";
import { OBJLoader } from "three-obj-mtl-loader";
// import OrbitControls from "three-orbitcontrols";

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
    this.camera.position.z = 5;
    this.camera.position.y = 2;
    this.camera.position.x = -2.5;
  }

  addControls() {
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Raycaster from camera to vertex pointer so we can interactive with 3D vertices
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.1;
    this.intersected = null;

    // window.addEventListener("resize", this.onWindowResize);
    document.addEventListener("pointermove", this.onPointerMove);
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
      size: 0.1
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
            this.canaryPointCloud = new THREE.Points(childGeometry, this.canaryMtlPoints);
            this.canaryPointCloud.position.setY(-2);
            this.canaryPointCloud.rotation.y = Math.PI/4;
            this.canaryPointCloud.scale.set(4, 4, 4);
            this.scene.add(this.canaryPointCloud);

            console.log("Creating point cloud", this.canaryPointCloud);
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

  onPointerMove = (event) => {
    event.preventDefault();
    let x = (event.clientX / window.innerWidth) * 2 - 1;
    let y = - (event.clientY / window.innerHeight) * 2 + 1;
    console.log("pointer", event.clientX, event.clientY, x, y, this.width, this.height);
    this.pointer.x = x;
    this.pointer.y = y;
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

    // if (this.canaryMesh) this.canaryMesh.rotation.y += 0.01;
    // if (this.canaryPointCloud) this.canaryPointCloud.rotation.y += 0.01;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    if (this.canaryPointCloud) {
      const intersections = this.raycaster.intersectObject(this.canaryPointCloud);
      let intersection = ( intersections.length ) > 0 ? intersections[0] : null;
      if (intersection !== null) {
        console.log("intersection", intersection.index);
      }
    }

    // const attributes = this.canaryPointCloud ? this.canaryPointCloud.geometry.attributes : null;

    // if (this.intersections && this.intersections.length > 0) {
    //   if (this.intersected != this.intersections[0].index) {
    //     this.intersected = this.intersections[0].index;
    //     console.log(this.intersected, attributes);

    //     if (attributes && attributes.position) {
    //       console.log("hey");
    //       attributes.position.array[this.intersected] += 10;
    //       attributes.position.needsUpdate = true;
    //     }
    //   }
    // } else if (this.intersected !== null) {
    //   if (attributes && attributes.position) {
    //     attributes.position.array[this.intersected] -=10;
    //     attributes.position.needsUpdate = true;
    //     this.intersected = null;
    //   }
    // }

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
