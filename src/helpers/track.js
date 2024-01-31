const playTrack = track => {
  if (track.current) {
    track.current.pause()
    track.current.currentTime = 0
    track.current.play()
  }
}

export { playTrack }
