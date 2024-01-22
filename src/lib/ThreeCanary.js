import * as THREE from 'three'
import React, { useMemo, useRef, useState, Suspense, useEffect, useLayoutEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useHelper, Instances, Instance, OrbitControls, Html } from '@react-three/drei'
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing'
import { canaryConfig } from './CanaryConfig'
import { gilConfig } from './GilConfig'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

const defaultConfig = {
  canary: canaryConfig,
  gil: gilConfig
}

const color = new THREE.Color()

const brandPalette = {
  ciano: '#01ffff',
  magenta: '#e6007a',
  white: '#ffffff',
  black: '#000000'
}

// Generate a random integer between min and max
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

// Generate N integer numbers (with no repetition) between mix and max
const randomN = (min, max, n) => {
  let numbers = []
  while (numbers.length < n) {
    let num = random(min, max)
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }
  return numbers
}

const resolve = (path, obj, separator = '.') => {
  let properties = Array.isArray(path) ? path : path.split(separator)
  return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

const Points = ({ objectUrl, nodesData, onNodeClick, config }) => {
  // Note: useGLTF caches it already
  const { nodes } = useGLTF(objectUrl ? objectUrl : config.objectUrl)
  const [selected, setSelected] = useState(0)

  // Or nodes.Scene.children[0].geometry.attributes.position
  const positions = config.nodeCoords ? resolve(config.nodeCoords, nodes) : []
  const numPositions = positions.count
  const numNodes = nodesData.length
  const randomIndexes = useMemo(() => randomN(0, numPositions, numNodes), [numPositions, numNodes])

  const selectedPositions = randomIndexes.map(i => [positions.getX(i), positions.getY(i), positions.getZ(i)])

  const handleSelectedNode = nodeId => {
    setSelected(nodeId)
  }

  return (
    <>
      {selected ? (
        <group scale={config.nodeGroupScale}>
          <PointDialog
            position={selectedPositions[selected]}
            dialogData={nodesData[selected]}
            onNodeClick={onNodeClick}
            config={config}
          />
        </group>
      ) : null}
      <Instances
        range={selectedPositions.length}
        material={new THREE.MeshBasicMaterial()}
        geometry={new THREE.SphereGeometry(0.1)}
      >
        {selectedPositions.map((position, i) => (
          <Point
            key={i}
            nodeId={i}
            position={position}
            onNodeSelected={handleSelectedNode}
            dialogData={nodesData[selected]}
            onNodeClick={onNodeClick}
            config={config}
            primaryColor={config.pointColorIndex.primary}
            hoveredColor={config.pointColorIndex.hovered}
            activeColor={config.pointColorIndex.active}
          />
        ))}
      </Instances>
    </>
  )
}

const Point = ({
  nodeId,
  position,
  dialogData,
  onNodeSelected,
  onNodeClick,
  config,
  primaryColor,
  hoveredColor,
  activeColor
}) => {
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  const [active] = useState(false)

  useFrame(state => {
    const t = state.clock.getElapsedTime()
    const defaultScale = config.nodeScale
    ref.current.position.x = position[0] * config.nodeSigns[0]
    ref.current.position.z = position[1] * config.nodeSigns[1]
    ref.current.position.y = position[2] * config.nodeSigns[2]

    // Convert the angle to radians for a general rotation
    const rotationAngle = (180 * Math.PI) / 180 // 90 degrees in radians

    // Assuming position is an array [x, y, z]
    let x = position[0]
    let y = position[1]
    let z = position[2]

    // Rotate around the X-axis by rotationAngle
    let newY = y * Math.cos(rotationAngle) - z * Math.sin(rotationAngle)
    let newZ = y * Math.sin(rotationAngle) + z * Math.cos(rotationAngle)

    // Apply the new positions
    ref.current.position.x = x * config.nodeSigns[0]
    ref.current.position.y = newY * config.nodeSigns[2] // Note the index change due to rotation
    ref.current.position.z = newZ * config.nodeSigns[1]

    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = defaultScale
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(
      ref.current.scale.z,
      hovered ? 6 : 1,
      defaultScale
    )
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(
      ref.current.scale.z,
      active ? 5 : 1,
      defaultScale
    )
    ref.current.color.lerp(
      color.set(hovered || active ? brandPalette[hoveredColor] : brandPalette[primaryColor]),
      hovered || active ? 1 : defaultScale
    )

    if (hovered) {
      ref.current.color.lerp(
        color.set(hovered ? brandPalette[hoveredColor] : brandPalette[primaryColor]),
        hovered ? 1 : defaultScale
      )
    }

    if (active) {
      ref.current.scale.x = ref.current.scale.y = ref.current.scale.z += Math.sin(t) / 4
      ref.current.color.lerp(
        color.set(active ? brandPalette[activeColor] : brandPalette[primaryColor]),
        active ? 1 : defaultScale
      )
    }
  })
  return (
    <group scale={config.nodeGroupScale}>
      <>
        <Instance
          ref={ref}
          /* eslint-disable-next-line */
          onPointerOver={e => (e.stopPropagation(), setHover(true), onNodeSelected(nodeId))}
          onPointerOut={() => setHover(false)}
          onClick={e => onNodeClick(dialogData.hash)}
        />
      </>
    </group>
  )
}

const PointDialog = ({ position, dialogData, onNodeClick, config }) => {
  const ref = useRef()

  const scale = 1.002

  useFrame(state => {
    const t = state.clock.getElapsedTime()
    ref.current.position.copy(
      new THREE.Vector3(
        position[0] * config.nodeSigns[0] * scale,
        position[2] * config.nodeSigns[2] * scale,
        position[1] * config.nodeSigns[1] * scale
      )
    )
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = 0.05
    ref.current.position.y += Math.sin(t) / 16
  })
  return (
    <mesh ref={ref}>
      <meshStandardMaterial roughness={0.75} metalness={0.8} emissive={brandPalette.ciano} />
      <Html distanceFactor={2}>
        <DialogContent>{dialogData.hash ? <DialogHash>{dialogData.hash}</DialogHash> : null}</DialogContent>
      </Html>
    </mesh>
  )
}

const Model = React.forwardRef((props, modelRef) => {
  const [position, setPosition] = useState([0, 0, 0])
  const [isJumping, setIsJumping] = useState(false)

  const { scene, nodes, materials, animations } = useGLTF(props.objectUrl)

  const mixerRef = useRef()

  useEffect(() => {
    if (modelRef.current) {
      mixerRef.current = new THREE.AnimationMixer(modelRef.current)
    }
  }, [modelRef])

  useEffect(() => {
    if (mixerRef.current && animations) {
      animations.forEach(clip => {
        const action = mixerRef.current.clipAction(clip)
        action.timeScale = 3
        action.play()
      })
    }

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
      }
    }
  }, [animations])

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'ArrowRight') {
        setPosition(prevPosition => [prevPosition[0] - 1, prevPosition[1], prevPosition[2]])
      } else if (event.key === 'ArrowLeft') {
        setPosition(prevPosition => [prevPosition[0] + 1, prevPosition[1], prevPosition[2]])
      }
      if (event.key === 'ArrowUp' && !isJumping && position[1] === 0) {
        setIsJumping(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [position])

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }

    if (isJumping) {
      // Simple jump animation: move up then down
      setPosition(prevPosition => {
        const newY = prevPosition[1] + delta * 10
        // Check if the model has reached the peak of the jump
        if (newY >= 2) {
          setIsJumping(false) // Start falling
        }
        return [prevPosition[0], newY <= 0 ? 0 : newY, prevPosition[2]] // Reset Y position after jump
      })
    } else {
      // Bring the model back down if it's in the air
      setPosition(prevPosition => [prevPosition[0], Math.max(0, prevPosition[1] - delta * 10), prevPosition[2]])
    }
  })

  useLayoutEffect(() => {
    if (props.meshScale) {
      if (nodes.canary) {
        nodes.canary.scale.set(4, 4, 4)
      }
    }
    scene.traverse(obj => {
      obj.type === 'Mesh' && (obj.receiveShadow = obj.castShadow = true)
    })
    // 0.8 0.2
    Object.assign(materials[props.model.material], {
      wireframe: false,
      metalness: props.model.metalness,
      roughness: props.model.moughness,
      opacity: props.model.opacity,
      color: new THREE.Color(brandPalette[props.model.color])
    })
  }, [scene, nodes, materials])

  return (
    <mesh position={position}>
      <primitive ref={modelRef} object={scene} {...props} />
    </mesh>
  )
})

const Lights = ({ config }) => {
  const groupL = useRef()
  const groupR = useRef()
  const front = useRef()
  const lightL = useRef()
  const lightR = useRef()
  const lightF = useRef()

  useFrame(state => {
    const t = state.clock.getElapsedTime()

    // storm effect
    let currentPosition = 15
    if (parseInt(t) % 4 === 1) {
      currentPosition = (Math.random() * 15) | 0
    }

    groupL.current.position.x = (Math.sin(t) / 4) * currentPosition
    groupL.current.position.y = (Math.cos(t) / 4) * currentPosition
    groupL.current.position.z = (Math.cos(t) / 4) * currentPosition

    groupR.current.position.x = (Math.cos(t) / 4) * 10
    groupR.current.position.y = (Math.sin(t) / 4) * 10
    groupR.current.position.z = (Math.sin(t) / 4) * 10

    front.current.position.x = (Math.sin(t) / 4) * 10
    front.current.position.y = (Math.cos(t) / 4) * 10
    front.current.position.z = (Math.sin(t) / 4) * 10
  })

  if (config.debug === true) {
    useHelper(lightL, THREE.PointLightHelper)
    useHelper(lightR, THREE.PointLightHelper)
    useHelper(lightF, THREE.PointLightHelper)
  }

  return (
    <>
      <group ref={groupL}>
        <pointLight
          ref={lightL}
          color={brandPalette[config.pointLight.color[0]]}
          position={config.pointLight.position}
          distance={config.pointLight.distance}
          intensity={config.pointLight.intensity[0]}
        />
      </group>
      <group ref={groupR}>
        <pointLight
          ref={lightR}
          color={brandPalette[config.pointLight.color[1]]}
          position={config.pointLight.position}
          distance={config.pointLight.distance}
          intensity={config.pointLight.intensity[1]}
        />
      </group>
      <group ref={front}>
        <pointLight
          ref={lightF}
          color={brandPalette[config.pointLight.color[2]]}
          position={config.pointLight.position}
          distance={config.pointLight.distance}
          intensity={config.pointLight.intensity[2]}
        />
      </group>
    </>
  )
}

const Particles = ({ count }) => {
  const mesh = useRef()

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 10
      const speed = 0.01 + Math.random() / 200
      const xFactor = -5 + Math.random() * 10
      const yFactor = -5 + Math.random() * 10
      const zFactor = -5 + Math.random() * 10
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame(state => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle

      t = particle.t += speed / 4
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t) / 6

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
        <pointsMaterial
          color={brandPalette.magenta}
          size={0.02}
          transparent={true}
          sizeAttenuation={false}
          opacity={0.3}
        />
      </instancedMesh>
    </>
  )
}

const PathSegment = React.forwardRef(({ positionZ }, ref) => {
  return (
    <mesh position={[0, -0.52, positionZ]} rotation={[Math.PI / 2, 0, 0]} ref={ref}>
      <planeGeometry args={[0.1, 5]} />
      <meshBasicMaterial color={0xffffff} side={THREE.DoubleSide} />
    </mesh>
  )
})

const PathManager = React.forwardRef(({ what }, playerRef) => {
  const [segments, setSegments] = useState([])
  const [gamePosition, setGamePosition] = useState(0)

  const visibleSegments = 5
  const lastSegmentRef = useRef()
  const clockRef = useRef({ elapsedTime: 0, delta: 0 })

  useFrame(state => {
    const { clock } = state
    clockRef.current.delta = clock.getElapsedTime() - clockRef.current.elapsedTime

    if (playerRef.current) {
      if (clockRef.current.delta >= 0.05) {
        clockRef.current.elapsedTime = clock.getElapsedTime()
        setGamePosition(gamePosition => gamePosition + 1)
        setSegments(prevSegments => prevSegments.map(segment => segment - 1))
      }

      const playerZ = playerRef.current.position.z
      const lastSegmentZ = lastSegmentRef.current ? lastSegmentRef.current.position.z : 0

      // Generate new segments if needed
      if (segments.length < visibleSegments || gamePosition % visibleSegments > lastSegmentZ) {
        const segmentGap = 20
        const newSegmentZ = lastSegmentZ + segmentGap
        setSegments(prevSegments => [...prevSegments, newSegmentZ])
      }

      // Remove segments that are far behind the player
      if (segments.length > visibleSegments) {
        setSegments(prevSegments => prevSegments.slice(1))
      }
    }
  })

  return (
    <>
      {segments.map((z, index) => (
        <PathSegment key={index} positionZ={z} ref={index === segments.length - 1 ? lastSegmentRef : undefined} />
      ))}
    </>
  )
})

const ObstacleSegment = React.forwardRef(({ positionZ, side }, ref) => {
  const texture = useLoader(TextureLoader, 'assets/sbf.jpeg')

  return (
    <mesh position={[side, 0, positionZ]} rotation={[0, 0, 0]} ref={ref}>
      <planeGeometry args={[1.2, 1.2]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  )
})

const ObstacleManager = React.forwardRef(({ what }, playerRef) => {
  const [segments, setSegments] = useState([])
  const [gamePosition, setGamePosition] = useState(0)

  const visibleSegments = 5
  const lastSegmentRef = useRef()
  const clockRef = useRef({ elapsedTime: 0, delta: 0 })

  useFrame(state => {
    const { clock } = state
    clockRef.current.delta = clock.getElapsedTime() - clockRef.current.elapsedTime

    if (playerRef.current) {
      if (clockRef.current.delta >= 0.05) {
        clockRef.current.elapsedTime = clock.getElapsedTime()
        setGamePosition(gamePosition => gamePosition + 1)
        setSegments(prevSegments => prevSegments.map(segment => ({ z: segment.z - 1, side: segment.side })))
      }

      const playerZ = playerRef.current.position.z
      const lastSegmentZ = lastSegmentRef.current ? lastSegmentRef.current.position.z : 0

      // Generate new segments if needed
      if (segments.length < visibleSegments || gamePosition % visibleSegments > lastSegmentZ) {
        // const sides = ['left', 'center', 'right']
        const segmentGap = Math.floor(Math.random() * (50 - 10 + 1)) + 10
        const segmentSide = Math.floor(Math.random() * 3) - 1
        const newSegmentZ = { z: lastSegmentZ + segmentGap, side: segmentSide }
        setSegments(prevSegments => [...prevSegments, newSegmentZ])
      }

      // Remove segments that are far behind the player
      if (segments.length > visibleSegments) {
        setSegments(prevSegments => prevSegments.slice(1))
      }
    }
  })

  return (
    <>
      {segments.map(({ z, side }, index) => (
        <ObstacleSegment
          key={index}
          positionZ={z}
          side={side}
          ref={index === segments.length - 1 ? lastSegmentRef : undefined}
        />
      ))}
    </>
  )
})

function CameraController() {
  const { camera, set } = useThree()
  const [is2D, setIs2D] = useState(false)
  const perspCamera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1000)

  useEffect(() => {
    const toggleCamera = event => {
      if (event.code === 'Space') {
        setIs2D(!is2D)
      }
    }

    window.addEventListener('keydown', toggleCamera)

    return () => {
      window.removeEventListener('keydown', toggleCamera)
    }
  }, [is2D])

  useEffect(() => {
    if (is2D) {
      perspCamera.position.set(-20, 0, 0)
      perspCamera.lookAt(20, 0, 0)
      set({ camera: perspCamera })
    } else {
      perspCamera.position.set(0, 0.8, -3)
      perspCamera.lookAt(0, 0, 0)
      set({ camera: perspCamera })
    }
  }, [is2D])

  useFrame(() => {
    camera.lookAt(-100, 200, 500)
    camera.updateProjectionMatrix()
  })

  return null
}

const ThreeCanary = props => {
  const playerRef = useRef()

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const config = props.config ? props.config : defaultConfig['canary']

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: config.cameraPosition, fov: 50 }} performance={{ min: 0.1 }}>
      <CameraController />

      <Lights config={config} />
      {/* <fog attach="fog" args={[brandPalette.ciano, 4.5, 20]} /> */}
      {/* <gridHelper position={config.gridPosition} color={brandPalette.black} args={[40, 40]} /> */}

      <PathManager ref={playerRef} what="what" />

      <ObstacleManager ref={playerRef} what="what" />

      <Suspense fallback={null}>
        <Model
          scale={config.model.scale}
          objectUrl={props.objectUrl}
          meshColorIndex={config.meshColorIndex}
          meshScale={config.meshScale}
          model={config.model}
          ref={playerRef}
        />

        {/* <Particles count={isMobile ? 50 : 200} /> */}

        <EffectComposer multisampling={16}>
          <Bloom
            kernelSize={config.bloom.kernelSize}
            luminanceThreshold={config.bloom.luminanceThreshold}
            luminanceSmoothing={config.bloom.luminanceSmoothing}
            intensity={config.bloom.intensity}
          />
          {/* <Glitch delay={config.glitch.delay} strength={config.glitch.strength} duration={config.glitch.duration} /> */}
        </EffectComposer>
      </Suspense>

      <OrbitControls minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
  )
}

// Styling

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.9;
  }
`

const DialogContent = styled.div`
  animation: ${fadeIn} ease-in-out 0.5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;

  text-align: left;
  background: ${brandPalette.magenta};

  color: ${brandPalette.white};
  padding: 10px 20px;
  border-radius: 5px;
  margin: 20px 0 0 20px;

  font-family: monospace;
`

const DialogHash = styled.div`
  color: ${brandPalette.white};
  padding-top: 5px;
`

export { ThreeCanary, defaultConfig }
