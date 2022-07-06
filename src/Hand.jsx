import React, { useRef } from 'react'

import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'
import { HandDetector } from '@tensorflow-models/handpose/dist/hand'

import './hand.css'
import { scale, lerp, fixDPI } from './utilities'
import { rand } from '@tensorflow/tfjs'


const Hand = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const coordinates = [];

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Hand recognition model loaded");
  
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

        // Set size of canvas ???
        canvasRef.current.width = videoWidth;
        // canvasRef.current.height = videoHeight;
        canvasRef.current.height = window.innerHeight - 20;
        fixDPI(canvasRef.current);

      
        // Make detections
        const hand = await net.estimateHands(video);

        if (coordinates.length === 0) {
          for (let i = 0; i < 21; ++i) {
            const c = {
              x: 500,
              y: 500,
              size: 8,
            }
        
            coordinates.push(c);
          }
        }

        // console.clear();

        // Draw to canvas
        drawHand(hand, videoWidth, videoHeight);
        
        // console.log(`canvas width: ${canvasRef.current.width}`);
        // console.log(`canvas height: ${canvasRef.current.height}`);

        // console.log(coordinates[0].x);
        // console.log(coordinates[0].y);
        
      }
  }

  const drawHand = async (predictions, videoWidth, videoHeight) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-2');

    

    if (predictions.length > 0) {
      predictions.forEach((p) => {
        // console.log(p);
        const landmarks = p.landmarks;
        
        for (let i = 0; i < landmarks.length; ++i) {
          const targetX = canvasRef.current.width - scale(landmarks[i][0], [0, videoWidth], [0, canvasRef.current.width]);
          const targetY = scale(landmarks[i][1], [0, videoHeight * 1.2], [0, canvasRef.current.height]);
          
          coordinates[i].x = lerp(coordinates[i].x, targetX, 0.1);
          coordinates[i].y = lerp(coordinates[i].y, targetY, 0.1);

          const targetSize = scale(Math.abs(landmarks[i][2]), [0, 80], [2, 32]);
          coordinates[i].size = lerp(coordinates[i].size, targetSize, 0.01);

          ctx.fillRect(coordinates[i].x,  coordinates[i].y, coordinates[i].size, coordinates[i].size);
          console.log(landmarks[i][2]);
        }
      });
    }

    else {
      console.log('no hand');

      for (let i = 0; i < 21; ++i) {
        // const x = canvasRef.current.width - scale(landmarks[i][0], [0, videoWidth], [0, canvasRef.current.width]);
        // const y = scale(landmarks[i][1], [0, videoHeight * 1.2], [0, canvasRef.current.height]);
        
        // const x = lerp(coordinates[i].x, 10, 0.01);
        coordinates[i].y = lerp(coordinates[i].y, 750, 0.001);

        ctx.fillRect(coordinates[i].x, coordinates[i].y, coordinates[i].size, coordinates[i].size);
      }
    }
  }

  runHandpose();

  return (
    <section id="hand">
      <h3>Hand</h3>
        <Webcam ref={webcamRef} width={0} height={0} />
        <canvas ref={canvasRef} />

    </section>
  )
}

export default Hand