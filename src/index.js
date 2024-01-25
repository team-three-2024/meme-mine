import React from 'react'
import { createRoot } from 'react-dom/client'
import { StartScreen } from './lib/StartScreen'

import './styles.css'

class App extends React.Component {
  render() {
    return (
      <>
        <div
          className={'App'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <StartScreen />
        </div>
      </>
    )
  }
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(<App />)
