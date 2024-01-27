import { useFrame } from '@react-three/fiber'
import React, { useState, useRef } from 'react'
import * as THREE from 'three'

const SideSegment = React.forwardRef(({ positionZ, side }, ref) => {
  const positionX = side === 'left' ? -1.5 : 1.5

  return (
    <mesh position={[positionX, 0, positionZ]} rotation={[Math.PI / 2, 0, 0]} ref={ref}>
      <planeGeometry args={[0.1, 1000]} />
      <meshBasicMaterial color={0xffffff} side={THREE.DoubleSide} />
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

const Path = React.forwardRef((_, playerRef) => {
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
        <React.Fragment key={index}>
          <PathSegment positionZ={z} ref={index === segments.length - 1 ? lastSegmentRef : undefined} />
          <SideSegment positionZ={z} side="left" />
          <SideSegment positionZ={z} side="right" />
        </React.Fragment>
      ))}
    </>
  )
})

export { Path }
