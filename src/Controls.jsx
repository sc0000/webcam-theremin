import React, { useState } from 'react'
import { numberOfDivs } from './utilities'
import audio from './Audio'
import './controls.css'

const Controls = () => {
  const [startButton, setStartButton] = useState('Start Audio');

  return (
    <section id="controls">
        <h3>Controls</h3>
        <div>
          <div className="btn btn-controls" onClick={() => {
            setStartButton(startButton == 'Stop Audio' ? 'Start Audio' : 'Stop Audio');
            startButton == 'Start Audio' ? audio.start() : audio.stop();
            }}>{startButton}
          </div>
          {/* <div>
            <div className="btn" onClick={() => {setNum(num + 1); numberOfDivs.n = num;}}>+</div>
            <div className="btn" onClick={() => {setNum(num - 1); numberOfDivs.n = num;}}>-</div>
          </div> */}
          
        </div>
        
    </section>
  )
}

export default Controls