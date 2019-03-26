/*

### Component ###
This component contains the modal dialogs

## Props ##

## Behavior ##

*/

<template>
  <div id="modal-dialogs">
    <!-- Modal dialog pour l'identification -->
    <ModalLogin />
    <!-- Modal dialog pour lancer le jeu  -->
    <ModalPlay />
    <!-- Modal dialog pour afficher le mode de jeu multijoueurs -->
    <ModalMultiplayers />
    <!-- Modal dialog pour afficher les mots -->
    <ModalWords />
    <!-- Modal dialog pour afficher les règles du jeu -->
    <ModalRules />
  </div>
</template>

<script>
// import { EventBus } from '@/event-bus.js'
import ModalLogin from '@/components/modal-login'
import ModalPlay from '@/components/modal-play'
import ModalMultiplayers from '@/components/modal-multiplayers'
import ModalWords from '@/components/modal-words'
import ModalRules from '@/components/modal-rules'

export default {
  name: 'Modals',
  components: { ModalLogin, ModalPlay, ModalMultiplayers, ModalWords, ModalRules },
  props: { },
  methods: { }
}
</script>

<style scoped >
</style>
