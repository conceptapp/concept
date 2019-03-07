<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-2">
          <span class="d-none d-sm-block">
            <!-- hide on screens smaller than lg / md / sm -->
            <img style="max-height:180px" src="./assets/logo.png" />
          </span>
          <span class="d-sm-none" style="color:green">
            <!-- hide on screens wider than lg / md / sm (TODO test on devices to choose the best breakpoint) -->
            ?
          </span>
        </div>
        <div class="col-10">
          <!-- show all the concept by row, one color each -->
          <div
            v-for="(color, index) in colors"
            class="row no-gutters align-items-center guess-row"
            v-bind:class="{ 'active': color == selectedColor }"
            v-on:click="selectedColor = color"
          >
            <div class="col-auto"> 
              <font-awesome-icon v-bind:icon="index == 0 ? 'question-circle' : 'exclamation-circle'" size="2x" :color="color" />
            </div>
            <div v-for="(card, index) in guessCards[color]" :key="index" class="card">
              <card
                v-bind:cardInfo="card"
                addOrRemove="remove"
                v-on:remove-icon="removeIcon"
              ></card>
            </div>
          </div>
        </div>
      </div>
      <!-- display all the concept types -->
      <section v-for="type in types" :key="type.id">
        <div class="row"> 
          <b> {{type.fields.Title_fr}} </b><br />
        </div>
        <div class="row">
          <!-- for each type, display the concept icons -->
<!--           <transition-group name="list-complete" tag="p"> -->
           <div class="card" v-for="card in type.fields.Cards" :key="card">
              <cardFinder 
                v-bind:cards="cards" 
                v-bind:cards2="cards2"
                v-bind:cardId="card"
                v-bind:type="type.fields.Type"
                v-on:add-icon="addIcon"
              ></cardFinder>
            </div>
<!--           </transition-group> -->
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import { setupCache } from 'axios-cache-adapter'
import cardFinder from '@/components/card-finder'
import card from '@/components/card'

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
var types = []
var cards = []
var cards2 = []
// var guessCards = {}
var selectedColor = "green" // select a default color
var colors = ["green", "red", "blue"]

export default {
  name: 'App',
  components: { cardFinder, card },
  methods: {
    retrieveRecords: function(recordType, offset) {
      var offset = offset !== undefined ? '&offset=' + offset : ''
      if (!LOCAL) {
        axios.get(
          'https://api.airtable.com/v0/' + appId + '/' + recordType + '?sort%5B0%5D%5Bfield%5D=index' + offset,
          {
            headers: { Authorization: 'Bearer ' + appKey }
          }
        ).then(function (response) {
          if (recordType == 'Types') {
            this.types = response.data.records
            // console.log("App Vue this.types", this.types)
          } else {  // get the cards data
            if (offset === '') { 
              this.cards = response.data.records
              // console.log("App Vue this.cards", this.cards)
              this.retrieveRecords('Cards', response.data.offset)
            } else {
              // this.cards = this.cards.concat(response.data.records)
              this.cards2 = response.data.records
              // console.log("App Vue this.cards2", this.cards2)
              this.cards.push.apply(this.cards, response.data.records)
            }
          }
        }.bind(this)).catch(function (error) {
          console.log(error)
        })
      } else {
        if (recordType == 'Types') {
          this.types = typesjson.records
          // console.log(this.types)
        } else {
          this.cards = cards1json.records
          this.cards2 = cards2json.records
        }
      }
    },
    addIcon: function (data) {
      // Name, Tooltip_fr
      // first time a color is called, need to create the empty array
      if (this.guessCards[this.selectedColor] == null) {
        this.guessCards[this.selectedColor] = []
      }
      this.guessCards[this.selectedColor].push(data)
      this.$forceUpdate()
    },
    removeIcon: function(data) {
      var removeIndex = this.guessCards[this.selectedColor].findIndex(function(obj) {
        return obj.Name === data.Name
      })
      this.guessCards[this.selectedColor].splice(removeIndex)
      this.$forceUpdate()
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
      types: types,
      cards: cards,
      cards2: cards2,
      selectedColor: selectedColor,
      colors: colors,
    }
  },
  computed: {
    guessCards: function() {
      // initialize an empty array to be pushed for every color
      var obj = {}
      for (var i = 0; i < colors.length; i++) {
        obj[colors[i]] = []
      }
      return obj
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  overflow: hidden;
}
.active {
  background-color: #e9ecef;
}
.guess-row {
  min-height: 50px;
  cursor: pointer;
}
</style>
