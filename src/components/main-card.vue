/*

### Component ###
This component displays the main card of the game

## Props ##

## Behavior ##

*/

<template>
  <div style="width=100%">
    <!-- hide on screens wider than lg / md / sm -->
    <div class="card d-sm-none" style="color:green">
          ?
    </div>
    <!-- hide on screens smaller than lg / md / sm -->
    <div id="main-card-front" class="d-none d-sm-block">
      <!-- using Vue flip component https://github.com/kgrandemange/vue-flip -->
      <vue-flip :active-click="true" width="100%" height="auto">
        <div slot="front">
          <div class="card main-card shadow">
            <img style="max-height:230px" :src="require('@/assets/images/logo.png')" />
          </div>
        </div>
        <div slot="back">
          <div class="card main-card shadow">
            <button type="button" class="btn btn-primary" @click="play">Jouer</button>
            <button type="button" class="btn btn-secondary" @click="reset">Réinitialiser</button>
            <button type="button" class="btn btn-secondary" @click="rules">Règles</button>
            <button type="button" class="btn btn-light" @click="about">A propos</button>
          </div>
        </div>
      </vue-flip>
    </div>
  </div>
</template>

<script>
import VueFlip from 'vue-flip'

export default {
  name: 'mainCard',
  components: { 'vue-flip': VueFlip },
  props: [],
  methods: {
    play: function() {
      alert("Play")
    },
    reset: function() {
      this.$emit('reset')
    },
    rules: function() {
      alert("Rules")
    },
    about: function() {
      alert("about")
    }
  },
  data: function () {
    return { }
  },
  computed: {
  }
}
</script>

<!-- Removed "scoped" attribute to apply css to vue-flip -->
<style>
.main-card{
  padding: 5px;
  cursor: pointer;
}
.main-card .btn {
  margin: 10px 0;
}
.btn-primary {
  background-color: #1693A5 !important;
}
.front, .back {
  width: 100%;
  height: 100%;
}
</style>
