import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import React, { useEffect, useRef, useState, Suspense } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { CameraController } from '../components/CameraController'
import { Canary } from '../components/Canary'
import { Lights } from '../components/Lights'
import { Obstacle } from '../components/Obstacle'
import { Path } from '../components/Path'
import { canaryConfig as config } from '../config'

const Game = () => {
  const [score, setScore] = useState(0)
  const startTimeRef = useRef(performance.now())
  const playerRef = useRef()

  useEffect(() => {
    const interval = setInterval(() => {
      setScore(parseInt((performance.now() - startTimeRef.current) / 100))
    }, 10)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Canvas shadows dpr={[1, 2]} camera={{ position: config.cameraPosition, fov: 50 }} performance={{ min: 0.1 }}>
        <CameraController />

        <Lights config={config} />

        <Path ref={playerRef} />

        <Obstacle ref={playerRef} />

        <Suspense fallback={null}>
          <Canary
            animation="walk"
            speed="3"
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
      {ReactDOM.createPortal(
        <ScoreContainer>
          <Score>Score: {score}</Score>
        </ScoreContainer>,
        document.body
      )}
    </>
  )
}

const ScoreContainer = styled.div`
  position: absolute;
  top: 25px;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`

const Score = styled.h1`
  color: #fff;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`

export { Game }
