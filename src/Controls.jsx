import React, { useState } from 'react'
import audio from './Audio'

const Controls = () => {
  const [startButton, setStartButton] = useState('Start Audio');

  return (
    <section id="controls">
        <h3>Controls</h3>
        <div>
          <div className="btn" onClick={() => {
            setStartButton(startButton == 'Stop Audio' ? 'Start Audio' : 'Stop Audio');
            startButton == 'Start Audio' ? audio.start() : audio.stop();
            }}>{startButton}</div>
          {/* <div className="btn">{startButton}</div>
          <div className="btn">{startButton}</div>
          <div className="btn">{startButton}</div> */}
        </div>
        
    </section>
  )
}

export default Controls