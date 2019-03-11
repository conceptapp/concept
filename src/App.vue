<template>
  <div id="app">
    <div class="container">
      <mainRow
        v-bind:store="store"
      ></mainRow>
      <div class="container-body">
        <div id="concept-cards">
          <!-- display all the concept types -->
          <section v-for="type in sharedState.types" :key="type.id">
              <!-- v-bind:cards="cards" 
              v-bind:selectedColor="selectedColor" 
              v-on:add-icon="addIcon"-->
            <typeRow
              v-bind:store="store"
              v-bind:type="type"
            ></typeRow>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { EventBus } from '@/event-bus.js'
// import { setupCache } from 'axios-cache-adapter'
import mainRow from '@/components/main-row'
import typeRow from '@/components/type-row'

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
const colors = ["#10C177", "#FE4365", "#1693A5", "#420943"]

// defines a store to be used all over the app according to https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch
var store = {
  debug: true,
  state: {
    types: [],
    cards: [],
    guessCards: {},
    colors: colors,
    selectedColor: colors[0]   // select a default color
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
  components: { mainRow, typeRow },
  methods: {
    retrieveRecords: function(recordType, offset) {
      // query all the data from airtable or local JSON stored in /data
      var offset = offset !== undefined ? '&offset=' + offset : ''
      if (!LOCAL) {
        axios.get(
          'https://api.airtable.com/v0/' + appId + '/' + recordType + '?sort%5B0%5D%5Bfield%5D=index' + offset,
          {
            headers: { Authorization: 'Bearer ' + appKey }
          }
        ).then(function (response) {
          if (recordType == 'Types') {
            this.sharedState.types = response.data.records
          } else {  // get the cards data
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
        if (recordType == 'Types') {
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
.active {
  background-color: #e9ecef;
}
.guess-icon {
  padding: 0px 5px 0px 5px !important;
}
.guess-row {
  min-height: 50px;
  cursor: pointer;
  margin: 0 0 14px 0;
}
.guess-cards {
  display: inherit;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
