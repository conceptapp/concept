<template>
  <div id="app">
    <div class="container">
      <!-- TODO début du composant à intégrer à main-card -->
      <!-- garder la marque au milieu sur mobile -->
      <b-navbar class="navbar navbar-expand-lg navbar-light bg-light d-none d-sm-block">
        <b-navbar-nav>
          <b-navbar-brand class="navbar-brand" href="#">Concept</b-navbar-brand>
          <b-nav-item-dropdown text="Jouer">
            <b-dropdown-item href="#">Afficher la carte en cours</b-dropdown-item>
            <b-dropdown-item href="#">Tirer une autre carte</b-dropdown-item>
            <b-dropdown-item href="#">----------------------</b-dropdown-item>
            <b-dropdown-item href="#">Réinitialiser le jeu</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item href="#">Contribuer</b-nav-item>
          <b-nav-item href="#">Règles du jeu</b-nav-item>
          <b-nav-item href="#">A propos</b-nav-item>
        </b-navbar-nav>
      </b-navbar>
      <!-- mobile navbar TODO ajouter les events -->
      <div class="container d-sm-none" style="line-height:1.3em;">
        <b-navbar class="navbar navbar-expand-lg navbar-dark bg-dark" fixed="bottom" style="padding-top:0;padding-bottom:0;">
          <b-navbar-nav>
            <b-nav-item href="#"><font-awesome-icon icon="play-circle" /><br />Jouer</b-nav-item>          
            <b-nav-item href="#"><font-awesome-icon icon="trash-restore" /><br />Réinitialiser</b-nav-item>
            <b-nav-item href="#"><font-awesome-icon icon="book-open" /><br />Règles</b-nav-item>
            <b-nav-item href="#"><font-awesome-icon icon="plus-square" /><br />Contribuer</b-nav-item>
            <b-nav-item href="#"><font-awesome-icon icon="bars" /><br />More</b-nav-item>
          </b-navbar-nav>
        </b-navbar>
      </div>
      <!-- end of mobile navbar -->
      <div class="container-body">
        <div id="header-row" class="row">
          <div class="col-2 d-none d-sm-block">
            <mainCard
              v-on:reset="reset"
            ></mainCard>
          </div>
          <div class="col-1 d-sm-none"></div>
          <div class="col-10">
            <!-- show all the concept by row, one color each -->
            <!-- TODO wrap all this in a component to get flexibility on mobile design ? -->
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
      </div>
      <!-- TODO fin du composant à intégrer à main-card -->
      <div class="container-body">
        <div id="concept-cards">
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
const selectedColor = colors[0] // select a default color

// initialize an empty array to be pushed for every color
var initGuessCards = function() {
  var obj = {}
  for (var i = 0; i < colors.length; i++) {
    obj[colors[i]] = []
  }
  return obj
}

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
    },
    reset: function() {
      this.guessCards = initGuessCards()
      this.selectedColor = this.colors[0] // select the default color
    }
  },
  created () {
    // retrieve all the main types from Airtable
    this.retrieveRecords('Types')
    // retrieve all the cards from airtable (100 records max per request)
    this.retrieveRecords('Cards')
    this.guessCards = initGuessCards()
  },
  data: function () {
    return {
      types: types,
      cards: cards,
      selectedColor,
      colors: colors,
      guessCards: {}
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
