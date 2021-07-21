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

    // Add a cube to visualize intersection with pointer
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    const cube = new THREE.Mesh( geometry, material );
    this.cube = cube;
    this.cube.scale.set(0.05, 0.05, 0.05);
    this.scene.add( cube );

    this.renderScene();
    this.start();
  }

  addScene() {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
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
    this.camera.position.z = 6;
    this.camera.position.y = 2;
    this.camera.position.x = -3;
  }

  addControls() {
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Raycaster from camera to vertex pointer so we can interactive with 3D vertices
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.05;
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

    // Raycasting have to discount bounding box of rendering canvas
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    this.pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
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
    
    this.raycaster.setFromCamera(this.pointer, this.camera);

    if (this.canaryPointCloud) {
      const intersects = this.raycaster.intersectObject(this.canaryPointCloud);
      let intersection = ( intersects.length ) > 0 ? intersects[0] : null;
      if (intersection !== null) {
        console.log("intersection", intersection);
        // intersection.object.material.color.set( 0xff0000 );
        this.cube.position.copy(intersection.point);
        // intersection.object.point.x;
      }

    }

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
