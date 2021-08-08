import React, { Component } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { OBJLoader } from "three-obj-mtl-loader";
import OrbitControls from "three-orbitcontrols";

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

class ThreeCanary extends Component {
  constructor(props) {
    super(props);
    this.objectUrl = props.objectUrl;
    this.propsOnNodeSelected = props.onNodeSelected;
    this.propsNodes = props.nodes;
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
    this.hoveredNodesObjs = [];
    this.clickedNodes = [];
    this.selectedNode = null;

    window.addEventListener("resize", this.onWindowResize);
    document.addEventListener("pointermove", this.onPointerMove);

    if (this.renderer) {
      this.renderer.domElement.addEventListener("click", this.onNodeClicked, true);
    }
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

            // Create a group of meshes as a point cloud instead of points, to have
            // per-mesh control
            let pos = childGeometry.attributes.position;
            let numMeshPoints = pos.count;

            // Randomly select n mesh points to use as placement for propsNodes
            this.propsNodesIndexes = randomN(0, numMeshPoints, this.propsNodes.length);

            this.canaryPointCloudGroup = new THREE.Group();

            for (let i=0; i<this.propsNodesIndexes.length; i+=1) {
              let nodeIndex = this.propsNodesIndexes[i];

              let geometry = new THREE.BoxGeometry();
              let mtlColor = "#ff0000";
              if (this.propsNodes[i].color) {
                mtlColor = this.propsNodes[i].color;
              }
              let material = new THREE.MeshBasicMaterial( { color: mtlColor } );
              material.wireframe = false;
              material.needsUpdate = true;
              let cube = new THREE.Mesh( geometry, material );

              cube.position.copy(new Vector3(pos.getX(nodeIndex), pos.getY(nodeIndex), pos.getZ(nodeIndex)));
              let _scale = Math.random()*100;
              cube.scale.set(_scale, _scale, _scale);
              this.canaryPointCloudGroup.add( cube );

              // Map mesh ids to propsNodes
              this.propsNodes[i].meshIndex = nodeIndex;
              this.propsNodes[i].meshObj = cube;

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
    
    this.raycaster.setFromCamera(this.pointer, this.camera);

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
          this.canaryPointCloudGroup.children[i].material.color.set( "#ffffff" );
          this.canaryPointCloudGroup.children[i].material.wireframe = true;
          this.canaryPointCloudGroup.children[i].scale.set(0.15, 0.15, 0.15);
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

      // Render selected node
      if (this.selectedNode) {
        // Selected node style
        this.selectedNode.material.color.set( "#00ffbb" );
        this.selectedNode.material.wireframe = true;
        this.selectedNode.scale.set(0.15, 0.15, 0.15);
        this.selectedNode.rotateX(Math.sin(this.frameId / 70)/20);
        this.selectedNode.rotateY(Math.sin(this.frameId / 100)/20);
        this.selectedNode.rotateZ(Math.sin(this.frameId / 80)/20);
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
