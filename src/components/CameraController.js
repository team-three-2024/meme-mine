import { useThree, useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

const CameraController = ({ mode }) => {
  const { camera, set } = useThree()
  const perspCamera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1000)

  useEffect(() => {
    if (mode === 'over') {
      perspCamera.position.set(3, 1, 0)
      set({ camera: perspCamera })

      return null
    }

    if (mode === '2D') {
      perspCamera.position.set(-20, 0, 1)
      set({ camera: perspCamera })
    } else {
      perspCamera.position.set(0, 0.8, -3)
      set({ camera: perspCamera })
    }
  }, [mode])

  useFrame(() => {
    camera.updateProjectionMatrix()
  })

  return null
}

export { CameraController }
