import { useFrame } from '@react-three/fiber'
import React, { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { playTrack } from '../helpers/track'
import { assetURL } from '../helpers/url'

const Canary = props => {
  const initialPosition = props.position ? props.position : [0, 0, 0]
  const canJump = props.canJump !== undefined ? props.canJump : true
  const canMove = props.canMove !== undefined ? props.canMove : true
  const muted = props.muted !== undefined ? props.muted : false

  const [position, setPosition] = useState(initialPosition)
  const [isJumping, setIsJumping] = useState(false)
  const [hasSwitchedTrack, setHasSwitchedTrack] = useState(false)

  const audioTracks = {
    jump: useRef(null),
    move: useRef(null),
    footstep1: useRef(null),
    footstep2: useRef(null),
    main: useRef(null)
  }

  let animation = props.animation
  let speed = props.speed
  let reversed = props.reversed

  if (props.animation === 'dead') {
    animation = 'idle'
    speed = 0
    reversed = true
  }

  const glb = props.models.find(item => item.userData.name === animation)
  const { scene, animations } = glb

  const animationRef = useRef()
  const meshRef = useRef()

  useEffect(() => {
    if (props.handleCanaryRef) {
      props.handleCanaryRef(meshRef)
    }
  }, [meshRef])

  useEffect(() => {
    audioTracks.jump.current = new Audio(assetURL('audio/canary_jump.mp3'))
    audioTracks.move.current = new Audio(assetURL('audio/canary_swooshleftandright.mp3'))
    audioTracks.footstep1.current = new Audio(assetURL('audio/canary_footstep1.mp3'))
    audioTracks.footstep2.current = new Audio(assetURL('audio/canary_footstep2.mp3'))
    audioTracks.main.current = new Audio(assetURL('audio/canary_in_a_meme_mine.mp3'))

    Object.values(audioTracks).forEach(audioTrack => {
      if (audioTrack.current) {
        audioTrack.current.load()
      }
    })
    return () => {
      Object.values(audioTracks).forEach(audioTrack => {
        if (audioTrack.current) {
          audioTrack.current.pause()
          audioTrack.current.removeAttribute('src')
          audioTrack.current.load()
        }
      })
    }
  }, [])

  useEffect(() => {
    if (meshRef.current && reversed) {
      meshRef.current.rotation.x = Math.PI / 0.85
    }
  }, [])

  useEffect(() => {
    if (meshRef && meshRef.current) {
      animationRef.current = new THREE.AnimationMixer(meshRef.current)
    }
  }, [animation, meshRef])

  useEffect(() => {
    if (animationRef.current && animations) {
      animations.forEach(clip => {
        const action = animationRef.current.clipAction(clip)
        action.timeScale = speed
        action.play()
      })
    }

    // it means the game started
    if (props.speed === 3) {
      audioTracks.main.current.loop = true
      playTrack(audioTracks.main)
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stopAllAction()
        setHasSwitchedTrack(false)
      }
    }
  }, [animations])

  useEffect(() => {
    if (muted) return

    playTrack(audioTracks.move)
  }, [muted, position[0]])

  useEffect(() => {
    const handleKeyDown = event => {
      if (canMove) {
        if (event.key === 'ArrowRight') {
          setPosition(prevPosition => {
            if (prevPosition[0] !== -1) return [prevPosition[0] - 1, prevPosition[1], prevPosition[2]]
            else return prevPosition
          })
        } else if (event.key === 'ArrowLeft') {
          setPosition(prevPosition => {
            if (prevPosition[0] !== 1) return [prevPosition[0] + 1, prevPosition[1], prevPosition[2]]
            else return prevPosition
          })
        }
      }
      if (canJump) {
        if (event.key === 'ArrowUp' && !isJumping && position[1] === 0) {
          setIsJumping(true)
          playTrack(audioTracks.jump)
        }
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [canMove, canJump, position])

  useFrame((_, delta) => {
    if (animationRef.current) {
      animationRef.current.update(delta)

      if (props.animation === 'walk' && props.speed === 1) {
        animations.forEach(clip => {
          const action = animationRef.current.clipAction(clip)
          action.timeScale = speed

          if (action.time > clip.duration / 2 && !hasSwitchedTrack) {
            playTrack(audioTracks.footstep2)
            setHasSwitchedTrack(true)
          } else if (action.time < clip.duration / 2 && hasSwitchedTrack) {
            playTrack(audioTracks.footstep1)
            setHasSwitchedTrack(false)
          }
        })
      }
    }

    if (isJumping) {
      // Simple jump animation: move up then down
      setPosition(prevPosition => {
        const newY = prevPosition[1] + delta * 10
        // Check if the model has reached the peak of the jump
        if (newY >= 2.5) {
          setIsJumping(false) // Start falling
        }
        return [prevPosition[0], newY <= 0 ? 0 : newY, prevPosition[2]] // Reset Y position after jump
      })
    } else {
      // Bring the model back down if it's in the air
      setPosition(prevPosition => {
        if (prevPosition[1] !== 0) return [prevPosition[0], Math.max(0, prevPosition[1] - delta * 10), prevPosition[2]]
        else return prevPosition
      })
    }
  })

  return (
    <mesh position={position} ref={meshRef}>
      <primitive object={scene} {...props} />
    </mesh>
  )
}

export { Canary }
