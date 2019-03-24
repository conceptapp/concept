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
            v-for="type in sharedState.types"
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
import axios from 'axios'
// import { EventBus } from '@/event-bus.js'
// import { setupCache } from 'axios-cache-adapter'
import MenuBar from '@/components/menu-bar'
import Modals from '@/components/modals'
import Alerts from '@/components/alerts'
import MainRow from '@/components/main-row'
import TypeRow from '@/components/type-row'
import Websocket from '@/components/websocket'

import typesjson from '../data/types.json'
import cards1json from '../data/cards-1.json'
import cards2json from '../data/cards-2.json'

const LOCAL = true

// // Create axios-cache-adapter instance // Cache 15 minutes
// const cache = setupCache({
//   maxAxe: 15 * 60 * 1000
// })

// // Create axios istance passing the newly created cache.adapter
// const api = axios.create({
//   adapter: cache.adapter
// })

/*
api({
  url: '',
  method: 'get'
}).then( async(response) => {
  console.log('Request response:', response)
})
*/

var appKey = 'keyrkS74q9vL9FBHT'
var appId = 'appzdYVnVaVLTKUB7'
const colors = ['#10C177', '#FE4365', '#1693A5', '#420943']

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
    retrieveRecords: function (recordType, offset) {
      // query all the data from airtable or local JSON stored in /data
      offset = offset !== undefined ? '&offset=' + offset : ''
      if (!LOCAL) {
        axios.get(
          'https://api.airtable.com/v0/' + appId + '/' + recordType + '?sort%5B0%5D%5Bfield%5D=index' + offset,
          {
            headers: { Authorization: 'Bearer ' + appKey }
          }
        ).then(function (response) {
          if (recordType === 'Types') {
            this.sharedState.types = response.data.records
          } else {
            // get the cards data
            if (offset === '') {
              this.sharedState.cards = response.data.records
              this.retrieveRecords('Cards', response.data.offset)
            } else {
              this.sharedState.cards.concat(response.data.records)
            }
          }
        }.bind(this)).catch(function (error) {
          console.log(error)
        })
      } else {
        if (recordType === 'Types') {
          this.sharedState.types = typesjson.records
        } else {
          this.sharedState.cards = cards1json.records.concat(cards2json.records)
        }
      }
    }
  },
  created () {
    // retrieve all the main types from Airtable
    this.retrieveRecords('Types')
    // retrieve all the cards from airtable (100 records max per request)
    this.retrieveRecords('Cards')
    // store current user if already logged-in 
    var user = firebase.auth().currentUser
    if (user) {
      this.sharedState.currentUser = user
      this.sharedState.playerName = user.dispayName
    }
  },
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
