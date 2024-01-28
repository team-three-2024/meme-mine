import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { brandPalette, canaryConfig } from '../config'
import { assetURL } from '../helpers/url'

const Canary = React.forwardRef((props, ref) => {
  const initialPosition = props.position ? props.position : [0, 0, 0]

  const [position, setPosition] = useState(initialPosition)
  const [isJumping, setIsJumping] = useState(false)

  let animation = props.animation
  let speed = props.speed
  let reversed = props.reversed

  if (props.animation === 'dead') {
    animation = 'idle'
    speed = 0
    reversed = true
  }

  const glb = canaryConfig.objectUrl[animation]
  const { scene, nodes, materials, animations } = useGLTF(assetURL(glb))

  const animationRef = useRef()
  const meshRef = useRef()

  useEffect(() => {
    if (props.handleCanaryRef) {
      props.handleCanaryRef(meshRef)
    }
  }, [meshRef])

  useEffect(() => {
    if (meshRef.current && reversed) {
      meshRef.current.rotation.x = Math.PI / 0.85
    }
  }, [])

  useEffect(() => {
    if (meshRef && meshRef.current) {
      animationRef.current = new THREE.AnimationMixer(meshRef.current)
    }
  }, [meshRef])

  useEffect(() => {
    if (animationRef.current && animations) {
      animations.forEach(clip => {
        const action = animationRef.current.clipAction(clip)
        action.timeScale = speed
        action.play()
      })
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stopAllAction()
      }
    }
  }, [animations])

  useEffect(() => {
    const handleKeyDown = event => {
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
      if (event.key === 'ArrowUp' && !isJumping && position[1] === 0) {
        setIsJumping(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [position])

  useFrame((_, delta) => {
    if (animationRef.current) {
      animationRef.current.update(delta)
    }

    if (isJumping) {
      // Simple jump animation: move up then down
      setPosition(prevPosition => {
        const newY = prevPosition[1] + delta * 5
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

    Object.assign(materials[props.model.material], {
      wireframe: false,
      metalness: props.model.metalness,
      roughness: props.model.moughness,
      opacity: props.model.opacity,
      color: new THREE.Color(brandPalette[props.model.color])
    })
  }, [scene, nodes, materials])

  return (
    <mesh position={position} ref={meshRef}>
      <primitive ref={ref} object={scene} {...props} />
    </mesh>
  )
})

export { Canary }
