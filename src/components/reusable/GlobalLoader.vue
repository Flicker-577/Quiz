<template>
  <div class="loader-container">
    <div class="loader">
      <img src="/logo-small.jpg" alt="Logo" class="logo-img">
    </div>
  </div>
</template>

<style scoped>
/* 1. CONTAINER: Ensures it stays perfectly centered */
.loader-container {
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: #fdfdfd; /* Optional light background */
}

/* 2. THE LOADER WRAPPER */
.loader {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    /* We remove the background color here so the ripples show clearly */
}

/* 3. THE WAVES (SHADOW EFFECT) */
/* We use ::before and ::after to create two waves */
.loader::before,
.loader::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid #4caf50; /* The color of the wave line */
    opacity: 0;
    z-index: 0; 
    /* This creates the expanding wave animation */
    animation: wave-heartbeat 2.5s linear infinite;
}

/* We delay the second wave to create a continuous ripple */
.loader::after {
    animation-delay: 1.25s;
}

/* 4. THE IMAGE */
.logo-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px double #4caf50;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    position: relative;
    z-index: 10;
    background: white;
    /* Adds the "thump" effect to the image itself */
    animation: image-pulse 2.5s ease-out infinite;
}

/* --- ANIMATIONS --- */

/* Expands the ring and fades it out */
@keyframes wave-heartbeat {
    0% {
        transform: scale(1);
        opacity: 0.8;
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); /* Starts dark/solid */
    }
    70% {
        opacity: 0.2;
    }
    100% {
        transform: scale(2.2); /* Expands to 2.2x size */
        opacity: 0;
        box-shadow: 0 0 20px 20px rgba(76, 175, 80, 0); /* Shadow spreads and disappears */
    }
}

/* Makes the logo image 'beat' slightly in sync */
@keyframes image-pulse {
    0% { transform: scale(1); }
    15% { transform: scale(1.05); box-shadow: 0 0 20px rgba(76, 175, 80, 0.5); }
    30% { transform: scale(1); }
    100% { transform: scale(1); }
}
</style>