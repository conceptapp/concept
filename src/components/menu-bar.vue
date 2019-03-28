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
          Concept
        </b-navbar-brand>
        <b-nav-item v-b-modal.modalwords>
          Afficher des mots
        </b-nav-item>
        <b-nav-item v-show="!user" v-b-modal.modallogin>
          Jouer à plusieurs
        </b-nav-item>
        <b-nav-item v-show="!!user" v-b-modal.modalplay>
          Jouer à plusieurs
        </b-nav-item>
<!--         <b-nav-item v-b-modal.modalmultiplayers>
          Multijoueurs
        </b-nav-item> -->
        <b-nav-item @click="reset">
          Réinitialiser le plateau
        </b-nav-item>
        <b-nav-item href="https://jrmie818423.typeform.com/to/Kf9Ux6" target="_blank">
          Contribuer
        </b-nav-item>
        <b-nav-item v-b-modal.modalrules>
          Règles du jeu
        </b-nav-item>
        <!-- hide about on tablets -->
        <b-nav-item v-b-modal.modalabout class="d-md-none">
          A propos
        </b-nav-item>
        <!-- right aligned items -->
        <!-- user not authenticated yet -->
        <b-navbar-nav v-if="!user" class="ml-auto">
          <b-nav-item v-b-modal.modallogin>
            <font-awesome-icon icon="user-circle" size="lg" />
          </b-nav-item>
        </b-navbar-nav>
        <!-- user is authenticated -->
        <b-navbar-nav v-else class="ml-auto">
          <b-nav-item>
            <span @click="showModalLogin">{{playerName}}</span>
            <span v-if="gameRooms[currentGameRoom]" @click="showModalMultiplayers">
              @ {{ currentGameRoom }} 
              <small v-if="gameRooms[currentGameRoom]" class="text-muted">
                (<font-awesome-icon icon="male" /> x {{ gameRooms[currentGameRoom]['count'] }})
              </small>
            </span>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-navbar>
    <!-- mobile navbar - top navbar to display brand && bottom navbar for navigation -->
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
          <b-nav-item v-b-modal.modalplay>
            <font-awesome-icon icon="play-circle" /><br>Jouer
          </b-nav-item>
          <b-nav-item v-show="!user" v-b-modal.modallogin>
            <font-awesome-icon icon="users" /><br>Multijoueurs
          </b-nav-item>
          <b-nav-item v-show="!!user" v-b-modal.modalplay>
            <font-awesome-icon icon="users" /><br>Multijoueurs
          </b-nav-item>
          <b-nav-item @click="reset">
            <font-awesome-icon icon="trash-restore" /><br>Réinitialiser
          </b-nav-item>
          <!--           <b-nav-item href="#"><font-awesome-icon icon="plus-square" /><br />Contribuer</b-nav-item> -->
          <b-nav-item v-b-modal.modalrules>
            <font-awesome-icon icon="book-open" /><br>Règles
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
      // user: state => state.user.user,
      colors: state => state.cards.colors,
      selectedColor: state => state.cards.selectedColor,
      // currentUser: state => state.game.currentUser,
      // playerName: state => state.game.playerName,
      currentGameRoom: state => state.game.currentGameRoom,
      gameRooms: state => state.game.gameRooms
    }),
    ...mapGetters(['user']),
    playerName: function () {
      return this.user ? this.user.displayName : ''
    }
  },
  created () {
    // listen to events
    EventBus.$on('reset', args => this.reset(args))
  },
  methods: {
    ...mapMutations([
      'setCurrentColor'
    ]),
    reset: function () {
      // this.sharedState.guessCards = this.initGuessCards()
      EventBus.$emit('init-guess-cards')
      this.setCurrentColor(this.colors[0]) // select the default color
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
