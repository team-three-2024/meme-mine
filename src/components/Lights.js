/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useHelper } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'
import { brandPalette } from '../config'

const Lights = ({ config }) => {
  const groupL = useRef()
  const groupR = useRef()
  const front = useRef()
  const lightL = useRef()
  const lightR = useRef()
  const lightF = useRef()

  useFrame(state => {
    const t = state.clock.getElapsedTime()

    // storm effect
    let currentPosition = 15
    if (parseInt(t) % 4 === 1) {
      currentPosition = (Math.random() * 15) | 0
    }

    groupL.current.position.x = (Math.sin(t) / 4) * currentPosition
    groupL.current.position.y = (Math.cos(t) / 4) * currentPosition
    groupL.current.position.z = (Math.cos(t) / 4) * currentPosition

    groupR.current.position.x = (Math.cos(t) / 4) * 10
    groupR.current.position.y = (Math.sin(t) / 4) * 10
    groupR.current.position.z = (Math.sin(t) / 4) * 10

    front.current.position.x = (Math.sin(t) / 4) * 10
    front.current.position.y = (Math.cos(t) / 4) * 10
    front.current.position.z = (Math.sin(t) / 4) * 10
  })

  if (config.debug === true) {
    useHelper(lightL, THREE.PointLightHelper)
    useHelper(lightR, THREE.PointLightHelper)
    useHelper(lightF, THREE.PointLightHelper)
  }

  return (
    <>
      <group ref={groupL}>
        <pointLight
          ref={lightL}
          color={brandPalette[config.pointLight.color[0]]}
          position={config.pointLight.position}
          distance={config.pointLight.distance}
          intensity={config.pointLight.intensity[0]}
        />
      </group>
      <group ref={groupR}>
        <pointLight
          ref={lightR}
          color={brandPalette[config.pointLight.color[1]]}
          position={config.pointLight.position}
          distance={config.pointLight.distance}
          intensity={config.pointLight.intensity[1]}
        />
      </group>
      <group ref={front}>
        <pointLight
          ref={lightF}
          color={brandPalette[config.pointLight.color[2]]}
          position={config.pointLight.position}
          distance={config.pointLight.distance}
          intensity={config.pointLight.intensity[2]}
        />
      </group>
    </>
  )
}

export { Lights }
