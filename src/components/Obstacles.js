import { useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import * as THREE from 'three'
import { Box3, VideoTexture } from 'three'
import { cleanUp } from '../helpers/clean'

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

const Obstacle = ({ positionZ, side, video, handleObstacleRef }) => {
  const videoRef = useRef()
  const textureRef = useRef()
  const obstacleRef = useRef()

  useEffect(() => {
    videoRef.current = video
    textureRef.current = new VideoTexture(video)
  }, [])

  useFrame(() => {
    if (!video.isPlaying) {
      video.play()
    }
  })

  useEffect(() => {
    handleObstacleRef(positionZ, obstacleRef)
  }, [positionZ])

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
}

const Obstacles = React.forwardRef(({ videos, setScore, hitPoints, setHitPoints, handleGameOver }, canaryRef) => {
  const [obstacles, setObstacles] = useState([])

  const visibleObstacles = 5
  const clockRef = useRef({ elapsedTime: 0, delta: 0 })

  const bonusRateRef = useRef(2)
  const nearBonusDetected = useRef(false)
  const collisionDetected = useRef(false)

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

  useFrame(state => {
    const { clock } = state
    clockRef.current.delta = clock.getElapsedTime() - clockRef.current.elapsedTime

    if (canaryRef && canaryRef.current) {
      const playerBox = new Box3().setFromObject(canaryRef.current)
      const bonusBox = new Box3().setFromObject(canaryRef.current)

      // Transform the original bounding box to match the model inside
      const scaleFactor = 0.23
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()
      playerBox.getCenter(center)
      playerBox.getSize(size)

      // Scale the size
      size.multiplyScalar(scaleFactor)
      const rotatedSize = new THREE.Vector3(size.x, size.z, size.y)
      const scaledRotatedPlayerBox = new THREE.Box3()
      scaledRotatedPlayerBox.setFromCenterAndSize(center, rotatedSize)

      // Near bonus box
      const bonusScaleFator = 0.35
      const bonusZScaleFator = 1.6
      const bonusCenter = new THREE.Vector3()
      const bonusSize = new THREE.Vector3()
      bonusBox.getCenter(bonusCenter)
      bonusBox.getSize(bonusSize)
      bonusSize.multiplyScalar(bonusScaleFator)
      bonusSize.y *= bonusZScaleFator // y because it's rotated, but it's in fact z
      const bonusRotatedSize = new THREE.Vector3(bonusSize.x, bonusSize.z, bonusSize.y)
      const scaledRotatedBonusBox = new THREE.Box3()
      scaledRotatedBonusBox.setFromCenterAndSize(bonusCenter, bonusRotatedSize)

      let atLeastOneBonus = false
      obstacles.forEach(obstacle => {
        if (obstacle.ref && obstacle.ref.current) {
          const obstacleBox = new Box3().setFromObject(obstacle.ref.current)
          if (scaledRotatedPlayerBox && obstacleBox) {
            collisionDetected.current = scaledRotatedPlayerBox.intersectsBox(obstacleBox)
          }
          if (scaledRotatedBonusBox && obstacleBox) {
            nearBonusDetected.current = scaledRotatedBonusBox.intersectsBox(obstacleBox)
          }
        }
        if (collisionDetected.current) {
          setHitPoints(prevHitPoints => prevHitPoints - 5)
          toast.error('-5 HEALTH', {
            duration: 2000,
            icon: '💥',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff'
            }
          })
          if (hitPoints < 1) {
            handleGameOver(true)
          }
          return
        }
        if (nearBonusDetected.current) {
          atLeastOneBonus = true
          setScore(prevScore => prevScore + bonusRateRef.current)
          if (bonusRateRef.current < 1024) bonusRateRef.current *= 2
          toast.success(`BONUS ${bonusRateRef.current}`, {
            duration: 2000,
            icon: '⭐',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff'
            }
          })
        }
      })

      if (!atLeastOneBonus) {
        bonusRateRef.current = 2
      }
    }
  })

  const { scene } = useThree()

  useFrame(state => {
    const { clock } = state
    clockRef.current.delta = clock.getElapsedTime() - clockRef.current.elapsedTime

    if (canaryRef && canaryRef.current) {
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
        cleanUp(scene)
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
            video={videos[Math.floor(Math.random() * videos.length)]}
            handleObstacleRef={handleObstacleRef}
          />
        )
      })}
    </>
  )
})

export { Obstacles }
