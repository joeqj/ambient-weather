<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import * as Tone from 'tone';
	import type { Frequency } from 'tone/build/esm/core/type/Units';
	import type { Noise } from 'tone';

	import { scaleGenerator } from '../../util/audio/scales';
	import { getMultipleRandom, shuffleArray } from '../../util/helpers/array';

	// Variables
	export let data: String;
	let button: HTMLElement;
	let started: Boolean = false;

	let keys: Array<Frequency | Array<Frequency>> = [];
	let padKeys: Array<Frequency> = [];

	/* 
		For testing purposes only
	*/
	const leadSpeed: Number = 18;

	const scale = new scaleGenerator({ key: 'E', mode: 'phrygian' });	
	
	const leadNotes = getMultipleRandom(scale.notes, 5);

	padKeys = scale.chord.notes.map(x => x.note + (x.rel_octave + 4));	
	keys = shuffleArray(leadNotes.map(x => x.note + (x.rel_octave + 3)));
	

	// const precipitation = data.PrecipitationSummary.Precipitation.Metric.Value;
	const precipitation: number = 0.1;

	// const windSpeed: number = data.Wind.Speed.Imperial.Value || 0;
	const windSpeed: number = 19;

	const pad = () => {
		const freeverb = new Tone.Freeverb({
			dampening: 10,
			roomSize: 1
		}).toDestination();

		const synth = new Tone.PolySynth().connect(freeverb);
		synth.set({ detune: -500 });
		synth.triggerAttackRelease(padKeys, Infinity);
	};

	const wind = () => {
		const noise: Noise = new Tone.Noise('white').start();
		noise.volume.value = -10;
		// make an autofilter to shape the noise
		const autoFilter = new Tone.AutoFilter({
			frequency: 0.05,
			baseFrequency: windSpeed * 10,
			octaves: 2
		});

		const autoPanner = new Tone.AutoPanner(0.1).start().toDestination();
		autoPanner.depth.value = 0.75;

		// connect the noise
		noise.chain(autoFilter, autoPanner);
		// start the autofilter LFO
		autoFilter.start();
	};

	const fieldRecording = () => {
		const reverb = new Tone.JCReverb(0.1).toDestination();
		const delay = new Tone.FeedbackDelay(0.6, 0.5);

		const player = new Tone.Player('/samples/summer/park.mp3', () => {
			player.start();
		}).chain(delay, reverb);

		player.volume.value = 6;
		player.fadeIn = 4;

		player.onstop = () => {
			setTimeout(() => {
				player.start();
			}, 4000);
		};
	};

	const lead = () => {
		const autoFilter = new Tone.AutoFilter('0n').toDestination().start();
		const reverb = new Tone.JCReverb(0.1);
		const delay = new Tone.FeedbackDelay(0.6, 0.93);

		const melody = new Tone.Synth({
			oscillator: {
				type: 'fmtriangle2' // fmtriangle2
			},

			envelope: {
				attack: 10,
				decay: 2,
				sustain: 1,
				release: 8
			},
			volume: -25
		}).chain(delay, reverb, autoFilter);

		const sequence = new Tone.Sequence((time, note: Frequency) => {
			melody.triggerAttackRelease(note, 2.5, time * leadSpeed);
		}, keys);

		sequence.start(0);
		sequence.humanize = false;
	};

	// ToneJS Audio
	const init = async () => {
		wind();
		// fieldRecording();
		pad();
		lead();

		Tone.Transport.start();
	};

	onMount(() => {
		button.addEventListener('click', async () => {
			await Tone.start();
			init();
			started = true;
		});
	});
</script>

{#if !started}
  <div transition:fade class="fixed inset-0 bg-black bg-opacity-50 grid place-content-center">
    <button
      class="bg-slate-800 px-8 py-4 border border-slate-500 rounded-sm text-white text-xl"
      bind:this={button}
    >
      Enable Audio
    </button>
  </div>
{/if}