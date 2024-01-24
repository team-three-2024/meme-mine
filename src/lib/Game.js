import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import React, { useRef, useState, Suspense, useEffect } from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { Canary } from '../components/Canary'
import { Lights } from '../components/Lights'
import { canaryConfig } from '../config'

const defaultConfig = {
  canary: canaryConfig
}

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

const PathSegment = React.forwardRef(({ positionZ }, ref) => {
  return (
    <mesh position={[0, -0.52, positionZ]} rotation={[Math.PI / 2, 0, 0]} ref={ref}>
      <planeGeometry args={[0.1, 5]} />
      <meshBasicMaterial color={0xffffff} side={THREE.DoubleSide} />
    </mesh>
  )
})

const PathManager = React.forwardRef((_, playerRef) => {
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

const ObstacleManager = React.forwardRef((_, playerRef) => {
  const [obstacles, setObstacles] = useState([])
  const [gamePosition, setGamePosition] = useState(0)

  const visibleObstacles = 5
  const lastSegmentRef = useRef()
  const clockRef = useRef({ elapsedTime: 0, delta: 0 })

  useFrame(state => {
    const { clock } = state
    clockRef.current.delta = clock.getElapsedTime() - clockRef.current.elapsedTime

    if (playerRef.current) {
      if (clockRef.current.delta >= 0.05) {
        clockRef.current.elapsedTime = clock.getElapsedTime()
        setGamePosition(gamePosition => gamePosition + 1)
        setObstacles(prevObstacles => prevObstacles.map(segment => ({ z: segment.z - 1, side: segment.side })))
      }

      const lastSegmentZ = lastSegmentRef.current ? lastSegmentRef.current.position.z : 0

      if (obstacles.length < visibleObstacles || gamePosition % visibleObstacles > lastSegmentZ) {
        const segmentGap = random(10, 50)
        const Obstacleside = Math.floor(Math.random() * 3) - 1
        const newSegmentZ = { z: lastSegmentZ + segmentGap, side: Obstacleside }
        setObstacles(prevObstacles => [...prevObstacles, newSegmentZ])
      }

      if (obstacles.length > visibleObstacles) {
        setObstacles(prevObstacles => prevObstacles.slice(1))
      }
    }
  })

  return (
    <>
      {obstacles.map(({ z, side }, index) => (
        <ObstacleSegment
          key={index}
          positionZ={z}
          side={side}
          ref={index === obstacles.length - 1 ? lastSegmentRef : undefined}
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

      <PathManager ref={playerRef} />

      <ObstacleManager ref={playerRef} />

      <Suspense fallback={null}>
        <Canary
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
