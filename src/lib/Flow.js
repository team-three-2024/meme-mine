import { Preload } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useEffect } from 'react'
import styled from 'styled-components'
import { StartScreen } from './StartScreen'
import { usePreloadedModels } from '../components/Models'
import { ProgressBar } from '../components/ProgressBar'
import { usePreloadedVideos } from '../components/Videos'

const Flow = () => {
  const numberOfModels = 3
  const numberOfVideos = 32
  const { models, modelsLoadingProgress } = usePreloadedModels(numberOfModels)
  const { videos, videosLoadingProgress } = usePreloadedVideos(numberOfVideos)

  if (models.length < numberOfModels) {
    return (
      <OverlayContainer>
        <Title>loading 3D models ...</Title>
        <ProgressBar progress={modelsLoadingProgress} />
      </OverlayContainer>
    )
  }

  if (videos.length < numberOfVideos) {
    return (
      <OverlayContainer>
        <Title>loading memes...</Title>
        <ProgressBar progress={videosLoadingProgress} />
      </OverlayContainer>
    )
  }

  const handleContextLost = event => {
    event.preventDefault() // Prevent the default browser action.
    console.warn('WebGL context lost. Please reload the page or wait for restoration.')
  }

  const handleContextRestored = () => {
    console.warn('WebGL context restored. Resuming application...')
    window.location.reload()
  }

  useEffect(() => {
    const canvas = document.querySelector('canvas')

    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost, false)
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false)
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost)
        canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      }
    }
  }, [])

  return (
    <Suspense fallback={null}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 1, 3], fov: 50 }} performance={{ min: 0.1 }}>
        <Preload all />
        <StartScreen videos={videos} />
      </Canvas>
    </Suspense>
  )
}

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

export { Flow }
