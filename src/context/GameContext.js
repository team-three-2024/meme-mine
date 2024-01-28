import React, { createContext, useContext } from 'react'

const WebcamContext = createContext()

export const WebcamProvider = ({ children }) => {
  return <WebcamContext.Provider value={{}}>{children}</WebcamContext.Provider>
}

export const useWebcam = () => useContext(WebcamContext)
