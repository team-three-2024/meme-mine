import { useEffect, useState } from 'react'
import { assetURL } from '../helpers/url'

function usePreloadedVideos(videoURLs) {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const cleanupFunctions = []

    const videoElements = videoURLs.map(url => {
      const videoObj = {
        src: assetURL(url),
        videoElement: document.createElement('video'),
        loaded: false
      }

      const { videoElement } = videoObj
      videoElement.src = videoObj.src
      videoElement.preload = 'auto'
      videoElement.muted = true
      videoElement.loop = true
      videoElement.playbackRate = 1.0
      videoElement.setAttribute('playsinline', '')

      const onCanPlayThrough = () => {
        videoObj.loaded = true
        const allVideosLoaded = videoElements.every(v => v.loaded)
        if (allVideosLoaded) {
          setVideos(videoElements.map(v => v.videoElement))
        }
      }

      videoElement.addEventListener('canplaythrough', onCanPlayThrough)
      videoElement.load()

      cleanupFunctions.push(() => videoElement.removeEventListener('canplaythrough', onCanPlayThrough))

      return videoObj
    })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [videoURLs])

  return videos
}

export { usePreloadedVideos }
