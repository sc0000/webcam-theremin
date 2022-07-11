import React, { useState } from 'react'

const Subdivision = ({sendPitch}) => {
    const [activePitch, setActivePitch] = useState('C');

    const pitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    sendPitch(activePitch);

  return (
    <div className="subdiv">
        <div className="selector">
            {pitches.map((p) => {
                return (
                    <div onClick={() => {setActivePitch(p); sendPitch(p);}} className={activePitch === p ? "btn-pitch btn-pitch-active" : "btn-pitch"}>{p}</div>
                );
            })}
        </div>
    </div>
  )
}

export default Subdivision