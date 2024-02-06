import { useEffect, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { assetURL } from '../helpers/url'

function usePreloadedModels(numberOfModels) {
  const [models, setModels] = useState([])
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const loader = new GLTFLoader()
    const cleanupFunctions = []
    const selectedModels = ['walk', 'idle', 'hop']

    let loadedModelsCount = 0

    const modelObjects = selectedModels.map(name => {
      const modelObj = { src: assetURL(`canary_${name}.glb`), loaded: false }

      const onLoad = gltf => {
        modelObj.gltf = gltf
        modelObj.gltf.userData = { name }
        modelObj.loaded = true
        loadedModelsCount++
        setLoadingProgress((loadedModelsCount / numberOfModels) * 100)

        if (loadedModelsCount === numberOfModels) {
          setModels(modelObjects.map(m => m.gltf))
        }
      }

      const onError = error => {
        console.error('Error loading model:', error)
      }

      loader.load(modelObj.src, onLoad, undefined, onError)

      return modelObj
    })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [])

  return { models, loadingProgress }
}

export { usePreloadedModels }
