import { Html, OrbitControls } from '@react-three/drei'
import React, { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { CameraController } from '../components/CameraController'
import { Canary } from '../components/Canary'
import { Lights } from '../components/Lights'
import { canaryConfig as config } from '../config'
import { Credits } from '../components/Credits'

const GameOverScreen = ({ score }) => {
  const mode = 'over'

  useEffect(() => {
    const handleKeyPress = event => {
      if (event.key === 'Enter') {
        window.location.reload()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <>
      <CameraController mode={mode} />

      <Lights config={config} />

      <Canary
        animation="dead"
        canMove={false}
        canJump={false}
        position={[0, 0.2, 0]}
        scale={config.model.scale}
        meshColorIndex={config.meshColorIndex}
        meshScale={config.meshScale}
        model={config.model}
      />

      <OrbitControls minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />

      <Html fullscreen>
        <OverlayContainer>
          <Title>GAME OVER</Title>
          <Subtitle>press enter to restart</Subtitle>
          <FinalScore>final score: {score}</FinalScore>
        </OverlayContainer>

        <Credits />
      </Html>
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
`

const FinalScore = styled.h2`
  color: #fff;
  margin-top: 10px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
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
