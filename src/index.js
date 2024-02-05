import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import styled from 'styled-components'
import { Flow } from './lib/Flow'

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
      <Toaster />
      <Flow />
    </StyledApp>
  )
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
