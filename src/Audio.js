import * as Tone from 'tone'
import { TickSignal } from 'tone/build/esm/core/clock/TickSignal';
import { lerp } from './utilities'

class Audio {
    constructor() {
        this.recorder = new Tone.Recorder();

        this.players = [];

        this.oscillators = [];
        this.distortions = [];

        for (let i = 0; i < 21; ++i) {
            const osc = new Tone.Oscillator(Math.random() * 880, 'square').connect(this.recorder).toDestination();
            osc.volume.value = -30;
            this.oscillators.push(osc);
          }

        this.octaveSpread = {
            min: 3, 
            max: 6
        };
    }

    start() {
        this.oscillators.forEach(o => o.start());
    }

    stop() {
        this.oscillators.forEach(o => o.stop());
    }

    startRecording() {
        this.recorder.start();
    }

    async stopRecording(i) {
        const recording = await this.recorder.stop();

        this.players[i] = new Tone.Player({
            url: URL.createObjectURL(recording),
            loop: true,
            autostart: false,
            fadeIn: 0.5,
            fadeOut: 0.5,
            // reverse: true,
        }).toDestination();

        console.log(`from audio.stopRecording(): ${this.players}`);

        return this.players;
    }

    setOctaveSpread(spread) {
        this.octaveSpread = {
            min: spread.min,
            max: spread.max,
        }
    }

    updatePitch(osc, targetPitch) {
        // TODO: Find audio appropriate interpolation function
        osc.frequency.value = lerp(osc.frequency.value, targetPitch, 0.1);
    }
}

const audio = new Audio();

export default audio;

