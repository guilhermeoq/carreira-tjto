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

  background-image: linear-gradient(
      180deg,
      rgba(var(--bs-body-bg-rgb), 0.01),
      rgba(var(--bs-body-bg-rgb), 1) 85%
    ),
    radial-gradient(ellipse at top left, rgba(var(--bs-primary-rgb), 0.5), transparent 50%),
    radial-gradient(ellipse at top right, rgba(var(--bd-accent-rgb), 0.5), transparent 50%),
    radial-gradient(ellipse at center right, rgba(var(--bd-violet-rgb), 0.5), transparent 50%),
    radial-gradient(ellipse at center left, rgba(var(--bd-pink-rgb), 0.5), transparent 50%);
}
</style>
