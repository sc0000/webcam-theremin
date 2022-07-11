import * as Tone from 'tone'
import { lerp } from './utilities'

class Audio {
    constructor() {
        this.oscillators = [];
        this.distortions = [];
        for (let i = 0; i < 21; ++i) {
            const osc = new Tone.Oscillator(Math.random() * 880, 'square').toDestination();
            osc.volume.value = -48;
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

