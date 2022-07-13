import React, { useState } from 'react'
import audio from './Audio';

const Player = ({p}) => {
    const [playButton, setPlayButton] = useState('start playback');

  return (
    <div className="player">
        <div onClick={() => {
                setPlayButton(playButton === 'stop playback' ? 'start playback' : 'stop playback');
                playButton === 'start playback' ? p.start() : p.stop();
              }} 
                className={playButton === 'start playback' ? "btn btn-controls" : "btn btn-controls btn-controls-active"}>{playButton}
        </div>
    </div>
  )
}

export default Player