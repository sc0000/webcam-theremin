import React, { useState, useEffect } from 'react'
import { numberOfDivs } from './utilities'
import audio from './Audio'
import './controls.css'

const Controls = () => {
  const [startButton, setStartButton] = useState('Start Audio');

  const [octaveSpread, setOctaveSpread] = useState({min : 3, max: 6});

  // useEffect = (() => {
    
  // }, [octaveSpread])

  const changeOctaveSpread = (m1, m2) => {
    setOctaveSpread({min: m1, max: m2});
    audio.setOctaveSpread(octaveSpread);
    console.log(audio.octaveSpread);
  }

  return (
    <section id="controls">
        <h3>Controls</h3>
        <div>
          <div className="btn btn-controls" onClick={() => {
            setStartButton(startButton == 'Stop Audio' ? 'Start Audio' : 'Stop Audio');
            startButton == 'Start Audio' ? audio.start() : audio.stop();

            }}>{startButton}
          </div>
          <div className="octave-spread">
            <div>
              <div>max oct {octaveSpread.max}</div>
            
              <div className="btn btn-controls" onClick={() => changeOctaveSpread(octaveSpread.min, octaveSpread.max + 1)}>+</div>
              <div className="btn btn-controls" onClick={() => changeOctaveSpread(octaveSpread.min, octaveSpread.max - 1)}>-</div>
            </div>

            <div>
              <div>min oct {octaveSpread.min}</div>
              <div className="btn btn-controls" onClick={() => changeOctaveSpread(octaveSpread.min + 1, octaveSpread.max)}>+</div>
              <div className="btn btn-controls" onClick={() => changeOctaveSpread(octaveSpread.min - 1, octaveSpread.max)}>-</div>
            </div>
            
          </div>
          
        </div>
        
    </section>
  )
}

export default Controls