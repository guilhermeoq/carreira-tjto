<template>
  <div class="container-sm">
    <h1 class="title">
      Simulador da Carreira
      <span class="gradient-text">PCCR</span> dos Servidores do TJTO
    </h1>

    <div class="d-block d-md-flex gap-3">
      <p class="subtitle">
        Simule a <strong>evolução na carreira e salário do TJTO</strong>. Visualize progressões e
        detalhes da folha de pagamento neste simulador gratuito desenvolvido para facilitar seu
        planejamento financeiro.
      </p>
    </div>

    <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
      <router-link to="/app" class="btn btn-primary btn-lg px-4 gap-3"> Simular </router-link>
      <Share />
    </div>
    <div>
      <main>
        <Features />
      </main>
    </div>
    <div>
      <main>
        <Changelog />
      </main>
    </div>
    <div>
      <main>
        <FAQ />
      </main>
    </div>
  </div>
</template>

<script>
import FAQ from '../components/FAQ.vue'
import Features from '../components/Features.vue'
import Share from '../components/Share.vue'
import Changelog from '../components/Changelog.vue'

export default {
  components: {
    FAQ, // <--- This line is mandatory in the Options API
    Features,
    Share,
    Changelog,
  },
}
</script>
