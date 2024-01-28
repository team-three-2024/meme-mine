import * as faceapi from 'face-api.js'
import React, { useRef, useEffect, useState, createContext, useContext } from 'react'

const WebcamContext = createContext()

export const WebcamProvider = ({ children }) => {
  const [webcamStream, setWebcamStream] = useState(null)
  // const [captureVideo, setCaptureVideo] = useState(false)
  const videoRef = useRef(null)
  const videoWidth = 320
  const videoHeight = 240

  useEffect(() => {
    // if (captureVideo) {
    startVideo()
    // }
  })

  function startVideo() {
    // setCaptureVideo(true)

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
          console.info(detections.expressions)
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

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true })
  //     .then(stream => setWebcamStream(stream))
  //     .catch(console.error)

  //   return () => {
  //     if (webcamStream) {
  //       webcamStream.getTracks().forEach(track => track.stop())
  //     }
  //   }
  // }, [])

  return (
    <WebcamContext.Provider value={{ videoRef, webcamStream, videoWidth, videoHeight, handleVideoOnPlay }}>
      {children}
    </WebcamContext.Provider>
  )
}

export const useWebcam = () => useContext(WebcamContext)
