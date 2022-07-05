import React, { useRef } from 'react'
import './hand.css'
import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'
import { HandDetector } from '@tensorflow-models/handpose/dist/hand'



const Hand = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Hand recognition model loaded");
  
    // Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 100);
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
        canvasRef.current.height = videoHeight;

        // Make detections
        const hand = await net.estimateHands(video);

        // Draw to canvas
        drawHand(hand);
      }
  }

  const drawHand = async (predictions) => {
    const ctx = canvasRef.current.getContext("2d");

    if (predictions.length > 0) {
      predictions.forEach((p) => {
        const landmarks = p.landmarks;
        
        for (let i = 0; i < landmarks.length; ++i) {
          const x = canvasRef.current.width - landmarks[i][0];
          const y = landmarks[i][1];

          ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-2');

          ctx.fillRect(x, y, 2, 2);

          // ctx.beginPath();
          // ctx.arc(x, y, 1, 0, 3 * Math.PI);
          // ctx.fill();
        }
      });
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