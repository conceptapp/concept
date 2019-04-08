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
        <b-nav-item v-b-modal.modalplaymultiplayers>
          Jeu live
        </b-nav-item>
        <b-nav-item @click="launchPlaySolo()">
          Jeu tour à tour
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
          <b-nav-item-dropdown :text="user.displayName" right>
            <b-dropdown-item>{{ displayGameMode }}</b-dropdown-item>
            <b-dropdown-item v-if="gameModeMultiplayers">
              <span @click="showModalMultiplayers()">
                {{ currentGameRoom }} 
                <small v-if="gameRooms[currentGameRoom]" class="text-muted">
                  (<font-awesome-icon icon="male" /> x {{ gameRooms[currentGameRoom]['count'] }})
                </small>
              </span>
            </b-dropdown-item>
            <b-dropdown-item @click="$router.push({ name: 'Profile' })">Mon profil</b-dropdown-item>
            <b-dropdown-item @click="$auth.logout()">Se déconnecter</b-dropdown-item>
          </b-nav-item-dropdown>

        </b-navbar-nav>
      </b-navbar-nav>
    </b-navbar>

    <!-- mobile navbar - top navbar to display brand && bottom navbar for navigation -->
    <div class="d-sm-none" style="line-height:1.3em;">
      <b-navbar id="brand-navbar" class="navbar navbar-expand-lg navbar-dark bg-dark">
        <b-navbar-nav class="ml-auto mx-auto">
          <b-navbar-brand class="navbar-brand">
            <b-link to="/" style="color:white;text-decoration:none;">Concept</b-link>
          </b-navbar-brand>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown v-if="user" :text="user.displayName + displayGameModeLive" right>
            <b-dropdown-item v-if="gameModeMultiplayers">
              <span @click="showModalMultiplayers()">
                {{ currentGameRoom }} 
                <small v-if="gameRooms[currentGameRoom]" class="text-muted">
                  (<font-awesome-icon icon="male" /> x {{ gameRooms[currentGameRoom]['count'] }})
                </small>
              </span>
            </b-dropdown-item>
            <b-dropdown-item @click="$router.push({ name: 'Profile' })">Mon profil</b-dropdown-item>
            <b-dropdown-item @click="$auth.logout()">Se déconnecter</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item v-b-modal.modallogin v-if="!user" class="ml-auto">
            <font-awesome-icon icon="user-circle" style="color:white;" />
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
      <!-- bottom navbar -->
      <b-navbar class="navbar navbar-expand-lg navbar-dark bg-dark" fixed="bottom" style="padding-top:0;padding-bottom:0;">
        <b-navbar-nav class="ml-auto mx-auto">
          <b-nav-item v-b-modal.modalrules>
            <font-awesome-icon icon="book-open" /><br>Règles
          </b-nav-item>
          <b-nav-item v-b-modal.modalplaymultiplayers
            v-if="!gameMode || gameMode === 'boardPlay'">
            <font-awesome-icon icon="users" /><br>Jeu live
          </b-nav-item>
          <b-nav-item 
            v-if="!gameMode || gameMode === 'boardPlay'"
            @click="launchPlaySolo()">
            <font-awesome-icon icon="play-circle" /><br>Jeu tour à tour
          </b-nav-item>
          <b-nav-item
            v-b-modal.modalwords
            v-if="['boardCreation', 'local', 'allPlayersMode'].indexOf(gameMode) !== -1 || (gameMode == 'godMode' &&gameModeAllowChange)">
            <font-awesome-icon icon="puzzle-piece" /><br>Mots à deviner
          </b-nav-item>
          <b-nav-item
            v-if="['boardCreation', 'local', 'allPlayersMode'].indexOf(gameMode) !== -1 || (gameMode == 'godMode' &&gameModeAllowChange)"
            @click="reset">
            <font-awesome-icon icon="trash-restore" /><br>Réinitialiser
          </b-nav-item>
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
      'gameModeMultiplayers',
      'gameModeAllowChange'
    ]),
    playerName: function () {
      return this.user ? this.user.displayName : ''
    },
    displayGameMode: function() {
      switch (this.gameMode) {
        case 'boardPlay':
          return ' Mode tour à tour'
        case 'boardCreation':
          return ' Création d\'un plateau en cours'
        case 'local':
          return '' // all
        default: // 'allPlayersMode' 'godMode'
          return '' // already defined in template
      }
    },
    displayGameModeLive: function() {
      if (['allPlayersMode','godMode', 'local'].indexOf(this.gameMode) !== -1) {
        return ' (live)'
      } else if (['boardPlay', 'boardCreation'].indexOf(this.gameMode) !== -1) {
        return ' (solo)'
      } else {
        return ''
      }
    }
  },
  created () {
    // listen to events
    EventBus.$on('reset', args => this.reset(args))
    console.log('in menubar', this.$root)
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
        this.$root.$emit('bv::show::modal', 'modallogin')
      } else {
        this.$root.$emit('bv::show::modal', 'modalplaysolo')
      }
    },
    showModalMultiplayers() {
      this.$root.$emit('bv::show::modal', 'modalmultiplayers')
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
