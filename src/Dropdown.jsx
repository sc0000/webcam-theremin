import React, { useState, useEffect } from 'react'
import audio from './Audio'
import './'
import { randomInt } from './utilities';

const Dropdown = ({iterator}) => {
    const [open, setOpen] = useState(false);

    // Wave shape
    const shapes = ['square', 'sine', 'triangle', 'sawtooth'];
    const [activeShape, setActiveShape] = useState(shapes[randomInt(0, 3)]);

  useEffect(() => {
    audio.oscillators[iterator].type = activeShape;
    setOpen(false);
  }, [activeShape])

  const createSelector = () => {
    return (<div className="shapes" style={{position: "absolute", width: "max-content", backgroundColor: "#101820ff"}}>
              {shapes.map((s) => {
                  return (
                      <div onClick={() => {setActiveShape(s)}} 
                        className={activeShape === s ? "btn btn-controls btn-controls-active" : "btn btn-controls"}
                        style={{margin: "3px"}}
                        >{s.substring(0, 3)}</div>
                  );
              })}
          </div>)
  }

  return (
    <div className="dropdown">
        <div style={{
          padding: "0.3rem",
          fontSize: "0.4rem",
          margin: "0.3rem",
        }} className={open ? "btn btn-controls btn-controls-active" : "btn btn-controls"} onClick={() => setOpen(!open)}>
            {activeShape.substring(0, 3)}
        </div>

        {/* {open && props.children} */}
        {open && createSelector()}
    </div>
    
  )
}

export default Dropdown