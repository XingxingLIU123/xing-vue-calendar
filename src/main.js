import Vue from 'vue'
import App from './App.vue'
import xCalendar from './lib/index.js'
Vue.use(xCalendar)

new Vue({
  el: '#app',
  render: h => h(App)
})
