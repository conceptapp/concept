<template>
  <div id="app">
    <img style="width:150px" src="assets/logo.png" />
    <div class="container">
      <section v-for="type in types" :key="type.id"> <!--- justify-content-start -->
        <div class="row"> 
          <b>{{type.fields.Title_fr}} </b><br />
        </div>
        <div class="row">
          <div class="col" v-for="card in type.fields.Cards" :key="card">
            <card v-bind:cards="cards" v-bind:cardId="card" v-bind:type="type.fields.Type"></card>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import card from '@/components/card'

var appKey = 'keyrkS74q9vL9FBHT'
var appId = 'appzdYVnVaVLTKUB7'
var types = []
var cards = []

export default {
  name: 'App',
  components: { card },
  methods: {
    retrieveRecords : function(recordType, offset) {
      var offset = offset !== undefined ? '&offset=' + offset : ''
      axios.get(
        'https://api.airtable.com/v0/' + appId + '/' + recordType + '?sort%5B0%5D%5Bfield%5D=index' + offset,
        {
          headers: { Authorization: 'Bearer ' + appKey }
        }
      ).then(function (response) {
        if (recordType == 'Types') { 
          this.types = response.data.records 
        } else {  // get the cards data
          if (offset === '') { 
            this.cards = response.data.records
            console.log(this.cards)
            this.retrieveRecords('Cards', response.data.offset)
          } else {
            // this.cards = this.cards.concat(response.data.records)
            this.cards.push(...response.data.records)
            // this.cards.push.apply(this.cards, response.data.records)
            console.log(this.cards)
          }
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
      })
    }
  },
  created () {
    // retrieve all the main types from Airtable
    this.retrieveRecords('Types')
    // retrieve all the cards from airtable (100 records max per request)
    this.retrieveRecords('Cards')

  },
  data: function () {
    return {types: types,
      cards: cards}
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
