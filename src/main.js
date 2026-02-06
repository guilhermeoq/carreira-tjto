import './assets/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css' // Import Bootstrap CSS
import 'bootstrap' // Import Bootstrap JS

const app = createApp(App)

app.use(router) // <--- Tell Vue to use it
app.mount('#app')
