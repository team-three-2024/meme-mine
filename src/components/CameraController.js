import { useThree, useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

const CameraController = ({ mode }) => {
  const { camera, set } = useThree()
  const perspCamera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1000)

  useEffect(() => {
    if (mode === '2D') {
      perspCamera.position.set(-20, 0, 0)
      perspCamera.lookAt(20, 0, 0)
      set({ camera: perspCamera })
    } else {
      perspCamera.position.set(0, 0.8, -3)
      perspCamera.lookAt(0, 0, 0)
      set({ camera: perspCamera })
    }
  }, [mode])

  useFrame(() => {
    camera.lookAt(-100, 200, 500)
    camera.updateProjectionMatrix()
  })

  return null
}

export { CameraController }
