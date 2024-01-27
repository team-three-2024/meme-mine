import React from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import { ModelProvider } from './context/ModelContext'
import { StartScreen } from './lib/StartScreen'
import './styles.css'

// Styled component
const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`

const App = () => {
  return (
    <ModelProvider>
      <StyledApp>
        <StartScreen />
      </StyledApp>
    </ModelProvider>
  )
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(<App />)
