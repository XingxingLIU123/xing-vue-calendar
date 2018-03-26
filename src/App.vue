<template>
  <div id="app">
    <x-calendar :minDate="'2018-2-20'" :isSingle="false" @changed="d"></x-calendar>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
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
