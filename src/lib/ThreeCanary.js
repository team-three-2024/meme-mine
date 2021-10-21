import * as THREE from "three";
import React, { useRef, useState, Suspense, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Instances, Instance, OrbitControls, Stats } from '@react-three/drei'
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing'

const color = new THREE.Color()

const brandPalette = [0x01ffff, 0xe6007a, 0xffffff, 0x000000];

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

function Points({ range }) {
  // Note: useGLTF caches it already
  const { nodes, materials } = useGLTF('/assets/canary.glb')

  // Or nodes.Scene.children[0].geometry.attributes.position
  const positions = nodes.canary.geometry.attributes.position
  const randomIndexes = randomN(0, positions.count, range)
  const selectedPositions = randomIndexes.map((i) => [positions.getX(i), positions.getY(i), positions.getZ(i)])

  useLayoutEffect(() => {
    // nodes.canary.position.setY(-5)
    // nodes.canary.scale.set(4, 4, 4)
  }, [ nodes, materials])
  return (
    <Instances range={range} material={new THREE.MeshBasicMaterial()} geometry={new THREE.SphereGeometry( 0.2 )}>
      {
        selectedPositions.map((position, i) => (
          <Point key={i} position={position} />
        ))
      }
    </Instances>
  )
}

function Point({ position }) {
  const ref = useRef()
  const [hovered, setHover] = useState(false)

  useFrame((state) => {
    ref.current.position.copy(new THREE.Vector3(position[0], -position[2], position[1]))
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = 0.02
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 2 : 1, 0.1)
    ref.current.color.lerp(color.set(hovered ? brandPalette[0] : brandPalette[1]), hovered ? 1 : 0.1)
  })
  return (
    <group  scale={0.4} >
      {/* eslint-disable-next-line */}
      <Instance ref={ref} onPointerOver={(e) => (e.stopPropagation(), setHover(true))} onPointerOut={() => setHover(false)} />
    </group>
  )
}

function Model(props) {
  const { scene, nodes, materials } = useGLTF('/assets/canary.glb')

  useLayoutEffect(() => {
    // nodes.canary.position.setY(-10)
    nodes.canary.scale.set(4, 4, 4)
    scene.traverse((obj) => obj.type === 'Mesh' && (obj.receiveShadow = obj.castShadow = true))
    Object.assign(materials["Default OBJ"], { wireframe: true, metalness: 0.1, roughness: 0.8, color: new THREE.Color(brandPalette[0]) })
  }, [scene, nodes, materials])

  return <primitive object={scene} {...props} />
}

function Lights() {
  const groupL = useRef()
  const groupR = useRef()
  const front = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    groupL.current.position.x = Math.sin( t  ) / 2;
    groupL.current.position.y = Math.cos( t  ) / 2;
    groupL.current.position.z = Math.cos( t  ) / 2;

    groupR.current.position.x = Math.cos( t  ) / 2;
    groupR.current.position.y = Math.sin( t  ) / 2;
    groupR.current.position.z = Math.sin( t  ) / 2;

    front.current.position.x = Math.sin( t ) / 2;
    front.current.position.y = Math.cos( t ) / 2;
    front.current.position.z = Math.sin( t ) / 2;
  })

  return (
    <>
      <group ref={groupL}>
        <pointLight color={brandPalette[0]} position={[15, 0, 0]} distance={15} intensity={10} />
      </group>
      <group ref={groupR}>
        <pointLight color={brandPalette[1]} position={[-15, 0, 0]} distance={15} intensity={10} />
      </group>
      <group ref={front}>
        <pointLight color={brandPalette[2]} position={[0, 15, 0]} distance={15} intensity={10} />
      </group>
    </>
  )
}

function ThreeCanary(props) {
  return (
    <>
    <Stats />
    <Canvas shadows dpr={[1, 2]} camera={{ position: [2.3, 1, 1], fov: 50 }} performance={{ min: 0.1 }}>
      
      <Lights />
      {/* <fog attach="fog" args={[brandPalette[0], 0.5, 10]} /> */}
      <gridHelper position={[0, -0.135, 0]} color={"#000"} args={[40,40]}/>

      <Suspense fallback={null}>
        <Model scale={0.1} />
        <Points range={1500} />
        <EffectComposer multisampling={16}>
          <Bloom kernelSize={2} luminanceThreshold={0.01} luminanceSmoothing={0.05} intensity={0.1} />
          <Glitch delay={[5,10]} />
        </EffectComposer>
      </Suspense>

      <OrbitControls minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
    </>
  )
}

export default ThreeCanary;
