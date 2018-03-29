<template>
  <div id="app">
    <x-calendar :minDate="'2018-2-20'" :selectTime="selectDate" :isSingle="false" @changed="d"></x-calendar>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      selectDate: ['2018-3-29', '2018-4-2']
    }
  },
  methods: {
    d (data) {
      console.log('App:', data)
    }
  }
}
</script>

<style>

</style>
