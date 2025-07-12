<template>
  <button
    class="btn"
    @click="toggleTheme"
    :title="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
  >
    <i :class="iconClass"></i>
  </button>
</template>

<script>
export default {
  name: "ThemeToggle",
  data() {
    return {
      isDark: false,
    };
  },
  computed: {
    iconClass() {
      return this.isDark ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
    },
  },
  mounted() {
    // Initial theme based on system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      this.isDark = savedTheme === 'dark';
    } else {
      this.isDark = systemPrefersDark;
    }

    this.applyTheme();

    // React to system changes only if user hasn't chosen manually
    if (!savedTheme) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.isDark = e.matches;
        this.applyTheme();
      });
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      this.applyTheme();
    },
    applyTheme() {
      document.body.setAttribute('data-bs-theme', this.isDark ? 'dark' : 'light');
    },
  },
};
</script>

<style scoped>
button {
  width: 45px;
  background-color: var(--bs-secondary-bg);
  height: 45px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover {
  background-color: var(--bs-secondary-bg);
  color: var(--bs-secondary-text);
}
</style>
