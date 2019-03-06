<template>
  <div id="app">
    <img style="width:150px" src="./assets/logo.png" />
    <div class="container">
      <section v-for="type in types" :key="type.id"> <!--- justify-content-start -->
        <div class="row"> 
          <b> {{type.fields.Title_fr}} </b><br />
        </div>
        <div class="row">
          <div class="card" v-for="card in type.fields.Cards" :key="card">
            <card v-bind:cards="cards" v-bind:cards2="cards2" v-bind:cardId="card" v-bind:type="type.fields.Type"></card>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import { setupCache } from 'axios-cache-adapter'
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

export default {
  name: 'App',
  components: { card },
  methods: {
    retrieveRecords : function(recordType, offset) {
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
          console.log(this.types)
        } else {
          this.cards = cards1json.records
          this.cards2 = cards2json.records
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
      types: types,
      cards: cards,
      cards2: cards2}
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
  margin-top: 60px;
}
</style>
