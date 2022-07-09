import React, { useState } from 'react'

const Controls = () => {
  const [startButton, setStartButton] = useState('Start Audio');

  return (
    <section id="controls">
        <h3>Controls</h3>
        <div>
          <div className="btn" onClick={() => setStartButton(startButton == 'Stop Audio' ? 'Start Audio' : 'Stop Audio')}>{startButton}</div>
          {/* <div className="btn">{startButton}</div>
          <div className="btn">{startButton}</div>
          <div className="btn">{startButton}</div> */}
        </div>
        
    </section>
  )
}

export default Controls