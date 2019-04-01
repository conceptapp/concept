/*

### Component ###
This component displays the main menu bar

## Props ##

## Behavior ##

*/

<template>
  <section id="menubar">
    <!-- desktop navbar -->
    <b-navbar class="navbar navbar-expand-lg navbar-light bg-light d-none d-sm-block">
      <b-navbar-nav>
        <b-navbar-brand class="navbar-brand">
          <b-link to="/" style="color:black;text-decoration:none;">Concept</b-link>
        </b-navbar-brand>
        <b-nav-item v-b-modal.modalrules>
          Règles du jeu
        </b-nav-item>
<!--         <b-nav-item v-b-modal.modalwords>
          Afficher des mots
        </b-nav-item> -->
        <b-nav-item v-b-modal.modalplaymultiplayers>
          Jeu multijoueurs
        </b-nav-item>
        <b-nav-item @click="launchPlaySolo()">
          Jeu solo
        </b-nav-item>
        <!-- TODO afficher le reset uniquement sur les bons game mode -->
        <b-nav-item @click="reset" v-if="['local', 'allPlayersMode', 'boardCreation'].indexOf(gameMode) !== -1">
          Réinitialiser le plateau
        </b-nav-item>
        <b-nav-item href="https://jrmie818423.typeform.com/to/Kf9Ux6" target="_blank">
          Contribuer <sup><font-awesome-icon icon="external-link-alt" /></sup>
        </b-nav-item>
        <!-- hide about on tablets -->
        <b-nav-item v-b-modal.modalabout class="d-md-none">
          A propos
        </b-nav-item>
        <!-- right aligned items -->
        <!-- user not authenticated yet, display contact icon -->
        <b-navbar-nav v-if="!user" class="ml-auto">
          <b-nav-item v-b-modal.modallogin>
            <font-awesome-icon icon="user-circle" size="lg" />
          </b-nav-item>
        </b-navbar-nav>
        <!-- user is authenticated, display user name & information about the current game -->
        <b-navbar-nav v-else class="ml-auto">
          <b-nav-item>
            <span @click="showModalLogin()">{{ playerName }}</span>
            <span v-if="gameModeMultiplayers" @click="showModalMultiplayers()">
              @ {{ currentGameRoom }} 
              <small v-if="gameRooms[currentGameRoom]" class="text-muted">
                (<font-awesome-icon icon="male" /> x {{ gameRooms[currentGameRoom]['count'] }})
              </small>
            </span>
            <span v-else @click="">
              {{ displayGameMode }}
            </span>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-navbar>
    <!-- mobile navbar - top navbar to display brand && bottom navbar for navigation -->
        <!-- TODO update solo & multijoueurs -->
    <div class="d-sm-none" style="line-height:1.3em;">
      <b-navbar id="brand-navbar" class="navbar navbar-expand-lg navbar-dark bg-dark">
        <b-navbar-nav class="ml-auto mx-auto">
          <b-navbar-brand class="navbar-brand">
            Concept
          </b-navbar-brand>
        </b-navbar-nav>
      </b-navbar>
      <b-navbar class="navbar navbar-expand-lg navbar-dark bg-dark" fixed="bottom" style="padding-top:0;padding-bottom:0;">
        <b-navbar-nav class="ml-auto mx-auto">
          <b-nav-item v-b-modal.modalrules>
            <font-awesome-icon icon="book-open" /><br>Règles
          </b-nav-item>
          <b-nav-item v-b-modal.modalplaymultiplayers>
            <font-awesome-icon icon="users" /><br>Multijoueurs
          </b-nav-item>
          <b-nav-item @click="launchPlaySolo()">
            <font-awesome-icon icon="play-circle" /><br>Jeu solo
          </b-nav-item>
          <b-nav-item @click="reset">
            <font-awesome-icon icon="trash-restore" /><br>Réinitialiser
          </b-nav-item>
          <!--           <b-nav-item href="#"><font-awesome-icon icon="plus-square" /><br />Contribuer</b-nav-item> -->

          <!--           <b-nav-item href="#"><font-awesome-icon icon="bars" /><br />More</b-nav-item> -->
        </b-navbar-nav>
      </b-navbar>
    </div>
    <!-- end of mobile navbar -->
  </section>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'MenuBar',
  components: { },
  props: { },
  computed: {
    ...mapState ({
      colors: state => state.cards.colors,
      selectedColor: state => state.cards.selectedColor,
      currentGameRoom: state => state.game.currentGameRoom,
      gameRooms: state => state.game.gameRooms,
      gameMode: state => state.game.gameMode
    }),
    ...mapGetters([
      'user',
      'gameModeMultiplayers'
    ]),
    playerName: function () {
      return this.user ? this.user.displayName : ''
    },
    displayGameMode: function() {
      switch (this.gameMode) {
        case 'boardPlay':
          return '(jeu solo)'
        case 'boardCreation':
          return '(création d\'un plateau)'
        case 'local':
          return '' // all
        default: // 'allPlayersMode' 'gameMode'
          return '' // already defined in template
      }
    }
  },
  created () {
    // listen to events
    EventBus.$on('reset', args => this.reset(args))
  },
  methods: {
    ...mapMutations([
      'setCurrentColor',
      'setPageAfterLogin'
    ]),
    reset: function () {
      // this.sharedState.guessCards = this.initGuessCards()
      EventBus.$emit('init-guess-cards')
      this.setCurrentColor(this.colors[0]) // select the default color
    },
    launchPlaySolo() {
      // if user not authenticated, force auth first else show multiplayers modal
      if (!this.user) {
        this.setPageAfterLogin('modalplaysolo')
        this.showModalLogin()
      } else {
        this.$root.$emit('bv::show::modal', 'modalplaysolo')
      }
    },
    showModalMultiplayers() {
      this.$root.$emit('bv::show::modal', 'modalmultiplayers')
    },
    showModalLogin() {
      this.$root.$emit('bv::show::modal', 'modallogin')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#brand-navbar {
  margin-left: -15px;
  margin-right: -15px;
}
</style>
