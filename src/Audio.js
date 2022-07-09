import * as Tone from 'tone'
import { lerp } from './utilities'

class Audio {
    constructor() {
        this.oscillators = [];
        for (let i = 0; i < 21; ++i) {
            const osc = new Tone.Oscillator(Math.random() * 880, 'sine').toDestination();
            osc.volume.value = -36;
            this.oscillators.push(osc);
          }
    }

    start() {
        this.oscillators.forEach(o => o.start());
    }

    stop() {
        this.oscillators.forEach(o => o.stop());
    }

    updatePitch(osc, targetPitch) {
        // TODO: Find audio appropriate interpolation function
        osc.frequency.value = lerp(osc.frequency.value, targetPitch, 0.1);
    }
}

const audio = new Audio();

export default audio;

