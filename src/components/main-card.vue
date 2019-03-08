/*

### Component ###
This component displays the main card of the game

## Props ##

## Behavior ##

*/

<template>
  <div class="card main-card shadow">
<!--     <div class="card main-card"> -->
      <span class="d-none d-sm-block">
        <!-- hide on screens smaller than lg / md / sm -->
        <img style="max-height:230px" :src="require('@/assets/images/logo.png')" />
      </span>
      <span class="d-sm-none" style="color:green">
        <!-- hide on screens wider than lg / md / sm (TODO test on devices to choose the best breakpoint) -->
        ?
      </span>
<!--     </div> -->
  </div>
</template>

<script>
export default {
  name: 'mainCard',
  components: {  },
  props: [],
  methods: {
  },
  data: function () {
    return { }
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-card{
  padding: 5px;
}
</style>
