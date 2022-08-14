<script lang="ts">
	import Background from "../components/ui/background.svelte";
	import Audio from "../components/tone/audio.svelte";

	import clockStore from '../util/ui/clock';

	export let data: JSON;
	
	// create the clock store, and tell it to refresh every 300ms
	const clock = clockStore({interval: 300})
</script>

<section class="w-full h-screen grid place-content-center text-center space-y-6">
	<h1 class="text-4xl font-bold text-white">{ data.WeatherText }</h1>
	<p class="text-white text-2xl">{ data.Temperature.Metric.Value }&#8451;</p>

	<p class="text-white text-lg">{$clock}</p>
</section>

<Audio data={data} />

<Background />