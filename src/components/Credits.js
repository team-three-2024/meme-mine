import React from 'react'
import styled from 'styled-components'

const Title = styled.h3`
  margin: 0;
  color: #fff;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`

const Credit = styled.a`
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
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: end;
  padding: 50px;
`

const Credits = () => (
  <OverlayContainer>
    <Title>powered by</Title>
    <Credit href="https://anything.world/" target="_blank" rel="noopener noreferrer">
      anything world
    </Credit>
    <Credit href="https://kusama.network/" target="_blank" rel="noopener noreferrer">
      kusama network
    </Credit>
    <Credit href="https://github.com/justadudewhohacks/face-api.js" target="_blank" rel="noopener noreferrer">
      face api
    </Credit>
    <Credit href="https://giphy.com/" target="_blank" rel="noopener noreferrer">
      giphy
    </Credit>
  </OverlayContainer>
)

export { Credits }
