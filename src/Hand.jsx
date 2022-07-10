import React, { useRef, useState } from 'react'

import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'
import { HandDetector } from '@tensorflow-models/handpose/dist/hand'
import { rand } from '@tensorflow/tfjs'

import './hand.css'
import { scale, lerp, fixDPI, numberOfDivs } from './utilities'
import audio from './Audio'
import Dropdown from './Dropdown'
import DropdownMenu from './DropdownMenu'



const Hand = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [num, setNum] = useState(1);

  const coordinates = [];

  let net = null;

  const runHandpose = async () => {
    if (num === 1) {
      net = await handpose.load();
      console.log("Hand recognition model loaded");
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

        // console.clear();

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
        // console.log(p);
        const landmarks = p.landmarks;
        
        for (let i = 0; i < landmarks.length; ++i) {
          // TODO: Find out why the canvas is twice as high as it should be
          const targetX = canvasRef.current.width - scale(landmarks[i][0], [0, videoWidth], [0, canvasRef.current.width]);
          const targetY = scale(landmarks[i][1], [0, videoHeight], [0, canvasRef.current.height]);
          
          coordinates[i].x = lerp(coordinates[i].x, targetX, 0.08);
          coordinates[i].y = lerp(coordinates[i].y, targetY, 0.08);

          const targetSize = scale(Math.abs(landmarks[i][2]), [0, 80], [2, 32]);
          coordinates[i].size = lerp(coordinates[i].size, targetSize, 0.01);

          ctx.fillRect(coordinates[i].x,  coordinates[i].y, coordinates[i].size, coordinates[i].size);

          // Update corresponding oscillator pitch
          // TODO: Move into own function!
          updatePitch(i);
          // const targetPitch = 880 - scale(coordinates[i].y, [0, canvasRef.current.height], [220, 880]);
          // audio.updatePitch(audio.oscillators[i], targetPitch);
        }
      });
    }

    else {
      console.log(`canvas width: ${canvasRef.current.width}`);
      console.log(`canvas height: ${canvasRef.current.height}`);

      for (let i = 0; i < 21; ++i) {
        coordinates[i].angle += Math.PI * 0.005;

        const targetX = (canvasRef.current.width / 2) - Math.sin(coordinates[i].angle) * 300;
        const targetY = (canvasRef.current.height / 2) - Math.cos(coordinates[i].angle) * 300;

        coordinates[i].x = lerp(coordinates[i].x, targetX, 0.08);
        coordinates[i].y = lerp(coordinates[i].y, targetY, 0.08);

        ctx.fillRect(coordinates[i].x, coordinates[i].y, coordinates[i].size, coordinates[i].size);

        // Update corresponding oscillator pitch
        updatePitch(i);
        // const targetPitch = 880 - scale(coordinates[i].y, [0, canvasRef.current.height], [220, 880]);
        // audio.updatePitch(audio.oscillators[i], targetPitch);

        
      }
    }
  }

  const updatePitch = (iterator) => {
    const targetPitch = 880 - scale(coordinates[iterator].y, [0, canvasRef.current.height], [220, 880]);
        audio.updatePitch(audio.oscillators[iterator], targetPitch);
  }

  runHandpose();

  const createSubDivs = (n) => {
    let subDivs = [];

    for (let i = 0; i < n; ++i) {
      subDivs.push(
        <div className="subdiv">
          {/* <Dropdown>
            <DropdownMenu/>
          </Dropdown>  */}

          <DropdownMenu/>
        </div>
      );
    }

    return subDivs;
  }

  return (
    <section id="hand">
      <div className="header">
        <h3>Hand</h3>
        <div className="set-subs">
          <div className="btn btn-hand" onClick={() => {setNum(num + 1)}}>+</div>
          <div className="btn btn-hand" onClick={() => {setNum(num - 1)}}>-</div>
        </div>
      </div>
      
      <Webcam ref={webcamRef} width={0} height={0} />
      <div className="container">
        <canvas ref={canvasRef} />
        <div className="subdivs">
          {/* {[1, 2].map((n) => {
            return (
              <div className="subdiv">
            <Dropdown>
              <DropdownMenu/>
            </Dropdown>
            
          </div>
            )
          })} */}

          { createSubDivs(num) }
          
        </div>
        
      </div>
      

      
    </section>
  )
}

export default Hand