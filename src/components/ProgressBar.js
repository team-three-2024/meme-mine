import React from 'react'
import styled from 'styled-components'

const ProgressBar = ({ progress }) => (
  <ProgressBarContainer>
    <Progress progress={progress} />
  </ProgressBarContainer>
)

const ProgressBarContainer = styled.div`
  width: 15vw;
  background-color: #ddd;
  border: 2px solid #666;
  border-radius: 20px;
  overflow: hidden;
`

const Progress = styled.div`
  height: 20px;
  width: ${props => props.progress}%;
  background-color: #e6007a;
  transition: width 0.5s ease-in-out;
`

export { ProgressBar }
