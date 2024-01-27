import { useState, useEffect } from 'react'
import { Box3 } from 'three'

const useBoundingBox = ref => {
  const [box, setBox] = useState(null)

  useEffect(() => {
    if (ref.current) {
      const newBox = new Box3().setFromObject(ref.current)
      setBox(newBox)
    }
  }, [ref, ref.current])

  return box
}

export { useBoundingBox }
