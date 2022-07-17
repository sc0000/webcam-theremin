import React, { useState, useEffect } from 'react'
import Player from './Player'
import audio from './Audio'
import './controls.css'
import { randomInt } from './utilities'
import Dropdown from './Dropdown'

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

  const createShapesMenu = () => {
    return (<div className="shapes" style={{position: "absolute"}}>
              {shapes.map((s) => {
                  return (
                      <div onClick={() => {setActiveShape(s)}} className={activeShape === s ? "btn btn-controls btn-controls-active" : "btn btn-controls"}>{s}</div>
                  );
              })}
          </div>)
  }

  const changeShape = (s) => {
    setActiveShape(s);
    audio.oscillators.forEach(o => o.type = s);
  }

  // Record and play back
  const createPlayers = (n) => {
    let players = [];

    for (let i = 0; i < n; ++i) {
      players.push(
        <Player key={i*10} i={i} />
      )
    }

    return players;
  }

  // const createThumbNodes = () => {
  //   const nodes = [];
  //   let xOffset = 0;

  //   for (let i = 0; i < 4; ++i) {
  //     nodes.push(
  //       <Dropdown key={i+20} 
  //         style={{
  //           transform: `translateX(${xOffset}px)`
  //         }}
          
  //         children={<div className="shapes" style={{position: "absolute"}}>
  //         {shapes.map((s) => {
  //             return (
  //                 <div onClick={() => {setActiveShape(s)}} className={activeShape === s ? "btn btn-controls btn-controls-active" : "btn btn-controls"}>{s}</div>
  //             );
  //         })}
  //     </div>}/>
  //     );

  //     xOffset += 12;
  //   }

  //   return nodes;
  // }

  const createNodes = (firstIterator) => {
    const nodes = [];

    for (let i = 0; i < 4; ++i) {
      nodes.push(
        <Dropdown key={i+30} iterator={firstIterator + i}
          // style={{
          //   transform: `translateX(${xOffset}px)`
          // }}
          
      //     children={<div className="shapes" style={{position: "absolute"}}>
      //     {shapes.map((s) => {
      //         return (
      //             <div onClick={() => {setActiveShape(s)}} className={activeShape === s ? "btn btn-controls btn-controls-active" : "btn btn-controls"}>{s}</div>
      //         );
      //     })}
      // </div>}
        />
      );
    }

    return nodes;
  }

  return (
    <section id="controls">
        {/* <h3 style={{marginBottom: "1.34rem"}}>Controls</h3> */}
        
        <div className="control-buttons">
          <div className="button-outer">
            <div className="btn btn-controls" onClick={() => {
              setStartButton(startButton === 'stop audio' ? 'start audio' : 'stop audio');
              startButton === 'start audio' ? audio.start() : audio.stop();
              }}>{startButton}
            </div>
          </div>
          
          {/* <div className="octave-spread">
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
          </div> */}
          
          {/* <div className="shapes">
              {shapes.map((s) => {
                  return (
                      <div onClick={() => {changeShape(s)}} className={activeShape === s ? "btn btn-controls btn-controls-active" : "btn btn-controls"}>{s}</div>
                  );
              })}
          </div> */}

          <div className="shapes shapes-all">
              <div className="fingers">
                <div className="shapes shapes-thumb">
                  {createNodes(1)}
                  {/* {createNodes(0, 0)} */}
                </div>

                <div className="shapes shapes-index">
                  {createNodes(5)}
                  {/* {createNodes(0, 0)} */}
                </div>

                <div className="shapes shapes-middle">
                  {/* {createNodes(10, 3)} */}
                  {createNodes(9)}
                </div>

                <div className="shapes shapes-ring">
                  {createNodes(13)}
                  {/* {createNodes(0, 0)} */}
                </div>

                <div className="shapes shapes-pinky">
                  {createNodes(17)}
                  {/* {createNodes(0, 0)} */}
                </div>

              </div>
            
          </div>
          <div className="players-outer">
            <div className="players">
              {createPlayers(6)}
            </div>
          </div>
        </div>
        
    </section>
  )
}

export default Controls