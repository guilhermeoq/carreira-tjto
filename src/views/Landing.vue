<template>
  <div class="container my-5">
    <div class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
      <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">
        <h1 class="display-5 fw-bold text-body-emphasis lh-1 mb-3">
          Simulador da Carreira
          <span class="gradient-text">PCCR</span> dos Servidores do TJTO
        </h1>
        <p class="subtitle">
          Simule a <strong>evolução na carreira e salário do TJTO</strong>. Visualize progressões e
          detalhes da folha de pagamento neste simulador desenvolvido para facilitar seu
          planejamento financeiro.
        </p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
          <router-link to="/app" class="btn btn-primary btn-lg px-4 gap-3"
            ><i class="bi bi-calculator-fill me-2"></i> Simular
          </router-link>
          <Share />
        </div>
      </div>
      <div class="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
        <img class="rounded-lg-3" src="/hero-image.webp" alt="" width="720" />
      </div>
    </div>
  </div>

  <div class="d-grid gap-2 d-sm-flex justify-content-sm-center"></div>
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
