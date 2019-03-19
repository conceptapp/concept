/*

### Component ###
This component displays the main card of the game

## Props ##

## Behavior ##

*/

<template>
  <div style="width=100%">
    <div id="main-card-front" class="">
      <!-- using Vue flip component https://github.com/kgrandemange/vue-flip -->
      <vue-flip :active-click="true" width="100%" height="auto">
        <div slot="front">
          <div class="card main-card shadow">
            <img style="max-height:230px;width:100%;" :src="require('@/assets/images/logo.png')" />
          </div>
        </div>
        <div slot="back">
          <div class="card main-card shadow">
            <b-button variant="primary" v-b-modal.modalplay>Jouer</b-button>
            <b-button variant="secondary" @click="reset">Réinitialiser</b-button>
            <b-button variant="secondary" v-b-modal.modalrules>Règles</b-button>
            <!-- hide about on tablets -->
            <b-button class="d-md-none d-lg-block" variant="light" v-b-modal.modalabout>A propos</b-button>
          </div>
        </div>
      </vue-flip>
    </div>
  </div>
</template>

<script>
import VueFlip from 'vue-flip'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'ConceptCard',
  components: { 'vue-flip': VueFlip },
  props: [],
  methods: {
    reset: function () {
      // this.$emit('reset')
      EventBus.$emit('reset', {})
    }
  },
  data: function () {
    return { }
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
