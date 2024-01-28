import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as faceapi from 'face-api.js'
import React, { useState, useEffect, useRef, Suspense } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { Game } from './Game'
import { Canary } from '../components/Canary'
import { Lights } from '../components/Lights'
import { usePreloadedVideos } from '../components/Videos'
import { canaryConfig as config } from '../config'
import { WebcamProvider } from '../context/GameContext'

const StartScreen = () => {
  const [showStartScreen, setShowStartScreen] = useState(true)
  const [showSelectMode, setShowSelectedMode] = useState(true)
  const videoRef = useRef()
  const videoWidth = 320
  const videoHeight = 240
  const [captureVideo, setCaptureVideo] = useState(false)

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  useEffect(() => {
    const handleKeyPress = event => {
      if (event.key === 'Enter') {
        setShowStartScreen(false)
      }
    }

    const handleTouch = event => {
      if (event.type === 'touchstart') {
        setShowStartScreen(false)
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    if (isTouchDevice) {
      document.addEventListener('touchstart', handleTouch)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      if (isTouchDevice) {
        document.addEventListener('touchstart', handleTouch)
      }
    }
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

  const handleGameMode = gameMode => {
    if (gameMode === 'webcam') {
      startVideo()
    }
    setShowSelectedMode(false)
  }

  function startVideo() {
    setCaptureVideo(true)

    navigator.mediaDevices
      .getUserMedia({ video: { width: videoWidth } })
      .then(stream => {
        if (videoRef.current) {
          let video = videoRef.current
          video.srcObject = stream
          video.play()
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  function handleVideoOnPlay() {
    setInterval(async () => {
      if (videoRef) {
        const detections = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
        if (detections) {
          if (detections.expressions.angry > 0.5) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
          }

          if (detections.expressions.surprised > 0.5) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
          }

          if (detections.expressions.happy > 0.6) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
          }
        }
      }
    }, 100)
  }

  const numberOfVideos = 5
  const videos = usePreloadedVideos(numberOfVideos)

  if (videos.length < numberOfVideos) {
    return <div>Loading Videos...</div>
  }

  return (
    <WebcamProvider>
      {captureVideo && (
        <div id="webcam_holder">
          <video id="webcam" ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
          <p>
            <span role="img" aria-label="angry face">
              😬 to move left
            </span>
            <br />
            <span role="img" aria-label="surprised face">
              😲 to move right
            </span>
            <br />
            <span role="img" aria-label="happy face">
              😆 to jump!
            </span>
          </p>
        </div>
      )}

      {showStartScreen ? (
        <>
          <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 1, 3], fov: 50 }} performance={{ min: 0.1 }}>
            <Lights config={config} />

            <Canary
              animation="idle"
              speed="1"
              position={[0, 0.2, 0]}
              scale={config.model.scale}
              meshColorIndex={config.meshColorIndex}
              meshScale={config.meshScale}
              model={config.model}
            />

            <OrbitControls minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
          </Canvas>
          {ReactDOM.createPortal(
            showSelectMode ? (
              <OverlayContainer>
                <Title>canary in a meme mine</Title>
                <Subtitle>select game mode:</Subtitle>
                <ControllerOption onClick={() => handleGameMode('keyboard')}>
                  <span role="img" aria-label="keyboard">
                    ⌨️ keyboard
                  </span>
                </ControllerOption>
                <ControllerOption onClick={() => handleGameMode('webcam')}>
                  <span role="img" aria-label="webcam">
                    📷 webcam
                  </span>
                </ControllerOption>
              </OverlayContainer>
            ) : (
              <OverlayContainer>
                <Title>canary in a meme mine</Title>
                <AnimatedSubtitle>get ready and press enter to start</AnimatedSubtitle>
              </OverlayContainer>
            ),
            document.body
          )}
        </>
      ) : (
        <Suspense fallback={null}>
          <Game videos={videos} />
        </Suspense>
      )}
    </WebcamProvider>
  )
}

const blinkAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  margin: 0;
  color: #fff;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`
const Subtitle = styled.h2`
  color: #fff;
  margin-top: 300px;
  margin-bottom: 5px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`

const AnimatedSubtitle = styled.h2`
  color: #fff;
  margin-top: 125px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  animation: ${blinkAnimation} 1500ms linear infinite;
`
const ControllerOption = styled.h2`
  margin: 5px;
  color: #fff;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  cursor: pointer;

  &:hover {
    color: #e6007a;
  }
`

export { StartScreen }
