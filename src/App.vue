<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-2">
          <mainCard></mainCard>
        </div>
        <div class="col-10">
          <!-- show all the concept by row, one color each -->
          <!-- any need for a no-gutters class ? -->
          <div
            v-for="(color, index) in colors"
            class="row align-items-center rounded shadow-sm guess-row"
            v-bind:class="{ 'active': color == selectedColor }"
            v-on:click="selectedColor = color"
          >
            <div class="col-auto guess-icon">
              <font-awesome-icon v-bind:icon="index == 0 ? 'question-circle' : 'exclamation-circle'" size="2x" :color="color" />
            </div>
            <transition-group name="fade" class="guess-cards">
              <div v-for="(card, index) in guessCards[color]" :key="index" class="card">
                <card
                  v-bind:cardInfo="card"
                  v-bind:iconColor="color"
                  addOrRemove="remove"
                  v-on:remove-icon="removeIcon"
                ></card>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
      <!-- display all the concept types -->
      <section v-for="type in types" :key="type.id">
        <typeRow
          v-bind:cards="cards" 
          v-bind:type="type"
          v-bind:selectedColor="selectedColor"
          v-on:add-icon="addIcon"
        ></typeRow>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import { setupCache } from 'axios-cache-adapter'
import mainCard from '@/components/main-card'
import typeRow from '@/components/type-row'
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
// var guessCards = {}
var colors = ["#10C177", "#FE4365", "#1693A5", "#420943"]
var selectedColor = colors[0] // select a default color


export default {
  name: 'App',
  components: { mainCard, typeRow, card },
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
              this.cards.concat(response.data.records)
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
          this.cards = cards1json.records.concat(cards2json.records)
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
<!--   font-family: 'Avenir', Helvetica, Arial, sans-serif; -->
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  padding-top:10px;
  overflow: hidden;
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
