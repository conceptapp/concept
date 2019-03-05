<template>
  <div id="app">
    <img style="width:150px" src="@/assets/logo.png" />
    <div class="row">
      <ul>
        <li v-for="item in items" :key="trick.id"> <!-- class="col-md-4" -->
          item
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

var appKey = 'keyrkS74q9vL9FBHT'
var appId = 'appzdYVnVaVLTKUB7'
var items = []

export default {
  name: 'App',
  created () {
    axios.get(
      'https://api.airtable.com/v0/' + appId + '/Table%201',
      {
        headers: { Authorization: 'Bearer ' + appKey }
      }
    ).then(function (response) {
      this.items = response.data.records
    }.bind(this)).catch(function (error) {
      console.log(error)
    })
  },
  components: { },
  data: function () {
    return data
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
