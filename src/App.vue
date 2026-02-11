<template>
  <div class="back" style="background-attachment: fixed">
    <nav class="navbar navbar-expand-lg navbar-collapse">
      <div class="container-fluid">
        <div class="navbar-brand">
          <router-link to="/" class="text-decoration-none">
            <img src="/android-chrome-192x192.png" width="25" height="25" alt="" />
            <strong>carreiratjto.com</strong>
          </router-link>
        </div>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/">Página inicial</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://www.al.to.leg.br/arquivos/lei_2409-2010_63738.PDF"
                >Lei n.º 2.409</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://sapl.al.to.leg.br/materia/11972/documentoacessorio"
                >Data-base 2025</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div id="app" class="container-lg">
      <div class="mt-1 d-flex justify-content-end">
        <ThemeToggle />
      </div>
    </div>
    <router-view></router-view>

    <div class="container mt-5">
      <div class="badge container d-flex justify-content-center align-items-center gap-3 mt-3">
        <a href="https://vuejs.org">
          <img
            src="https://img.shields.io/badge/Built%20with%20Vue-grey?style=for-the-badge&logo=vuedotjs&&color=35495e"
            alt="Built with Vue.js"
          />
        </a>
        <a href="https://vercel.com">
          <img
            src="https://img.shields.io/badge/Powered%20by%20Vercel-grey?style=for-the-badge&logo=vercel&color=292929"
            alt="Powered by Vercel"
          />
        </a>
      </div>
      <p class="footer">
        Desenvolvido por
        <a href="https://linktr.ee/guilhermeoq" class="link"
          >Guilherme Quintino <i class="bi bi-box-arrow-up-right"></i></a
        >. Simulação baseada em dados públicos. Os resultados são estimativas e não substituem o
        contracheque oficial. Contato:
        <a class="link" href="mailto:contato@carreiratjto.com">contato@carreiratjto.com</a>.
      </p>
      <p class="copyright">© 2026 carreiratjto.com. Todos os direitos reservados.</p>
    </div>

    <div class="container d-flex justify-content-center align-items-center"></div>
  </div>
</template>

<script>
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
inject()
injectSpeedInsights()
import ThemeToggle from './components/ThemeToggle.vue'
import Landing from './views/Landing.vue'
export default {
  name: 'App',
  components: {
    ThemeToggle,
    Landing,
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
