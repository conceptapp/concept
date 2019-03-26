/*

### Component ###
This component contains the modal dialog for generating words to guess

## Props ##

## Behavior ##

*/

<template>
  <!-- Modal dialog pour afficher les mots -->
  <b-modal
    id="modalwords"
    @cancel="shuffleWords"
    title="C'est parti !"
    ok-title="Ok, c'est parti"
    cancel-title="Une autre carte"
  >
    <section
      v-if="words.danger.length > 0 && words.warning.length > 0 && words.success.length > 0"
      v-for="(wordtype, variant, index) in words"
      :key="index"
    >
      <section v-for="(definition, key, index_w) in wordtype[0].fields" :key="index_w">
        <b-alert :variant="variant" show>
          {{ definition }}
        </b-alert>
      </section>
    </section>
    <p class="text-right">
      <a
        href="https://jrmie818423.typeform.com/to/Kf9Ux6"
        class="text-secondary"
        target="_blank"
      >>> Proposer des mots ou expressions</a>
    </p>
    <!-- TODO see https://admin.typeform.com/form/Kf9Ux6/share#/embed to try to embed -->
  </b-modal>
</template>

<script>
// import { EventBus } from '@/event-bus.js'

import axios from 'axios'
import easyjson from '../../data/success.json'
import mediumjson from '../../data/warning.json'
import hardjson from '../../data/danger.json'

const LOCAL = true
var appKey = 'keyrkS74q9vL9FBHT'
var appId = 'appzdYVnVaVLTKUB7'

export default {
  name: 'ModalWords',
  components: { },
  props: {
    store: {
      type: Object,
      default: function () {
        return {}
      }
    },
  },
  data: function () {
    return {
      sharedState: this.store.state,
      words: { success: [], warning: [], danger: [] }
    }
  },
  created () {
    for (var key in this.words) {
      this.retrieveRecords(key)
    }
  },
  methods: {
    retrieveRecords: function (recordType, offset) {
      offset = offset !== undefined ? '?offset=' + offset : ''
      if (!LOCAL) {
        axios.get(
          'https://api.airtable.com/v0/' + appId + '/' + recordType + offset,
          {
            headers: { Authorization: 'Bearer ' + appKey }
          }
        ).then(function (response) {
          if (offset === '') {
            this.words[recordType] = response.data.records
          } else {
            this.words[recordType].concat(response.data.records)
          }
          // it there is some more data to fetch, call again the function
          if ('offset' in response.data) {
            this.retrieveRecords(recordType, offset)
          } else {
            // append the first row at the end of the array to use the first row as the current guess words
            this.words[recordType].push(this.words[recordType][0])
            // choose a first set of words to guess
            this.shuffleWords(undefined, recordType)
          }
        }.bind(this)).catch(function (error) {
          console.log(error)
        })
      } else {
        switch (recordType) {
          case 'success':
            this.words[recordType] = easyjson.records
            break
          case 'warning':
            this.words[recordType] = mediumjson.records
            break
          default:
            this.words[recordType] = hardjson.records
        }
        // append the first row at the end of the array to use the first row as the current guess words
        this.words[recordType].push(this.words[recordType][0])
        // choose a first set of words to guess
        this.shuffleWords(undefined, recordType)
      }
    },
    shuffleWords: function (evt, key) {
      // pick a random index in each word subset and store the random index values at index 0 of the array
      if (key === undefined) {
        for (var iKey in this.words) {
          this.words[iKey][0] = this.words[iKey][Math.floor(Math.random() * this.words[iKey].length)]
        }
      } else {
        this.words[key][0] = this.words[key][Math.floor(Math.random() * this.words[key].length)]
      }
      // prevent modal from closing
      if (!(evt === undefined)) {
        evt.preventDefault()
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style scoped >
.alert {
  padding: 0 !important;
}
</style>
