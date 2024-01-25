import { useLoader, useFrame } from '@react-three/fiber'
import React, { useState, useRef } from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three'

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

const ObstacleSegment = React.forwardRef(({ positionZ, side }, ref) => {
  const texture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/assets/sbf.jpeg`)

  return (
    <mesh position={[side, 0, positionZ]} rotation={[0, 0, 0]} ref={ref}>
      <planeGeometry args={[1.2, 1.2]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  )
})

const Obstacle = React.forwardRef((_, playerRef) => {
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

export { Obstacle }
