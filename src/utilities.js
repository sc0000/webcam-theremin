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