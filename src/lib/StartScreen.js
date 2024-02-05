import { Html, OrbitControls } from '@react-three/drei'
import * as faceapi from 'face-api.js'
import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { Game } from './Game'
import { Canary } from '../components/Canary'
import { Credits } from '../components/Credits'
import { Lights } from '../components/Lights'
import { canaryConfig as config } from '../config'
import { prefix } from '../helpers/url'

const StartScreen = ({ videos }) => {
  const [showStartScreen, setShowStartScreen] = useState(true)
  const [showSelectMode, setShowSelectedMode] = useState(true)
  const videoRef = useRef()
  const videoWidth = 320
  const videoHeight = 240
  const [captureVideo, setCaptureVideo] = useState(false)

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  useEffect(() => {
    if (showSelectMode) {
      return
    }

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
  }, [showSelectMode, setShowSelectedMode])

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

  return (
    <>
      {captureVideo && (
        <Html fullscreen>
          <div id="webcam_holder">
            <video id="webcam" ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
            <p>
              <span role="img" aria-label="angry face">
                😬😠 (angry) to move left
              </span>
              <br />
              <span role="img" aria-label="surprised face">
                😲 (surprised) to move right
              </span>
              <br />
              <span role="img" aria-label="happy face">
                😆 (happy) to jump!
              </span>
            </p>
          </div>
        </Html>
      )}

      {showStartScreen ? (
        <>
          <Lights config={config} />

          <Canary
            animation={showSelectMode ? 'idle' : 'walk'}
            speed={1}
            position={[0, 0.2, 0]}
            scale={config.model.scale}
            meshColorIndex={config.meshColorIndex}
            meshScale={config.meshScale}
            model={config.model}
          />

          <OrbitControls minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />

          <Html fullscreen>
            {showSelectMode ? (
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
                <fieldset>
                  <legend style={{ color: '#e6007a' }}>hint</legend>
                  <Hint>the only way to score is by nearly avoiding collision with memes</Hint>
                  <Hint>but be careful, you will lose health if you hit the memes</Hint>
                  <Hint style={{ color: '#e6007a' }}>the closer you get, the more points you earn!</Hint>
                </fieldset>
              </OverlayContainer>
            )}

            <Credits />
          </Html>
        </>
      ) : (
        <Game videos={videos} />
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
const Hint = styled.p`
  color: #fff;
  margin: 1px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  text-align: center;
`

const AnimatedSubtitle = styled.h2`
  color: #fff;
  margin-top: 300px;
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
