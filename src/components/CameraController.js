import { useThree, useFrame } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import * as THREE from 'three'

function CameraController() {
  const { camera, set } = useThree()
  const [is2D, setIs2D] = useState(false)
  const perspCamera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1000)

  useEffect(() => {
    const toggleCamera = event => {
      if (event.code === 'Space') {
        setIs2D(!is2D)
      }
    }

    window.addEventListener('keydown', toggleCamera)

    return () => {
      window.removeEventListener('keydown', toggleCamera)
    }
  }, [is2D])

  useEffect(() => {
    if (is2D) {
      perspCamera.position.set(-20, 0, 0)
      perspCamera.lookAt(20, 0, 0)
      set({ camera: perspCamera })
    } else {
      perspCamera.position.set(0, 0.8, -3)
      perspCamera.lookAt(0, 0, 0)
      set({ camera: perspCamera })
    }
  }, [is2D])

  useFrame(() => {
    camera.lookAt(-100, 200, 500)
    camera.updateProjectionMatrix()
  })

  return null
}

export { CameraController }
