import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Glitch } from '@react-three/postprocessing'
import * as faceapi from 'face-api.js'
import { GlitchMode } from 'postprocessing'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { GameOverScreen } from './GameOverScreen'
import { CameraController } from '../components/CameraController'
import { Canary } from '../components/Canary'
import { HealthBar } from '../components/HealthBar'
import { Lights } from '../components/Lights'
import { Noise } from '../components/Noise'
import { Obstacles } from '../components/Obstacles'
import { Path } from '../components/Path'
import { canaryConfig as config } from '../config'
import { playTrack } from '../helpers/track'
import { assetURL, prefix } from '../helpers/url'

const Game = ({ videos }) => {
  const [canaryRef, setCanaryRef] = useState(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [mode, setMode] = useState('3D')
  const [hitPoints, setHitPoints] = useState(100)
  const [damage, setDamage] = useState(0)
  const [bonus, setBonus] = useState(0)

  const handleCanaryRef = ref => {
    if (ref.current) {
      setCanaryRef(ref)
    }
  }

  const handleGameOver = isGameOver => setIsGameOver(isGameOver)

  useEffect(() => {
    glitchAudioTrack.current = new Audio(assetURL('audio/glitch.mp3'))

    const glitchOut = () => {
      setIsGlitching(true)
      playTrack(glitchAudioTrack)

      setTimeout(() => {
        setMode(prevMode => {
          const newMode = prevMode === '2D' ? '3D' : '2D'

          let randomDelay
          if (newMode === '3D') {
            randomDelay = 20000 + Math.random() * 10000
          } else {
            randomDelay = 2000 + Math.random() * 3000
          }

          // Schedule the next glitchOut after the calculated delay
          setTimeout(glitchOut, randomDelay)

          return newMode
        })
      }, 800)

      setTimeout(() => {
        setIsGlitching(false)
      }, 1000)
    }

    const initialDelay = 20000 + Math.random() * 10000
    const timeoutId = setTimeout(glitchOut, initialDelay)

    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (isGameOver) {
      var id = window.setTimeout(function() {}, 0)

      while (id--) {
        window.clearTimeout(id)
      }
    }
  }, [isGameOver])

  useEffect(() => {
    const loadModels = async () => {
      Promise.all([
        faceapi.nets.faceExpressionNet.loadFromUri(prefix('/models')),
        faceapi.nets.faceRecognitionNet.loadFromUri(prefix('/models')),
        faceapi.nets.ssdMobilenetv1.loadFromUri(prefix('/models')),
        faceapi.nets.tinyFaceDetector.loadFromUri(prefix('/models')),
        faceapi.nets.mtcnn.loadFromUri(prefix('/models')),
        faceapi.nets.faceLandmark68Net.loadFromUri(prefix('/models')),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(prefix('/models')),
        faceapi.nets.ageGenderNet.loadFromUri(prefix('/models'))
      ])
    }
    loadModels()
  }, [])

  const glitchAudioTrack = useRef(null)

  let opacity = 0
  let isGlitchActive = false

  if (isGlitching) {
    opacity = 0.5
    isGlitchActive = true
  }

  const gameRef = useRef()

  return isGameOver ? (
    <GameOverScreen score={score} />
  ) : (
    <>
      <Canvas shadows dpr={[1, 2]} camera={{ position: config.cameraPosition, fov: 50 }} performance={{ min: 0.1 }}>
        <CameraController mode={mode} />

        <Lights config={config} />

        <Path ref={canaryRef} />

        <Obstacles
          videos={videos}
          hitPoints={hitPoints}
          setHitPoints={setHitPoints}
          setScore={setScore}
          handleGameOver={handleGameOver}
          setBonus={setBonus}
          setDamage={setDamage}
          ref={canaryRef}
        />

        <Canary
          animation="walk"
          speed={3}
          scale={config.model.scale}
          meshColorIndex={config.meshColorIndex}
          meshScale={config.meshScale}
          model={config.model}
          handleCanaryRef={handleCanaryRef}
        />

        <Noise mode={mode} opacity={opacity} ref={gameRef} />

        <EffectComposer>
          <Glitch
            dtSize={128}
            mode={GlitchMode.SPORADIC}
            delay={[0, 0]}
            duration={[1000, 1000]}
            active={isGlitchActive}
          />
        </EffectComposer>

        <OrbitControls
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 1.8}
          enableZoom={false}
          enableRotate={false}
        />
      </Canvas>
      {ReactDOM.createPortal(
        <ScoreContainer>
          <ScoreDisplay>score: {score}</ScoreDisplay>
          <HealthBar health={hitPoints} />
        </ScoreContainer>,
        document.body
      )}
      {ReactDOM.createPortal(
        <StatusContainer>
          <StatusDisplay>damage: {damage}</StatusDisplay>
          <StatusDisplay>bonus: {bonus}</StatusDisplay>
        </StatusContainer>,
        document.body
      )}
    </>
  )
}

const ScoreContainer = styled.div`
  position: absolute;
  top: 250px;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`

const ScoreDisplay = styled.h1`
  color: #fff;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`

const StatusContainer = styled.div`
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: end;
  pointer-events: none;
`

const StatusDisplay = styled.h1`
  margin: 0;
  color: #fff;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`

export { Game }
