import React, { useState } from 'react'
import './dropdownMenu.css'

// TODO: Rename this component!
const DropdownMenu = () => {
    const [activePitch, setActivePitch] = useState('C');

    const pitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  return (
    <div className="dropdown-menu">
            {pitches.map((p) => {
                return (
                    <div onClick={() => {setActivePitch(p)}} className={activePitch === p ? "btn-pitch btn-pitch-active" : "btn-pitch"}>{p}</div>
                );
            })}
    </div>
  )
}

export default DropdownMenu