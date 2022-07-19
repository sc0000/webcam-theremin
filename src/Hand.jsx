import React, { useRef, useState, useEffect } from 'react'

import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'
import { HandDetector } from '@tensorflow-models/handpose/dist/hand'
import { rand } from '@tensorflow/tfjs'

import './hand.css'
import { scale, lerp, fixDPI, randomInt, pitches, heightVals } from './utilities'
import audio from './Audio'
// import Dropdown from './Dropdown'
import PitchArea from './PitchArea'



const Hand = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [num, setNum] = useState(0);

  const coordinates = [];

  let net = null;

  const runHandpose = async () => {
    // TODO: Find better way to prevent reloading of the model
    if (num === 0) {
      net = await handpose.load();
      console.log("Hand recognition model loaded");
      setNum(1);
    }

    // Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 20);
  }
  
  const detect = async (net) => {
    if (typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4) {
        // Get video properties
        const video = webcamRef.current.video;

        // Get intrinsic size of the resource
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Scale canvas to prevent blur
        fixDPI(canvasRef.current);
      
        // Make detections
        const hand = await net.estimateHands(video);

        if (coordinates.length === 0) {
          for (let i = 0; i < 21; ++i) {
            const c = {
              x: canvasRef.current.clientWidth / 2,
              y: canvasRef.current.clientHeight / 2,
              size: 8,
              angle: 2 * Math.PI * Math.random(), 
            }
        
            coordinates.push(c);
          }
        }

        // Draw to canvas
        drawHand(hand, videoWidth, videoHeight);
      }
  }

  const drawHand = async (predictions, videoWidth, videoHeight) => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-2');

    ctx.strokeStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-3');

    ctx.lineWidth = 3;
    ctx.lineCap = 'square';

    if (predictions.length > 0) {
      predictions.forEach((p) => {
        const landmarks = p.landmarks;
        
        for (let i = 0; i < landmarks.length; ++i) {
          const targetX = canvasRef.current.width - scale(landmarks[i][0], [0, videoWidth], [0, canvasRef.current.width]);
          const targetY = scale(landmarks[i][1], [0, videoHeight], [0, canvasRef.current.height]);
          
          coordinates[i].x = lerp(coordinates[i].x, targetX, 0.08);
          coordinates[i].y = lerp(coordinates[i].y, targetY, 0.08);

          const targetSize = scale(Math.abs(landmarks[i][2]), [0, 80], [2, 32]);
          coordinates[i].size = lerp(coordinates[i].size, targetSize, 0.01);
          
          ctx.fillRect(coordinates[i].x,  coordinates[i].y, coordinates[i].size, coordinates[i].size);          

          //
          // Update corresponding oscillator
          //

          for (let j = 0; j < heightVals.length; ++j) {
            if (coordinates[i].y > heightVals[j]) {
              audio.oscillators[i].set({
                frequency: `${pitches[j].pitch}${randomInt(pitches[j].min, pitches[j].max)}`,
                });
            }
          }

          audio.oscillators[i].volume.value = scale(coordinates[i].x, [0, canvasRef.current.width], [-48, -12]);
        }
      });
    }

    else {
      for (let i = 0; i < 21; ++i) {
        coordinates[i].angle += Math.PI * 0.005;

        const targetX = (canvasRef.current.width / 1.6) - Math.sin(coordinates[i].angle) * 300;
        const targetY = (canvasRef.current.height / 2) - Math.cos(coordinates[i].angle) * 300;

        coordinates[i].x = lerp(coordinates[i].x, targetX, 0.08);
        coordinates[i].y = lerp(coordinates[i].y, targetY, 0.08);

        ctx.fillRect(coordinates[i].x, coordinates[i].y, coordinates[i].size, coordinates[i].size);

        // Update corresponding oscillator pitch
        updatePitch(i);

        // TODO: Add to function
        audio.oscillators[i].volume.value = scale(coordinates[i].x, [0, canvasRef.current.width], [-48, -12]);
      }
    }
  }

  // TODO: Move into Audio.js
  const updatePitch = (iterator) => {
    const targetPitch = 880 - scale(coordinates[iterator].y, [0, canvasRef.current.height], [220, 880]);
        audio.updatePitch(audio.oscillators[iterator], targetPitch);
  }

  runHandpose();

  useEffect(() => {
    heightVals.splice(0, heightVals.length);
    document.querySelectorAll('.subdiv').forEach((s) => {
      heightVals.push(s.getBoundingClientRect().y);
    });
    
  }, [num]);

  const createPitchAreas = (n) => {
    let pitchAreas = [];

    for (let i = 0; i < n; ++i) {
      const sendPitch = (p) => {
          pitches[i] = p;
      } 

      pitchAreas.push(
        <PitchArea key={i*6} sendPitch={sendPitch}/>
      );
    }

    return pitchAreas;
  }

  return (
    <section id="hand">
      <div className="header">
        <div className="set-subs">
          <div style={{
              marginTop: "0.6rem", marginLeft: "0.3rem", fontSize: "1rem", padding: "0.rem", width: "3rem"
            }}

            className="btn btn-hand" onClick={() => {
            setNum(num + 1)}}>+</div>
          <div style={{
              marginTop: "0.6rem", marginLeft: "0.3rem", fontSize: "1rem", padding: "0.rem", width: "3rem"
            }}
            
            className="btn btn-hand" onClick={() => {setNum(num - 1)}}>-</div>
        </div>

        <h3>BROWSER THEREMIN 3000</h3>
        
      </div>
      
      <Webcam ref={webcamRef} width={0} height={0} />

      <div className="container">
        <canvas ref={canvasRef} />
        <div className="subdivs">
          
          { createPitchAreas(num) }
          
        </div>       
      </div>
    </section>
  )
}

export default Hand