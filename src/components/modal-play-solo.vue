/*

### Component ###
This component contains the modal dialog for playing

## Props ##

## Behavior ##

*/

<template>
  <!-- Modal dialog pour afficher les mots -->
  <b-modal
    id="modalplaysolo"
    ref="modalplaysolo"
    title="Jouer en solo"
    :hide-footer="true"
  >
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
      <b-button variant="primary" @click="createBoard()" class="m-1">Créer un plateau <font-awesome-icon icon="chess-board" /></b-button>
      <b-button variant="primary" @click="displayBoardList()" class="m-1">Deviner des plateaux <font-awesome-icon icon="question" /></b-button>
    </b-card>
  </b-modal>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'ModalPlaySolo',
  components: { },
  props: { },
  computed: mapState ({
    alerts: state => state.alerts.alerts
  }),
  methods: {
    ...mapActions([
      'setGameMode'
    ]),
    hideModal: function () {
      this.$refs.modalplaysolo.hide()
    },
    createBoard: function() {
      this.hideModal()
      this.setGameMode('boardCreation')
      EventBus.$emit('show-modal-words', {})
    },
    displayBoardList: function() {
      this.hideModal()
      this.setGameMode('boardPlay')
      this.$router.push({ name: 'BoardsTable' })
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
