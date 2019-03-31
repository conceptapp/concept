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
    <ModalPlaySolo />
    <!-- Modal dialog pour Lancer le mode de jeu multijoueurs -->
    <ModalPlayMultiplayers />
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
import ModalPlaySolo from '@/components/modal-play-solo'
import ModalPlayMultiplayers from '@/components/modal-play-multiplayers'
import ModalMultiplayers from '@/components/modal-multiplayers'
import ModalWords from '@/components/modal-words'
import ModalRules from '@/components/modal-rules'

export default {
  name: 'Modals',
  components: { ModalLogin, ModalPlaySolo, ModalPlayMultiplayers, ModalMultiplayers, ModalWords, ModalRules },
  props: { },
  methods: { }
}
</script>

<style scoped >
</style>
