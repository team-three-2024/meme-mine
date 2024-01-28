import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as faceapi from 'face-api.js'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { GameOverScreen } from './GameOverScreen'
import { CameraController } from '../components/CameraController'
import { Canary } from '../components/Canary'
import { Lights } from '../components/Lights'
import { Obstacles } from '../components/Obstacles'
import { Path } from '../components/Path'
import { canaryConfig as config } from '../config'

const Game = ({ videos }) => {
  const [canaryRef, setCanaryRef] = useState(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const startTimeRef = useRef(performance.now())

  const handleCanaryRef = ref => {
    if (ref.current) {
      setCanaryRef(ref)
    }
  }

  const handleGameOver = isGameOver => setIsGameOver(isGameOver)

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTimeRef) {
        setScore(parseInt((performance.now() - startTimeRef.current) / 100))
      }
    }, 10)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadModels = async () => {
      Promise.all([
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.mtcnn.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/models')
      ])
    }
    loadModels()
  }, [])

  return isGameOver ? (
    <GameOverScreen />
  ) : (
    <>
      <Canvas shadows dpr={[1, 2]} camera={{ position: config.cameraPosition, fov: 50 }} performance={{ min: 0.1 }}>
        <CameraController />

        <Lights config={config} />

        <Path ref={canaryRef} />

        <Obstacles videos={videos} handleGameOver={handleGameOver} ref={canaryRef} />

        <Canary
          animation="walk"
          speed="3"
          scale={config.model.scale}
          meshColorIndex={config.meshColorIndex}
          meshScale={config.meshScale}
          model={config.model}
          handleCanaryRef={handleCanaryRef}
        />

        <OrbitControls
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 1.8}
          enableZoom={false}
          enableRotate={false}
        />
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
