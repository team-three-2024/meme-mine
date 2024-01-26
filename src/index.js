import * as faceapi from 'face-api.js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { StartScreen } from './lib/StartScreen'

import './styles.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      captureVideo: false
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      if (!this.state.captureVideo) this.startVideo()
    }
  }

  async componentDidMount() {
    await this.loadModels()
    this.videoRef = React.createRef()
    this.videoWidth = 320
    this.videoHeight = 240

    window.addEventListener('keydown', this.handleKeyPress)
  }

  async loadModels() {
    try {
      await faceapi.nets.faceExpressionNet.loadFromUri('/models')
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
      await faceapi.nets.mtcnn.loadFromUri('/models')
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models')
      await faceapi.nets.ageGenderNet.loadFromUri('/models')
    } catch (e) {
      console.log(e)
    }
  }

  startVideo() {
    this.setState({ captureVideo: true })

    navigator.mediaDevices
      .getUserMedia({ video: { width: this.videoWidth } })
      .then(stream => {
        console.log(this.videoRef)
        if (this.videoRef.current) {
          let video = this.videoRef.current
          video.srcObject = stream
          video.play()
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  handleVideoOnPlay() {
    setInterval(async () => {
      if (this.videoRef) {
        const detections = await faceapi
          .detectSingleFace(this.videoRef.current, new faceapi.TinyFaceDetectorOptions())
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

  render() {
    return (
      <>
        <div
          className={'App'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <StartScreen />
          {this.state.captureVideo ? (
            <div id="webcam_holder">
              <video
                id="webcam"
                ref={this.videoRef}
                height={this.videoHeight}
                width={this.videoWidth}
                onPlay={this.handleVideoOnPlay}
              />
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
            <button onClick={() => this.startVideo()}>Start Video</button>
          )}
        </div>
      </>
    )
  }
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(<App />)
