<script lang="ts">
	import { onMount, tick } from 'svelte';
	import * as Tone from 'tone';
	import type { Frequency } from 'tone/build/esm/core/type/Units';
	import type { Noise } from 'tone';
  import { fade } from 'svelte/transition';

	// Variables
	export let data: String;
	let button: HTMLElement;
	let started: Boolean = false;

	let keys: Array<Frequency | Array<Frequency>> = [];

	// Test sequence
	keys = ['D3', 'A#3', 'A3', 'F3', null, 'G3', null];

	// const precipitation = data.PrecipitationSummary.Precipitation.Metric.Value;
	const precipitation: number = 0.1;

	const windSpeed: number = data.Wind.Speed.Imperial.Value || 0;

	const pad = () => {
		const freeverb = new Tone.Freeverb({
			dampening: 10,
			roomSize: 1
		}).toDestination();

		const synth = new Tone.PolySynth().connect(freeverb);
		synth.set({ detune: -500 });
		synth.triggerAttackRelease(['F4', 'G4', 'C4'], Infinity);
	};

	const wind = () => {
		const noise: Noise = new Tone.Noise('white').start();
		noise.volume.value = -10;
		// make an autofilter to shape the noise
		const autoFilter = new Tone.AutoFilter({
			frequency: 0.05,
			baseFrequency: windSpeed * 10,
			octaves: 2
		}).toDestination();
		// connect the noise
		noise.connect(autoFilter);
		// start the autofilter LFO
		autoFilter.start();
	};

	const fieldRecording = () => {
		const reverb = new Tone.JCReverb(0.1).toDestination();
		const delay = new Tone.FeedbackDelay(0.6, 0.5);

		const player = new Tone.Player('/samples/summer/park.mp3', () => {
			player.start();
		}).chain(delay, reverb);

		player.volume.value = 12;
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
				type: 'fmtriangle2'
			},
			envelope: {
				attack: 10,
				decay: 2,
				sustain: 1,
				release: 8
			},
			volume: -15
		}).chain(delay, reverb, autoFilter);

		const sequence = new Tone.Sequence((time, note: Frequency) => {
			melody.triggerAttackRelease(note, 2.5, time * 18);
		}, keys);

		sequence.start(0);
		sequence.humanize = false;
	};

	// ToneJS Audio
	const init = async () => {
		pad();
		wind();
		fieldRecording();
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