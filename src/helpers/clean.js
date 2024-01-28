function cleanUp(scene) {
  const objectsToRemove = []

  scene.traverse(object => {
    if (object.position.z <= -50) {
      objectsToRemove.push(object)
    }
  })

  objectsToRemove.forEach(object => {
    console.log('Removing object: ', object)
    scene.remove(object)

    if (object.geometry) {
      object.geometry.dispose()
    }
    if (object.material) {
      object.material.dispose()
    }
  })
}

export { cleanUp }
