import { createApp } from 'vue'
import '@unocss/reset/sanitize/sanitize.css'
import '@unocss/reset/sanitize/assets.css'
import '@/styles/base.scss'
import 'virtual:uno.css'
import App from './App.vue'

createApp(App).mount('#app')
