<template>
  <div class="back" style="background-attachment: fixed;">
    <Calculadora />
  </div>
</template>

<script>
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights';
inject()
injectSpeedInsights();
import Calculadora from './components/Calculadora.vue'

export default {
  components: {
    Calculadora,
  },
}
</script>

<style>
.back {
  --bd-pink-rgb: 214, 51, 132;
  padding-right: 0px;
  padding-bottom: 3rem;

  background-image: linear-gradient(223.17deg, rgb(28, 24, 41) 0%, rgb(27, 24, 40) 8.61%, rgb(25, 23, 36) 17.21%, rgb(22, 21, 32) 25.82%, rgb(20, 19, 28) 34.42%, rgb(18, 18, 24) 43.03%, rgb(17, 17, 23) 51.63%);
}
</style>
