<template>
  <div id="app">
    <img style="width:150px" src="@/assets/logo.png" />
    <div class="row">
      <ul>
        <li v-for="type in types" :key="type.id"> <!-- class="col-md-4" -->
          <b>{{type.fields.Title_fr}} </b><br />
          <ul>
            <li v-for="card in type.fields.Cards" :key="card">
              <b> Cards: </b>{{card}}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

var appKey = 'keyrkS74q9vL9FBHT'
var appId = 'appzdYVnVaVLTKUB7'
var types = []
var cards = []

export default {
  name: 'App',
  components: { },
  methods: {
    retrieveRecords : function(recordType, offset) {
      var offset = offset !== undefined ? '?offset=' + offset : ''
      axios.get(
        'https://api.airtable.com/v0/' + appId + '/' + recordType + offset,
        {
          headers: { Authorization: 'Bearer ' + appKey }
        }
      ).then(function (response) {
        if (recordType = 'Types') { 
          this.types = response.data.records 
        } else { 
          if (offset == '') { 
            this.cards = response.data.records
            retrieveRecords('Cards', this.cards.offset)
            console.log(this.cards)
          } else {
            this.cards = this.cards.concat(response.data.records)
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
