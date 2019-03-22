/*

### Component ###
This component contains the modal dialogs

## Props ##

## Behavior ##

*/

<template>
  <div id="modal-dialogs">
    <!-- Modal dialog pour afficher les mots -->
    <ModalWords :store="store" />
    <!-- Modal dialog pour afficher les règles du jeu -->
    <ModalRules :store="store" />
    <!-- Modal dialog pour afficher le mode de jeu multijoueurs -->
    <ModalMultiplayers :store="store" />
  </div>
</template>

<script>
// import { EventBus } from '@/event-bus.js'
import ModalMultiplayers from '@/components/modal-multiplayers'
import ModalWords from '@/components/modal-words'
import ModalRules from '@/components/modal-rules'

export default {
  name: 'Modals',
  components: { ModalMultiplayers, ModalWords, ModalRules },
  props: {
    store: {
      type: Object,
      default: function () {
        return {}
      }
    },
  },
  data: function () {
    return {
      sharedState: this.store.state,
    }
  },
  methods: {
  }
}
</script>

<style scoped >
</style>
