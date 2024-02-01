import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
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

const Credits = styled.h3`
  margin: 0;
  color: #fff;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`

const Logo = styled.a`
  font-size: 14px;
  color: #fff;
  margin: 0;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  text-decoration: none;

  &:hover {
    color: #e6007a;
  }
`

const OverlayContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: end;
  padding: 50px;
`

const App = () => {
  return (
    <StyledApp>
      <Toaster />
      <Flow />
      {ReactDOM.createPortal(
        <OverlayContainer>
          <Credits>powered by</Credits>
          <Logo href="https://anything.world/" target="_blank" rel="noopener noreferrer">
            anything world
          </Logo>
          <Logo href="https://kusama.network/" target="_blank" rel="noopener noreferrer">
            kusama network
          </Logo>
          <Logo href="https://github.com/justadudewhohacks/face-api.js" target="_blank" rel="noopener noreferrer">
            face api
          </Logo>
          <Logo href="https://giphy.com/" target="_blank" rel="noopener noreferrer">
            giphy
          </Logo>
        </OverlayContainer>,
        document.body
      )}
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
