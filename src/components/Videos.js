import { useEffect, useState } from 'react'
import { assetURL } from '../helpers/url'

function usePreloadedVideos(numberOfVideos) {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const cleanupFunctions = []
    const selectedFilenames = []
    const allFilenames = [
      'monkey.mp4',
      'good_job.mp4',
      'wooow.mp4',
      'really_girl.mp4',
      'ooohh.mp4',
      'cook.mp4',
      'black_white_hihi.mp4',
      'happy_face.mp4',
      'marmot.mp4',
      'nope.mp4',
      'congrats.mp4',
      'cat2.mp4',
      'hiding_in_bush.mp4',
      'blink_of_surprise.mp4',
      'cat3.mp4',
      'candy_cotton_girl.mp4',
      'cat1.mp4',
      'be_smart.mp4',
      'hard_math.mp4',
      'hurray_guy.mp4',
      'gamer.mp4',
      'disappointment.mp4',
      'spongebob.mp4',
      'omg_office.mp4',
      'minion.mp4',
      'how_to_play.mp4',
      'trick_smile_girl.mp4',
      'we_all_die.mp4',
      'fire.mp4',
      'confetti.mp4',
      'high_five.mp4',
      'girl_with_brush.mp4'
    ]

    for (let i = 0; i < numberOfVideos; i++) {
      const randomIndex = Math.floor(Math.random() * allFilenames.length)
      selectedFilenames.push(allFilenames[randomIndex])
    }

    const videoElements = selectedFilenames.map(filename => {
      const videoObj = {
        src: assetURL(`memes/${filename}`),
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
  }, [numberOfVideos])

  return videos
}

export { usePreloadedVideos }
