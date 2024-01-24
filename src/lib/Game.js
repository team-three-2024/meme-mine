import { useGLTF, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import React, { useRef, useState, Suspense, useEffect, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { Lights } from '../components/Lights'
import { brandPalette, canaryConfig } from '../config'

const defaultConfig = {
  canary: canaryConfig
}

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

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

      const lastSegmentZ = lastSegmentRef.current ? lastSegmentRef.current.position.z : 0

      // Generate new segments if needed
      if (segments.length < visibleSegments || gamePosition % visibleSegments > lastSegmentZ) {
        // const sides = ['left', 'center', 'right']
        const segmentGap = random(10, 50)
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

const Game = props => {
  const playerRef = useRef()

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

        <EffectComposer multisampling={16}>
          <Bloom
            kernelSize={config.bloom.kernelSize}
            luminanceThreshold={config.bloom.luminanceThreshold}
            luminanceSmoothing={config.bloom.luminanceSmoothing}
            intensity={config.bloom.intensity}
          />
        </EffectComposer>
      </Suspense>

      <OrbitControls minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
  )
}

export { Game, defaultConfig }
