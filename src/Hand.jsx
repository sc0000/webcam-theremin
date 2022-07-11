import React, { useRef, useState, useEffect } from 'react'

import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'
import { HandDetector } from '@tensorflow-models/handpose/dist/hand'
import { rand } from '@tensorflow/tfjs'

import './hand.css'
import { scale, lerp, fixDPI, numberOfDivs, randomInt, pitches, heightVals } from './utilities'
import audio from './Audio'
// import Dropdown from './Dropdown'
import Subdivision from './Subdivision'



const Hand = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [num, setNum] = useState(0);

  useEffect(() => {
    heightVals.splice(0, heightVals.length);
    document.querySelectorAll('.subdiv').forEach((s) => {
      heightVals.push(s.getBoundingClientRect().y);
    });

    console.clear();
    console.log(heightVals);
    
  }, [num]);

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
    }, 50);
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
              x: 0,
              y: 0,
              size: 8,
              angle: 2 * Math.PI * Math.random(), 
            }
        
            coordinates.push(c);
          }
        }

        console.clear();
        console.log(pitches);

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
                frequency: `${pitches[j]}${randomInt(audio.octaveSpread.min, audio.octaveSpread.max)}`,
                });
            }
          }

          audio.oscillators[i].volume.value = scale(coordinates[i].x, [0, canvasRef.current.width], [-64, -48]);
        }
      });
    }

    else {
      for (let i = 0; i < 21; ++i) {
        coordinates[i].angle += Math.PI * 0.005;

        const targetX = (canvasRef.current.width / 2) - Math.sin(coordinates[i].angle) * 300;
        const targetY = (canvasRef.current.height / 2) - Math.cos(coordinates[i].angle) * 300;

        coordinates[i].x = lerp(coordinates[i].x, targetX, 0.08);
        coordinates[i].y = lerp(coordinates[i].y, targetY, 0.08);

        ctx.fillRect(coordinates[i].x, coordinates[i].y, coordinates[i].size, coordinates[i].size);

        // Update corresponding oscillator pitch
        updatePitch(i);

        // TODO: Add to function
        audio.oscillators[i].volume.value = scale(coordinates[i].x, [0, canvasRef.current.width], [-64, -48]);
      }
    }
  }

  // TODO: Move into Audio.js
  const updatePitch = (iterator) => {
    const targetPitch = 880 - scale(coordinates[iterator].y, [0, canvasRef.current.height], [220, 880]);
        audio.updatePitch(audio.oscillators[iterator], targetPitch);
  }

  runHandpose();


  const [pitch, setPitch] = useState('C');

  const createSubdivs = (n) => {
    let subdivs = [];

    for (let i = 0; i < n; ++i) {
      const sendPitch = (p) => {
          setPitch(p);
          pitches[i] = p;
      } 

      subdivs.push(
        <Subdivision sendPitch={sendPitch}/>
      );
    }

    return subdivs;
  }



  return (
    <section id="hand">
      <div className="header">
        <h3>Hand</h3>
        <div className="set-subs">
          <div className="btn btn-hand" onClick={() => {
            setNum(num + 1)}}>+</div>
          <div className="btn btn-hand" onClick={() => {setNum(num - 1)}}>-</div>
        </div>
      </div>
      
      <Webcam ref={webcamRef} width={0} height={0} />

      <div className="container">
        <canvas ref={canvasRef} />
        <div className="subdivs">
          
          { createSubdivs(num) }
          
        </div>        
      </div>
    </section>
  )
}

export default Hand