<template>
  <div id="app">
    <div class="container">
      <Toasts></Toasts>
      <MenuBar
        :store="store"
      />
      <Modals
        :store="store"
      />
      <Alerts
        :store="store"
      />
      <MainRow
        :store="store"
      />
      <div class="container-body">
        <div id="concept-cards">
          <!-- display all the concept types -->
          <section
            v-for="type in types"
            :key="type.id"
          >
            <typeRow
              :store="store"
              :type="type"
            />
          </section>
        </div>
      </div>
      <!-- append a blank div to placehold the navbar on mobile and give some space on the other devices -->
      <div
        class="container"
        style="height:70px;"
      />
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import "firebase/auth"
import { mapState } from 'vuex'
// import { EventBus } from '@/event-bus.js'
import MenuBar from '@/components/menu-bar'
import Modals from '@/components/modals'
import Alerts from '@/components/alerts'
import MainRow from '@/components/main-row'
import TypeRow from '@/components/type-row'
import Websocket from '@/components/websocket'

const LOCAL = true


var appKey = 'keyrkS74q9vL9FBHT'
var appId = 'appzdYVnVaVLTKUB7'
var colors = ['#10C177', '#FE4365', '#1693A5', '#420943']

// defines a store to be used all over the app according to https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch
var store = {
  debug: true,
  state: {
    types: [],
    cards: [],
    guessCards: {},
    cardDragged: {},
    colors: colors,
    selectedColor: colors[0], // select a default color
    currentUser: '',
    isMultiPlayer: false,
    playerName: '',
    currentGameRoom: '',
    gameRooms: [],
    gameMode: '',
    gameModeIsGod: false,
    gameModeAllowChange: true,
    alerts: []
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}

export default {
  name: 'App',
  components: { Modals, MenuBar, Alerts, MainRow, TypeRow, Websocket },
  methods: {
  },
  created () {
    // retrieve all the main types from Airtable
    // this.retrieveRecords('Types')
    this.$store.dispatch('retrieveRecords', {'recordType': 'Types'})
    // retrieve all the cards from airtable (100 records max per request)
    // this.retrieveRecords('Cards')
    this.$store.dispatch('retrieveRecords', { 'recordType': 'Cards'})
    // store current user if already logged-in 
    var user = firebase.auth().currentUser
    if (user) {
      this.sharedState.currentUser = user
      this.sharedState.playerName = user.dispayName
    }
  },
  computed: mapState ({
    types: state => state.cards.types,
    cards: state => state.cards.cards
  }),
  data: function () {
    return {
      store: store,
      sharedState: store.state
    }
  }
}
</script>

<style>
#app {
<!--   font-family: 'Avenir', Helvetica, Arial, sans-serif; -->
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}
#header-row{
  padding-right: 15px;
}
#concept-cards {
  margin-left: 15px;
}
.container-body {
  padding-top:10px;
  margin-top: 10px;
}
</style>
