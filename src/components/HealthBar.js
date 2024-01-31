import React from 'react'
import styled from 'styled-components'

const HealthBar = ({ health }) => (
  <HealthBarContainer>
    <Health health={health} />
  </HealthBarContainer>
)

const HealthBarContainer = styled.div`
  width: 25vw;
  background-color: #ddd;
  border: 2px solid #666;
  border-radius: 20px;
  overflow: hidden;
`

const Health = styled.div`
  height: 20px;
  width: ${props => props.health}%;
  background-color: #01ffff;
  transition: width 0.5s ease-in-out;
`

export { HealthBar }
