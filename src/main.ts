import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // যদি router use করো
import './style.css'           // <-- tailwind import

createApp(App).use(router).mount('#app')
