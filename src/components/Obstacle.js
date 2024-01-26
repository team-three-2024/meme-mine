import { useFrame } from '@react-three/fiber'
import React, { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { Box3, VideoTexture } from 'three'
import { useBoundingBox } from '../components/BoundingBox'
import { assetURL } from '../helpers/url'

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

const Obstacle = React.forwardRef(({ positionZ, side, videoURL }, ref) => {
  const videoRef = useRef()
  const texture = useRef()

  useEffect(() => {
    const video = document.createElement('video')
    video.src = videoURL
    video.loop = true
    video.muted = true
    video.playbackRate = 1.0
    video.preload = 'auto'
    video.play()
    videoRef.current = video

    texture.current = new VideoTexture(video)
  }, [])

  useFrame(() => {
    if (texture.current) {
      texture.current.needsUpdate = true
    }
  })

  return (
    <mesh position={[side, 0, positionZ]} rotation={[0, 0, 0]} ref={ref}>
      <planeGeometry args={[1.2, 1.2]} />
      <meshBasicMaterial map={texture.current} side={THREE.DoubleSide} />
    </mesh>
  )
})

const Obstacles = React.forwardRef((_, playerRef) => {
  const [obstacles, setObstacles] = useState([])
  const obstacleRefs = []
  const [gamePosition, setGamePosition] = useState(0)

  const visibleObstacles = 5
  const lastSegmentRef = useRef()
  const clockRef = useRef({ elapsedTime: 0, delta: 0 })

  const playerBox = useBoundingBox(playerRef)

  useFrame(() => {
    let collisionDetected = false
    obstacleRefs.forEach(ref => {
      if (playerRef && ref) {
        const obstacleBox = new Box3().setFromObject(ref.current)
        if (playerBox && obstacleBox) {
          if (playerBox.intersectsBox(obstacleBox)) {
            collisionDetected = true
          }
        }
      }
      if (collisionDetected) {
        console.log('Collision Detected')
      }
    })
  })

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

      if (obstacles.length < visibleObstacles || gamePosition % visibleObstacles > lastSegmentZ + 20) {
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
      {obstacles.map(({ z, side }, index) => {
        const obstacleRef = index === obstacles.length - 1 ? lastSegmentRef : undefined
        obstacleRefs.push(obstacleRef)
        return (
          <Obstacle
            key={index}
            positionZ={z}
            side={side}
            playerRef={playerRef}
            ref={obstacleRef}
            videoURL={assetURL('nono.mp4')}
          />
        )
      })}
    </>
  )
})

export { Obstacles }
