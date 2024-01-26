import { useEffect, useState } from 'react'
import { assetURL } from '../helpers/url'

function usePreloadedVideos(videoURLs) {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const videoElements = videoURLs.map(url => ({
      src: assetURL(url),
      videoElement: null,
      loaded: false
    }))

    videoElements.forEach(videoObj => {
      const videoElement = document.createElement('video')
      videoElement.src = videoObj.src
      videoElement.preload = 'auto'
      videoElement.muted = true
      videoElement.loop = true
      videoElement.playbackRate = 1.0
      videoElement.setAttribute('playsinline', '')

      const onCanPlayThrough = () => {
        videoObj.videoElement = videoElement
        videoObj.loaded = true

        const allVideosLoaded = videoElements.every(v => v.loaded)
        if (allVideosLoaded) {
          setVideos(videoElements.map(v => v.videoElement))
        }
      }

      videoElement.addEventListener('canplaythrough', onCanPlayThrough)
      videoElement.load()

      return () => {
        videoElement.removeEventListener('canplaythrough', onCanPlayThrough)
      }
    })
  }, [videoURLs])

  return videos
}

export { usePreloadedVideos }
