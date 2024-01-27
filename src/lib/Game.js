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
import { usePreloadedVideos } from '../components/Videos'
import { canaryConfig as config } from '../config'

const Game = () => {
  const [showGameOverScreen, setShowGameOverScreen] = useState(true)
  const [score, setScore] = useState(0)
  const startTimeRef = useRef(performance.now())
  const playerRef = useRef()
  const videoURLs = [
    'memes/really_girl.mp4',
    'memes/candy_cotton_girl.mp4',
    'memes/hard_math.mp4',
    'memes/how_to_play.mp4',
    'memes/cat1.mp4',
    'memes/cat2.mp4',
    'memes/cat3.mp4'
  ]
  const videos = usePreloadedVideos(videoURLs)
  const videoRef = useRef()
  const videoWidth = 320
  const videoHeight = 240
  const [captureVideo, setCaptureVideo] = useState(false)

  useEffect(() => {
    if (showGameOverScreen) {
      const handleKeyPress = event => {
        if (event.key === 'Enter') {
          setShowGameOverScreen(false)
          if (!captureVideo) startVideo()
        }
      }

      document.addEventListener('keydown', handleKeyPress)

      return () => {
        document.removeEventListener('keydown', handleKeyPress)
      }
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setScore(parseInt((performance.now() - startTimeRef.current) / 100))
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
          if (detections.expressions.happy > 0.6) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
          } else if (detections.expressions.surprised > 0.6) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
          }
        }
      }
    }, 100)
  }

  if (videos.length !== videoURLs.length) {
    return <div>Loading Videos...</div>
  }

  return !showGameOverScreen ? (
    <GameOverScreen />
  ) : (
    <>
      {captureVideo ? (
        <div id="webcam_holder">
          <video id="webcam" ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
          <p>
            <span role="img" aria-label="surprised face">
              😲
            </span>
            /
            <span role="img" aria-label="happy face">
              😆
            </span>{' '}
            to jump!
          </p>
        </div>
      ) : (
        <button onClick={() => startVideo()}>Start Video</button>
      )}

      <Canvas shadows dpr={[1, 2]} camera={{ position: config.cameraPosition, fov: 50 }} performance={{ min: 0.1 }}>
        <CameraController />

        <Lights config={config} />

        <Path ref={playerRef} />

        <Obstacles videos={videos} ref={playerRef} />

        <Canary
          animation="walk"
          speed="3"
          scale={config.model.scale}
          meshColorIndex={config.meshColorIndex}
          meshScale={config.meshScale}
          model={config.model}
          ref={playerRef}
        />

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
