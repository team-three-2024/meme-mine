import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import { StartScreen } from './lib/StartScreen'

import './styles.css'
import { Toaster } from 'react-hot-toast'

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`

const Credits = styled.h3`
  margin: 0;
  color: #fff;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`

const Logo = styled.h5`
  color: #fff;
  margin: 0;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: end;
  padding: 50px;
`

const App = () => {
  return (
    <StyledApp>
      <Toaster position="top-left" />
      <StartScreen />
      {ReactDOM.createPortal(
        <OverlayContainer>
          <Credits>powered by</Credits>
          <Logo>anything world</Logo>
          <Logo>kusama network</Logo>
          <Logo>faceapi</Logo>
          <Logo>giphy</Logo>
        </OverlayContainer>,
        document.body
      )}
    </StyledApp>
  )
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(<App />)
