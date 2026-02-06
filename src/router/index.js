import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Simulator from '../views/Simulator.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Landing,
  },
  {
    path: '/app',
    name: 'Simulator',
    component: Simulator,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
