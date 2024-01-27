import { useFrame } from '@react-three/fiber'
import React, { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { Box3, VideoTexture } from 'three'
import { useBoundingBox } from './BoundingBox'

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

const Obstacle = React.forwardRef(({ positionZ, side, video, handleObstacleRef }, ref) => {
  const videoRef = useRef()
  const textureRef = useRef()
  const obstacleRef = useRef()

  useEffect(() => {
    video.play()
    videoRef.current = video
    textureRef.current = new VideoTexture(video)

    handleObstacleRef(positionZ, obstacleRef)
  }, [])

  useFrame(() => {
    if (textureRef.current) {
      textureRef.current.needsUpdate = true
    }
  })

  return (
    <mesh position={[side, 0, positionZ]} rotation={[0, 0, 0]} ref={obstacleRef}>
      <circleGeometry args={[0.6, 32]} />
      <meshBasicMaterial map={textureRef.current} side={THREE.DoubleSide} />
    </mesh>
  )
})

const Obstacles = React.forwardRef(({ videos }, playerRef) => {
  const [obstacles, setObstacles] = useState([])

  const visibleObstacles = 5
  const clockRef = useRef({ elapsedTime: 0, delta: 0 })

  const handleObstacleRef = (obstacleIdentifier, ref) => {
    setObstacles(prevObstacles => {
      return prevObstacles.map(obstacle => {
        if (obstacle.z === obstacleIdentifier) {
          if (ref.current) {
            return { ...obstacle, ref }
          }
        }
        return obstacle
      })
    })
  }

  const playerBox = useBoundingBox(playerRef)
  // const { scene } = useThree()

  // useEffect(() => {
  //   if (playerRef.current) {
  //     const helper = addBoundingBoxHelper(playerRef.current, scene)

  //     return () => scene.remove(helper)
  //   }
  // }, [playerRef.current, scene])

  useFrame(state => {
    const { clock } = state
    clockRef.current.delta = clock.getElapsedTime() - clockRef.current.elapsedTime
    if (clockRef.current.delta < 1) return

    let collisionDetected = false
    obstacles.forEach(obstacle => {
      if (playerRef && obstacle.ref) {
        if (obstacle.ref && obstacle.ref.current) {
          const obstacleBox = new Box3().setFromObject(obstacle.ref.current)
          if (playerBox && obstacleBox) {
            console.info(playerBox.min, playerBox.max)
            console.info(obstacleBox.min, obstacleBox.max)
            collisionDetected = playerBox.min.z - 1 <= obstacleBox.max.z && playerBox.max.z - 1 >= obstacleBox.min.z
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
      // Move obstacles and clean up old ones
      if (clockRef.current.delta >= 0.1) {
        clockRef.current.elapsedTime = clock.getElapsedTime()
        setObstacles(
          prevObstacles =>
            prevObstacles
              .map(obstacle => ({
                ...obstacle,
                z: obstacle.z - 1
              }))
              .filter(obstacle => obstacle.z >= -10) // -10 is the screen limit
        )
      }

      // Create new obstacles
      if (obstacles.length < visibleObstacles) {
        const initialPosition = 0
        const obstacleGap = random(20, 120)
        const obstacleside = Math.floor(Math.random() * 3) - 1

        const newObstacle = {
          z: initialPosition + obstacleGap,
          side: obstacleside,
          ref: null
        }

        setObstacles(prevObstacles => [...prevObstacles, newObstacle])
      }
    }
  })

  return (
    <>
      {obstacles.map(({ z, side }, index) => {
        return (
          <Obstacle
            key={index}
            positionZ={z}
            side={side}
            playerRef={playerRef}
            ref={playerRef}
            video={videos[Math.floor(Math.random() * videos.length)]}
            handleObstacleRef={handleObstacleRef}
          />
        )
      })}
    </>
  )
})

export { Obstacles }
