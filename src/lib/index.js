import Vue from 'vue'
import xCalendar from './xCalendar.vue'
const comment = {
  install: function (Vue) {
    Vue.component(xCalendar.name, xCalendar)
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(comment)
}
export default comment