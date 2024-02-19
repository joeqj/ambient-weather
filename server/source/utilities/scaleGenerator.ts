/* 
Generates a scale of music

A Typescript re-write of the incredibly helpful post by Jake Albaugh.
https://codepen.io/jakealbaugh/pen/NrdEYL?editors=1010

I can't take too much credit!

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

type Mode = 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian' | 'major' | 'minor' | 'melodic' | 'harmonic';

interface dict {
	keys: string[];
	scales: {
		[key: string]: {
			name: string;
			steps: number[];
			triads: string[];
		};
	};
	triads: {
		[key: string]: number[];
	}
}

interface parameters {
	key: Key;
	mode: Mode;
}

interface Chord {
	type: string;
	interval: string;
	notes: {
		note: string;
		rel_octave: number;
	}[]
};

class scaleGenerator {
	private readonly dict: dict;
	private key: string = '';
	mode: string = '';
	notes: object[] = [];
	chord: Chord | null = null;

	constructor(params: parameters) {
		this.dict = this.loadDictionary();
		this.key = params.key;
		this.mode = params.mode;
		this.loadScale();
	}

	/* 
		Generates everything we need to know about each scale.
		@return {Object}
	*/
	private loadDictionary() {
		return {
			keys: 'C C# D D# E F F# G G# A A# B'.split(' '),
			scales: {
				ion: {
					name: 'Ionian',
					steps: this.generateSteps('W W H W W W H'),
          triads: this.generateTriads(0)
				},
				dor: {
					name: 'Dorian',
					steps: this.generateSteps('W H W W W H W'),
          triads: this.generateTriads(1)
				},
				phr: {
					name: 'Phrygian',
					steps: this.generateSteps('H W W W H W W'),
          triads: this.generateTriads(2),
				},
				lyd: {
					name: 'Lydian',
					steps: this.generateSteps('W W W H W W H'),
          triads: this.generateTriads(3)
				},
				mix: {
					name: 'Mixolydian',
					steps: this.generateSteps('W W H W W H W'),
          triads: this.generateTriads(4)
				},
				aeo: {
					name: 'Aeolian',
					steps: this.generateSteps('W H W W H W W'),
          triads: this.generateTriads(5)
				},
				loc: {
					name: 'Locrian',
					steps: this.generateSteps('H W W H W W W'),
          triads: this.generateTriads(6)
				},
				mel: {
					name: 'Melodic Minor',
					steps: this.generateSteps('W H W W W W H'),
          triads: 'min min aug maj maj dim dim'.split(' ')
				},
				har: {
					name: 'Harmonic Minor',
					steps: this.generateSteps('W H W W H WH H'),
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
 
	/* 
		Converts a string of Whole and Half string identifiers into an array of numerical steps.
	*/
	private generateSteps(stepString: string) {
		let arr = stepString.split(' ');
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

	/* 
		Generate ionian triads, each mode is offset by one.
	*/
  private generateTriads(offset: number) {
    let base = 'maj min min maj maj min dim'.split(' ');
    let triads = [];
    for (let i = 0; i < base.length; i++) {
      triads.push(base[(i + offset) % base.length]);
    }
    return triads;
  };

	private paramMode(mode: string) {
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

	private loadScale() {
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

      if (i === 0) {
				this.chord = this.generateChord(i, index, rel_octave, scale.triads[i]);
			}

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
  private generateChord(index: number, offset: number, octave: number, triads: string) {
    // get the steps for this chord type
    let steps = this.dict.triads[triads];
    // instantiate the chord
    let chord = { 
			type: triads, 
			interval: this.intervalFromType(index, triads), 
			notes: [] as { note: string, rel_octave: number }[],
		};

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

  private intervalFromType(step: number, type: string) {
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
