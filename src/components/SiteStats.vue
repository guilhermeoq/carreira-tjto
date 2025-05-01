<template>
  <div class="site-stats py-2 px-3 d-flex justify-content-center align-items-center gap-5">
    <div class="stat" :class="{ 'fade-in': visible }">
      <div class="label">visitantes</div>
      <div class="value">{{ animatedVisitors }}</div>
    </div>
    <div class="stat" :class="{ 'fade-in': visible }">
      <div class="label">visualizações</div>
      <div class="value">{{ animatedViews }}</div>
    </div>
  </div>
  <div class="site-stats d-flex justify-content-center align-items-center">
    <div class="label" :class="{ 'fade-in': visible }">nos últimos 30 dias 🎉</div>
  </div>
</template>

<script>
export default {
  name: 'SiteStats',
  data() {
    return {
      animatedVisitors: 0,
      animatedViews: 0,
      visible: false,
    }
  },
  mounted() {
    this.visible = true;
    this.animateNumber('animatedVisitors', 656);
    this.animateNumber('animatedViews', 948);
  },
  methods: {
    animateNumber(key, target, duration = 1000) {
      const step = 16;
      const steps = duration / step;
      const increment = target / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        this[key] = Math.floor(current);
        if (current >= target) {
          this[key] = target;
          clearInterval(interval);
        }
      }, step);
    }
  }
}
</script>

<style scoped>
.site-stats {
  font-size: 1rem;
  font-weight: 500;
}
.value {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: #333;
  line-height: 1;
}
.label {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.1;
}
.dot {
  font-size: 1.5rem;
  line-height: 0;
  color: #999;
}
.fade-in {
  animation: fadeInUp 0.8s ease-in;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

