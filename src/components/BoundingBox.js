import { useState, useEffect } from 'react'
import * as THREE from 'three'

const useBoundingBox = ref => {
  const [box, setBox] = useState(null)

  useEffect(() => {
    if (ref.current) {
      const newBox = new THREE.Box3().setFromObject(ref.current)
      setBox(newBox)
    }
  }, [ref, ref.current])

  return box
}

const addBoundingBoxHelper = (ref, scene) => {
  const helper = new THREE.BoxHelper(ref, 0xffff00)
  scene.add(helper)
  return helper
}

export { useBoundingBox, addBoundingBoxHelper }
