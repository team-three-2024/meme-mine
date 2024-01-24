import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { brandPalette } from '../config'

const Canary = React.forwardRef((props, ref) => {
  const [position, setPosition] = useState([0, 0, 0])
  const [isJumping, setIsJumping] = useState(false)

  const { scene, nodes, materials, animations } = useGLTF(props.objectUrl)

  const mixerRef = useRef()

  useEffect(() => {
    if (ref.current) {
      mixerRef.current = new THREE.AnimationMixer(ref.current)
    }
  }, [ref])

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
      <primitive ref={ref} object={scene} {...props} />
    </mesh>
  )
})

export { Canary }
