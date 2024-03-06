/* 
Generates a scale of music

All credit goes to Jake Albaugh
https://codepen.io/jakealbaugh/pen/NrdEYL?editors=1010

@param key {String} 
  the root of the key - flats not allowed
@param mode {String}
  desired mode

@return {Object}
  key: the scale key
  mode: the scale mode id
  notes: an array of notes
  step: index of note in key
  note: the actual note
  rel_octave: 0 || 1, in root octave or next
*/

type Key = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

type Mode =
	| 'ionian'
	| 'dorian'
	| 'phrygian'
	| 'lydian'
	| 'mixolydian'
	| 'aeolian'
	| 'locrian'
	| 'major'
	| 'minor'
	| 'melodic'
	| 'harmonic';

interface dict {
	keys: string[];
	scales: {
		[key: string]: {
			name: string;
			steps: number[];
		};
	};
}

interface parameters {
	key: Key;
	mode: Mode;
}

class scaleGenerator {
	readonly dict: dict;
	key: string = '';
	mode: string = '';
	notes: object[] = [];
  	chord: string[] = [];

	constructor(params: parameters) {
		this.dict = this.loadDictionary();
		this.key = params.key;
		this.mode = params.mode;
		this.loadScale();
	}

	loadDictionary() {
		return {
			keys: 'C C# D D# E F F# G G# A A# B'.split(' '),
			scales: {
				ion: {
					name: 'Ionian',
					steps: this.genSteps('W W H W W W H'),
          triads: this.genTriads(0)
				},
				dor: {
					name: 'Dorian',
					steps: this.genSteps('W H W W W H W'),
          triads: this.genTriads(1)
				},
				phr: {
					name: 'Phrygian',
					steps: this.genSteps('H W W W H W W'),
          triads: this.genTriads(2),
				},
				lyd: {
					name: 'Lydian',
					steps: this.genSteps('W W W H W W H'),
          triads: this.genTriads(3)
				},
				mix: {
					name: 'Mixolydian',
					steps: this.genSteps('W W H W W H W'),
          triads: this.genTriads(4)
				},
				aeo: {
					name: 'Aeolian',
					steps: this.genSteps('W H W W H W W'),
          triads: this.genTriads(5)
				},
				loc: {
					name: 'Locrian',
					steps: this.genSteps('H W W H W W W'),
          triads: this.genTriads(6)
				},
				mel: {
					name: 'Melodic Minor',
					steps: this.genSteps('W H W W W W H'),
          triads: 'min min aug maj maj dim dim'.split(' ')
				},
				har: {
					name: 'Harmonic Minor',
					steps: this.genSteps('W H W W H WH H'),
          triads: 'min dim aug min maj maj dim'.split(' ')
				}
			},
      triads: {
        maj: [0,4,7],
        min: [0,3,7],
        dim: [0,3,6],
        aug: [0,4,8]
      }
		};
	}
 
	genSteps(steps_str: string) {
		let arr = steps_str.split(' ');
		let steps = [0];
		let step = 0;
		for (let i = 0; i < arr.length - 1; i++) {
			let increment = 0;
			switch (arr[i]) {
				case 'W':
					increment = 2;
					break;
				case 'H':
					increment = 1;
					break;
				case 'WH':
					increment = 3;
					break;
			}
			step += increment;
			steps.push(step);
		}
		return steps;
	}

  genTriads(offset: number) {
    // this is ionian, each mode bumps up one offset.
    let base = 'maj min min maj maj min dim'.split(' ');
    let triads = [];
    for(let i = 0; i < base.length; i++) {
      triads.push(base[(i + offset) % base.length]);
    }
    return triads;
  };

	paramMode(mode: string) {
		return {
			minor: 'aeo',
			major: 'ion',
			ionian: 'ion',
			dorian: 'dor',
			phrygian: 'phr',
			lydian: 'lyd',
			mixolydian: 'mix',
			aeolian: 'aeo',
			locrian: 'loc',
			melodic: 'mel',
			harmonic: 'har'
		}[mode];
	}

	loadScale() {
		// Get scale info by mode
		const id: string = this.paramMode(this.mode)!;
		const scale = this.dict.scales[id];

		// Get notes to cycle through
		const keys = this.dict.keys;

		// Starting index for key loop
		const offset = keys.indexOf(this.key);
		for (let i = 0; i < scale.steps.length; i++) {
			const step = scale.steps[i];
			const index = (offset + step) % keys.length;
			// Relative octave. 0 = same as root, 1 = next ocave up
			const rel_octave = offset + step > keys.length - 1 ? 1 : 0;

      if (i === 0) this.chord = this.generateChord(i, index, rel_octave, scale.triads[i]);

			// Create the note object
			const note: object = {
				step: i,
				note: keys[index],
				rel_octave: rel_octave,
			};

			// Add the note
			this.notes.push(note);
		}
	}

  // create a chord of notes based on chord type
  generateChord(s, offset, octave, t) {
    // get the steps for this chord type
    let steps = this.dict.triads[t];
    // instantiate the chord
    let chord = { type: t, interval: this.intervalFromType(s, t), notes: [] };
    // load the notes
    let keys = this.dict.keys;
    for(let i = 0; i < steps.length; i++) {
      let step = steps[i];
      let idx = (offset + step) % keys.length;
      // relative octave to base
      let rel_octave = (offset + step) > keys.length - 1 ? octave + 1 : octave;
      // define the note
      chord.notes.push({ note: keys[idx], rel_octave: rel_octave });
    }
    return chord;
  }

  intervalFromType(step, type) {
    let steps = 'i ii iii iv v vi vii'.split(' ');
    let s = steps[step];
    switch(type) {
      case 'maj':
        s = s.toUpperCase(); break;
      case 'min':
        s = s; break;
      case 'aug':
        s = s.toUpperCase() + '+'; break;
      case 'dim':
        s = s + '°'; break;
    }
    return s;
  }
}

export { scaleGenerator };
