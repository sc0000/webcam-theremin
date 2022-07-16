import React, { useState } from 'react'
import { randomInt } from './utilities';

const Subdivision = ({sendPitch}) => {
    const pitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const [activePitch, setActivePitch] = useState(pitches[randomInt(0, 11)]);

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