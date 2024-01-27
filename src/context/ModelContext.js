import React, { createContext, useState, useContext } from 'react'

const ModelContext = createContext(null)

const ModelProvider = ({ children }) => {
  const [modelRef, setModelRef] = useState(null)

  return <ModelContext.Provider value={{ modelRef, setModelRef }}>{children}</ModelContext.Provider>
}

const useModel = () => {
  const context = useContext(ModelContext)

  if (!context) {
    throw new Error('useModel must be used within a ModelProvider')
  }

  return context
}

export { ModelContext, ModelProvider, useModel }
