import React from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import { StartScreen } from './lib/StartScreen'

import './styles.css'

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`

const App = () => {
  return (
    <StyledApp>
      <StartScreen />
    </StyledApp>
  )
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(<App />)
