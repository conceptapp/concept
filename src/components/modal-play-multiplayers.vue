/*

### Component ###
This component contains the modal dialog for playing multiplayers

## Props ##

## Behavior ##

*/

<template>
  <!-- Modal dialog pour afficher les mots -->
  <b-modal
    id="modalplaymultiplayers"
    ref="modalplaymultiplayers"
    title="Jeu multijoueurs"
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
        Piochez un mot et faites-le deviner aux autres grâce aux images <i>Concept</i>.<br>
        Deux modes de jeu sont possibles :
        <ul>
          <li>Vous pouvez jouer sur le même ordinateur / tablette / smartphone mais <strong> attention, pensez bien à masquer l'écran lorsque vous lancez le jeu car les mots vont apparaître à l'écran</strong>. Puis faites deviner aux autres joueurs une fois que vous connaissez le mot et que vous faites deviner.</li>
          <li>Chacun sur son ordinateur / tablette / smartphone en créant ou en rejoignant une partie existante.</li>
        </ul>
      </b-card-text>
      <b-button v-b-modal.words @click="launchPlaySameDevice()" variant="primary" class="m-1">Sur le même ordi <font-awesome-icon icon="clock" /></b-button>
      <b-button @click="launchMultiplayers()" variant="primary" class="m-1">Créer une partie <font-awesome-icon icon="puzzle-piece" /></b-button>
    </b-card>
  </b-modal>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ModalPlayMultiplayers',
  components: { },
  props: { },
  computed: mapState ({
    alerts: state => state.alerts.alerts,
    user: state => state.user.user
  }),
  // created () {
  //   EventBus.$on('show_modal_playmultiplayers', data => this.showModal())
  // },
  methods: {
    ...mapMutations([
      'setGameMode',
      'setPageAfterLogin'
    ]),
    hideModal: function () {
      this.$refs.modalplaymultiplayers.hide()
    },
    // showModal() {
    //   this.$refs.modalplaymultiplayers.show()
    // },
    createBoard: function() {
      this.hideModal()
      this.setGameMode('boardCreation')
      EventBus.$emit('show-modal-words', {})
    },
    displayBoardList: function() {
      this.hideModal()
      this.$router.push({ name: 'BoardsTable' })
    },
    launchMultiplayers: function() {
      this.hideModal()
      // show the main board paage
      this.$router.push({ name: 'Mainboard' })
      // if user not authenticated, force auth first else show multiplayers modal
      if (!this.user) {
        this.setPageAfterLogin('modalmultiplayers')
        this.$root.$emit('bv::show::modal', 'modallogin')
      } else {
        this.$root.$emit('bv::show::modal', 'modalmultiplayers')
      }
    },
    launchPlaySameDevice() {
      // display the main board and the word modal
      this.$router.push({ name: 'Mainboard' })
      this.$root.$emit('bv::show::modal', 'modalwords')
      this.setGameMode('local')
      this.hideModal()
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
