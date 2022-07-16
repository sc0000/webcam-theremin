import {useState, useEffect} from 'react';
import * as handpose from '@tensorflow-models/handpose'

export const scale = (value, [inMin, inMax], [outMin, outMax]) => {
    return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
}

export const lerp = (A, B, factor) => {
    return A + (B - A) * factor;
}

export const fixDPI = (canvas) => {
    const dpi = window.devicePixelRatio;
    // const canvas = canvasRef.current;
    
    const styleHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
    const styleWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);

    canvas.setAttribute('height', styleHeight * dpi);
    canvas.setAttribute('width', styleWidth * dpi);
  }

  const getWindowDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return { width, height };
}

export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

export const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1) + min);
}

// TODO: Move both into Audio.js as one array of objects!
export let heightVals = [];
export let pitches = [];
