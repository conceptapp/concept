<template>
  <div id="app">
    <div class="container">
      <Toasts></Toasts>
      <MenuBar />
      <Modals />
      <Alerts />
      <MainRow />
      <div class="container-body">
        <div id="concept-cards">
          <!-- display all the concept types -->
          <section
            v-for="type in types"
            :key="type.id"
          >
            <typeRow :type="type" />
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
import MenuBar from '@/components/menu-bar'
import Modals from '@/components/modals'
import Alerts from '@/components/alerts'
import MainRow from '@/components/main-row'
import TypeRow from '@/components/type-row'
import Websocket from '@/components/websocket'

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
      this.currentUser = user
      this.playerName = user.dispayName
    }
  },
  computed: mapState ({
    types: state => state.cards.types,
    cards: state => state.cards.cards,
    currentUser: state => state.game.currentUser,
    playerName: state => state.game.playerName
  }),
  data: function () {
    return {
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
