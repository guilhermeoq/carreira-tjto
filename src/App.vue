<template>
  <div class="back" style="background-attachment: fixed">
    <Calculadora />
  </div>
</template>

<script>
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
inject()
injectSpeedInsights()
import Calculadora from './components/Calculadora.vue'

export default {
  components: {
    Calculadora,
  },
}
</script>

<style>
/* === DARK THEME === */
body[data-bs-theme='dark'] {
  .back {
    --bd-pink-rgb: 214, 51, 132;
    padding-right: 0px;
    padding-bottom: 3rem;

    background-image: linear-gradient(
      223.17deg,
      rgb(28, 24, 41) 0%,
      rgb(27, 24, 40) 8.61%,
      rgb(25, 23, 36) 17.21%,
      rgb(22, 21, 32) 25.82%,
      rgb(20, 19, 28) 34.42%,
      rgb(18, 18, 24) 43.03%,
      rgb(17, 17, 23) 51.63%
    );
  }
}

/* === LIGHT THEME === */
body[data-bs-theme='light'] {
  .back {
    padding-right: 0px;
    padding-bottom: 3rem;

    background: #c9d6ff; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #e2e2e2,
      #c9d6ff
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #e2e2e2,
      #c9d6ff
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
}
</style>
