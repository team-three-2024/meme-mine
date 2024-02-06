import * as THREE from 'three'

function createFinishLineTexture() {
  const size = 256
  const squares = 8

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')

  const squareSize = size / squares
  for (let i = 0; i < squares; i++) {
    for (let j = 0; j < squares; j++) {
      if ((i + j) % 2 === 0) {
        context.fillStyle = '#ffffff'
      } else {
        context.fillStyle = '#000000'
      }
      context.fillRect(i * squareSize, j * squareSize, squareSize, squareSize)
    }
  }

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}

export { createFinishLineTexture }
