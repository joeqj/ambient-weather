<div />

<style>
    div {
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;

        background-image: linear-gradient(
        45deg,
        hsl(240deg 98% 24%) 0%,
        hsl(255deg 59% 17%) 42%,
        hsl(261deg 44% 11%) 61%,
        hsl(0deg 0% 0%) 100%
        );

        background-size: 200% 200%;
        animation: gradient 15s ease infinite;
    }

    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
</style>