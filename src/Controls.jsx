import React, { useState, useEffect } from 'react'
import Player from './Player'
import audio from './Audio'
import './controls.css'
import { randomInt } from './utilities'

const Controls = () => {
  const [startButton, setStartButton] = useState('start audio');

  // Octave spread
  const [octaveSpread, setOctaveSpread] = useState({min : 3, max: 6});

  const changeOctaveSpread = (m1, m2) => {
    setOctaveSpread({min: m1, max: m2});
  }

  useEffect(() => {
    audio.setOctaveSpread(octaveSpread);
  }, [octaveSpread]);

  // Wave shape
  const [activeShape, setActiveShape] = useState('square');
  const shapes = ['square', 'sine', 'triangle', 'sawtooth'];

  const changeShape = (s) => {
    setActiveShape(s);
    audio.oscillators.forEach(o => o.type = s);
  }

  // Record and play back
  const createPlayers = (n) => {
    let players = [];

    for (let i = 0; i < n; ++i) {
      players.push(
        <Player i={i} />
      )
    }

    return players;
  }

  return (
    <section id="controls">
        <h3>Controls</h3>
        <div className="control-buttons">
          <div className="btn btn-controls" onClick={() => {
            setStartButton(startButton === 'stop audio' ? 'start audio' : 'stop audio');
            startButton === 'start audio' ? audio.start() : audio.stop();
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
          
          <div className="shapes">
              {shapes.map((s) => {
                  return (
                      <div onClick={() => {changeShape(s)}} className={activeShape === s ? "btn btn-controls btn-controls-active" : "btn btn-controls"}>{s}</div>
                  );
              })}
          </div>

          <div className="players">
            {createPlayers(8)}
          </div>
        </div>
        
    </section>
  )
}

export default Controls