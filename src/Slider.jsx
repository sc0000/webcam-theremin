import React, { useState, useRef } from 'react'
import { useEffect } from 'react';
import './slider.css'
import audio from './Audio'
import { scale } from './utilities'

// TODO: Solve: releasing mouse outside of component

const Slider = ({live, iterator}) => {
    let innerRef = useRef(null);
    let handleRef = useRef(null);
    const [hold, setHold] = useState(false);
    const [offset, setOffset] = useState(0);
    const [startX, setStartX] = useState(0);

    const handleDown = (e) => {
        setHold(true);
    }

    useEffect(() => {
        if (hold) setStartX(handleRef.current.offsetLeft +  15);
    }, [hold]);

    const handleMove = (e) => {
        if (hold) setOffset(e.pageX - startX);
    }

    const handleUp = (e) => {
        setOffset(0);
        setHold(false);
    }

    useEffect(() => {
        const currentX = startX + offset;
        const minX = handleRef.current.offsetLeft + handleRef.current.clientWidth - 3;
        const maxX = handleRef.current.offsetLeft + innerRef.current.clientWidth + 3;

        if (hold && 
            (currentX > minX) &&
            (currentX < maxX)) {
            handleRef.current.style.transform = `translateX(${offset}px)`;

            if (audio.players[iterator]) {
                audio.players[iterator].volume.value = scale(currentX, [minX, maxX], [-12, 12]);
            }
        }
    }, [offset]);

  return (
    <div className="slider-outer" onMouseDown={handleDown} onMouseUp={handleUp} onMouseMove={handleMove}>
        <div className="slider-inner" ref={innerRef}>
            <div className="slider-handle" 
                ref={handleRef}
                />
        </div>
    </div>
  )
}

export default Slider