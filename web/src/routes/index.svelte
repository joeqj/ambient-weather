<script lang="ts">
	import Audio from "../components/tone/audio.svelte";

	export let data: JSON;
	
</script>

<section class="w-full h-screen grid place-content-center">
	<h1 class="text-4xl font-bold">Ambient Weather</h1>
</section>

<Audio data={data} />