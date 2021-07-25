import React, { Component } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
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
    this.camera.position.z = 30;
    this.camera.position.y = 5;
  }

  addControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Raycaster from camera to vertex pointer so we can interactive with 3D vertices
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    // this.raycaster.params.Points.threshold = 2;
    this.hoveredNodes = [];

    // Add a cube to visualize intersection with pointer
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    // const cube = new THREE.Mesh( geometry, material );
    // this.cube = cube;
    // this.cube.scale.set(0.05, 0.05, 0.05);
    // this.scene.add( cube );

    // window.addEventListener("resize", this.onWindowResize);
    document.addEventListener("pointermove", this.onPointerMove);
  }

  addLights() {
    var lights = [];
    lights[0] = new THREE.PointLight(0xff00ff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);
    lights[0].position.set(0, 0, 0);
    lights[1].position.set(0, 0, 0);
    lights[2].position.set(0, 0, 0);
    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  }

  addMaterials() {
    // TODO: Move to brand color pallet
    this.canaryMtlMesh =  new THREE.PointsMaterial( { color: 0xe6007a });
    // this.canaryMtlPoints = new THREE.PointsMaterial( {
    //   color: 0x8200f9,
    //   size: 0.1
    // } );
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
            // this.canaryPointCloud = new THREE.Points(childGeometry, this.canaryMtlPoints);
            // this.canaryPointCloud.position.setY(-2);
            // this.canaryPointCloud.rotation.y = Math.PI/4;
            // this.canaryPointCloud.scale.set(4, 4, 4);
            // this.scene.add(this.canaryPointCloud);
            // let pos = this.canaryPointCloud.geometry.attributes.position;

            // Create a group of meshes as a point cloud instead of points, to have
            // per-mesh control
            let pos = childGeometry.attributes.position;
            this.canaryPointCloudGroup = new THREE.Group();
            for (let i=0; i<pos.count; i+=1) {

              let geometry = new THREE.BoxGeometry();
              let material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
              material.wireframe = false;
              material.needsUpdate = true;
              let cube = new THREE.Mesh( geometry, material );

              cube.position.copy(new Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
              let _scale = Math.random()*100;
              cube.scale.set(_scale, _scale, _scale);
              this.canaryPointCloudGroup.add( cube );
            }
            this.canaryPointCloudGroup.position.setY(-2);
            this.canaryPointCloudGroup.rotation.y = Math.PI/4;
            this.canaryPointCloudGroup.scale.set(4, 4, 4);
            this.scene.add( this.canaryPointCloudGroup );
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

    this.hoveredNodes = [];
    if (this.canaryPointCloudGroup) {
      const intersects = this.raycaster.intersectObject(this.canaryPointCloudGroup, true);
      if (intersects != null && intersects.length > 0) {
        for (let i=0; i<intersects.length; i+=1) {
          if (!this.hoveredNodes.includes(intersects[i].object.id))
            this.hoveredNodes.push(intersects[i].object.id);
        }
      }

      for (let i=0; i<this.canaryPointCloudGroup.children.length; i+=1) {

        if (this.hoveredNodes.includes(this.canaryPointCloudGroup.children[i].id)) {
          this.canaryPointCloudGroup.children[i].material.color.set( 0xffffff );
          this.canaryPointCloudGroup.children[i].material.wireframe = true;
          this.canaryPointCloudGroup.children[i].scale.set(0.15, 0.15, 0.15);
          this.canaryPointCloudGroup.children[i].rotateX(Math.sin(this.frameId / 70)/20);
          this.canaryPointCloudGroup.children[i].rotateY(Math.sin(this.frameId / 100)/20);
          this.canaryPointCloudGroup.children[i].rotateZ(Math.sin(this.frameId / 80)/20);
      
        } else {
          this.canaryPointCloudGroup.children[i].material.color.set( 0x0000ff );
          this.canaryPointCloudGroup.children[i].material.wireframe = false;
          this.canaryPointCloudGroup.children[i].scale.set(0.05, 0.05, 0.05);
        }
        // this.canaryPointCloudGroup.children[i].position.y += Math.sin(this.frameId / 50) / 1000;
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
