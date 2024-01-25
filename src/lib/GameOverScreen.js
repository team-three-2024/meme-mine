import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import React, { useRef, Suspense } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { Canary } from '../components/Canary'
import { Lights } from '../components/Lights'
import { canaryConfig as config } from '../config'

const GameOverScreen = () => {
  const playerRef = useRef()

  return (
    <>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 1, 0], fov: 50 }} performance={{ min: 0.1 }}>
        <Lights config={config} />

        <Suspense fallback={null}>
          <Canary
            animation="dead"
            position={[0, 0.2, 0]}
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
        <OverlayContainer>
          <Title>GAME OVER</Title>
          <Subtitle>press enter to restart</Subtitle>
        </OverlayContainer>,
        document.body
      )}
    </>
  )
}

const blinkAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

const OverlayContainer = styled.div`
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

const Title = styled.h1`
  color: #fff;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`

const Subtitle = styled.h2`
  color: #fff;
  margin-top: 125px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  animation: ${blinkAnimation} 1500ms linear infinite;
`

export { GameOverScreen }
