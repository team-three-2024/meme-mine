import * as THREE from "three";
import React, { useMemo, useRef, useState, Suspense, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Instances, Instance, OrbitControls, Stats, Html } from '@react-three/drei'
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
  const { nodes } = useGLTF('/assets/canary.glb')

  // Or nodes.Scene.children[0].geometry.attributes.position
  const positions = nodes.canary.geometry.attributes.position
  const randomIndexes = randomN(0, positions.count, range)
  const selectedPositions = randomIndexes.map((i) => [positions.getX(i), positions.getY(i), positions.getZ(i)])

  return (
    <Instances range={range} material={new THREE.MeshBasicMaterial()} geometry={new THREE.SphereGeometry( 0.1 )}>
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
  const [active, setActive] = useState(false)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.position.copy(new THREE.Vector3(position[0], -position[2], position[1]))
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = 0.02
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 4 : 1, 0.1)
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, active ? 5 : 1, 0.1)
    ref.current.color.lerp(color.set(hovered ? brandPalette[0] : brandPalette[1]), hovered ? 1 : 0.1)

    if (hovered) {
      ref.current.color.lerp(color.set(hovered ? brandPalette[0] : brandPalette[1]), hovered ? 1 : 0.1)
    }
    

    if (active) {
      ref.current.scale.x = ref.current.scale.y = ref.current.scale.z += Math.sin( t ) / 4
      ref.current.color.lerp(color.set(active ? brandPalette[2] : brandPalette[1]), active ? 1 : 0.1)
    }
  })
  return (
    <group  scale={0.4} >
      <>
        {active ?
          <PointDialog position={position} /> : null
        }
        {/* eslint-disable-next-line */}
        <Instance
          ref={ref}
          onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
          onPointerOut={() => (setHover(false))}
          onClick={(e) => setActive(!active)}
          />
      </>
    </group>
  )
}

function PointDialog({ position }) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.position.copy(new THREE.Vector3(position[0], -position[2], position[1]))
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = 0.02
    ref.current.position.y += Math.sin( t ) / 16
  })
  return (

      <mesh ref={ref}>
        <meshStandardMaterial roughness={0.75} metalness={0.8} emissive={brandPalette[0]} />
        <Html distanceFactor={2}>
          <div className="content">
            <img src="https://pbs.twimg.com/profile_images/1258000414751854592/jSNMO6dk_400x400.jpg" alt="img" />
            <h1>Vilson Vieira</h1>
            0x08eded6a76d84e309e3f09705ea2853f
          </div>
        </Html>
      </mesh>

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

function Particles({ count }) {
  const mesh = useRef()

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame((state) => {

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle

      t = particle.t += speed / 4
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t) / 2

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()

      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <boxGeometry args={[1]} />
        <pointsMaterial color={brandPalette[1]} size={0.02}  transparent={true} sizeAttenuation={false} opacity={0.3} />
      </instancedMesh>
    </>
  )
}

function ThreeCanary(props) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

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
        <Particles count={isMobile ? 50 : 200} />

        <EffectComposer multisampling={16}>
          <Bloom kernelSize={2} luminanceThreshold={0.01} luminanceSmoothing={0.05} intensity={0.1} />
          <Glitch delay={[10, 20]} />
        </EffectComposer>
      </Suspense>

      <OrbitControls minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
    </>
  )
}

export default ThreeCanary;
