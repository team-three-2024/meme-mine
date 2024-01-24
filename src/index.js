import React from 'react'
import { createRoot } from 'react-dom/client'
import { Game, defaultConfig } from './lib/Game'

import './styles.css'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

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
          <Game objectUrl={defaultConfig['canary'].objectUrl} config={defaultConfig['canary']} />
        </div>
      </>
    )
  }
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(<App />)
