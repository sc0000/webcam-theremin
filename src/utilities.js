import {useState, useEffect} from 'react';

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

export let numberOfDivs = {n: 3};