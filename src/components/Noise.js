import { useFrame, useLoader, useThree } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three'
import { assetURL } from '../helpers/url'

const Noise = React.forwardRef(({ mode, opacity }, ref) => {
  const { size, camera } = useThree()
  const noiseTexture = useLoader(THREE.TextureLoader, assetURL('noise.png'))

  useFrame(() => {
    const positionX = mode === '2D' ? camera.position.x + 0.5 : camera.position.x
    const positionY = camera.position.y
    const positionZ = mode === '2D' ? camera.position.z : camera.position.z + 0.5

    ref.current.position.set(positionX, positionY, positionZ)
    ref.current.lookAt(camera.position)
  })

  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[size.width / 500, size.height / 500]} />
      <meshBasicMaterial map={noiseTexture} transparent opacity={opacity} />
    </mesh>
  )
})

export { Noise }
