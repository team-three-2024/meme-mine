import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import React, { useRef, Suspense } from 'react'
import { CameraController } from '../components/CameraController'
import { Canary } from '../components/Canary'
import { Lights } from '../components/Lights'
import { Obstacle } from '../components/Obstacle'
import { Path } from '../components/Path'
import { canaryConfig as config } from '../config'

const Game = () => {
  const playerRef = useRef()

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: config.cameraPosition, fov: 50 }} performance={{ min: 0.1 }}>
      <CameraController />

      <Lights config={config} />

      <Path ref={playerRef} />

      <Obstacle ref={playerRef} />

      <Suspense fallback={null}>
        <Canary
          animation="walk"
          scale={config.model.scale}
          meshColorIndex={config.meshColorIndex}
          meshScale={config.meshScale}
          model={config.model}
          ref={playerRef}
        />

        <EffectComposer multisampling={16}>
          <Bloom
            kernelSize={config.bloom.kernelSize}
            luminanceThreshold={config.bloom.luminanceThreshold}
            luminanceSmoothing={config.bloom.luminanceSmoothing}
            intensity={config.bloom.intensity}
          />
        </EffectComposer>
      </Suspense>

      <OrbitControls minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
  )
}

export { Game }
