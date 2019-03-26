/*

### Component ###
This component contains the modal dialog for playing

## Props ##

## Behavior ##

*/

<template>
  <!-- Modal dialog pour afficher les mots -->
  <b-modal
    id="modalplay"
    ref="modalplay"
    title="Allez, on joue !"
    :hide-footer="true"
  >
    <b-card
      title="Multi-joueurs temps réel"
      :img-src="require('@/assets/images/play-multiplayers.jpg')"
      img-alt="Jeu multijoueurs"
      img-top
      style=""
      class="shadow-sm mb-3 bt-white rounded"
    >
      <b-card-text class="text-left">
        Jouez en temps réel sur le même ordinateur / téléphone / tablette ou chacun le vôtre. <br>
        Piochez un mot et faites-le deviner aux autres grâce aux images <i>Concept</i>.
      </b-card-text>
      <b-button v-b-modal.modalmultiplayers @click="hideModal" variant="primary">Lancer le jeu temps réel <font-awesome-icon icon="clock" /></b-button>
    </b-card>
    <b-card
      title="Jeu individuel en mode plateau"
      :img-src="require('@/assets/images/play-singleplayer.jpg')"
      img-alt="Jeu multijoueurs"
      img-top
      style=""
      class="shadow-sm mb-3 bt-white rounded"
    >
      <b-card-text class="text-left">
        Piochez un mot et trouvez la meilleure combinaison de cartes pour faire deviner les autres joueurs. <br>
        Et à votre tour, essayez de deviner les mots des plateaux proposés par les autres joueurs.
      </b-card-text>
      <b-button variant="primary" @click="createBoard">Créer un plateau <font-awesome-icon icon="chess-board" /></b-button>
      <b-button variant="primary" @click="displayBoardList">Deviner des plateaux <font-awesome-icon icon="question" /></b-button>
    </b-card>
  </b-modal>
</template>

<script>
// import { EventBus } from '@/event-bus.js'

export default {
  name: 'ModalPlay',
  components: { },
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
      sharedState: this.store.state
    }
  },
  created () {
  },
  methods: {
    hideModal: function () {
      this.$refs.modalplay.hide()
    },
    createBoard: function() {
      this.hideModal()
      this.sharedState.alerts.push({
        msg: "Désolé, le mode plateau n'est pas encore disponible",
        dismissCountDown: 5,
        variant: 'warning'
      })
    },
    displayBoardList: function() {
      this.hideModal()
      this.sharedState.alerts.push({
        msg: "Désolé, le mode plateau n'est pas encore disponible",
        dismissCountDown: 5,
        variant: 'warning'
      })
    }
  }
}
</script>

<style scoped >
.card {
  transition: box-shadow .3s;
}
.card:hover {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
}
</style>
