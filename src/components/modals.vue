/*

### Component ###
This component contains the modal dialogs

## Props ##

## Behavior ##

*/

<template>
  <div id="modal-dialogs">
    <b-modal id="modalplay" title="C'est parti !"
      ok-title="Ok, c'est parti" cancel-title="Une autre carte"
      @cancel="shuffleWords">
      <section v-if="words.danger.length > 0 && words.warning.length > 0 && words.success.length > 0" v-for="(wordtype, variant, index) in words" :key="index">
        <section v-for="(definition, key, index) in wordtype[0].fields" :key="index">
          <b-alert :variant="variant" show>{{definition}}</b-alert>
        </section>
      </section>
      <p class="text-right"><a href="https://jrmie818423.typeform.com/to/Kf9Ux6" class="text-secondary" target="_blank">>> Proposer des mots ou expressions</a></p>
      <!-- TODO see https://admin.typeform.com/form/Kf9Ux6/share#/embed to try to embed -->
    </b-modal>
    <b-modal ok-only ok-title="Merci" id="modalrules" title="Règles du jeu">
      <p class="text-left">Un premier joueur ouvre le jeu sur son téléphone (ou tous les autres joueurs quittent leurs yeux de l'écran). Ce joueur clique sur le bouton "Jouer" caché derrière la carte "Concept".</p>
      <p class="text-left">Sur la carte, il choisit le mot ou l'expression qu'il veut faire deviner.</p>
      <p class="text-left">Pour faire deviner le mot, il dispose de l'ensemble des <i>concepts</i> disponibles sur le plateau de jeu. Le premier concept étatn le concept principal, les autres lignes des concepts secondaires.</p>
      <p class="text-left">Pour ajouter un <i>concept</i> à un concept principal ou secondaire, le joueur clique sur la ligne du concept puis clique sur l'icône du concept qu'il veut ajouter et clique sur le <font-awesome-icon icon="plus-circle" />. Pour supprimer un <i>concept</i>, il clique sur l'icône du concept qu'il a ajouté et clique sur la <font-awesome-icon icon="trash" />.</p>
      <p class="text-left">Lorsque l'un des autres joueurs trouve le mot ou l'expression qu'il fallait deviner, le joueur qui faisait deviner peut réinitialiser le plateau en cliquant sur la carte "Concept" et le bouton "Réinitialiser".</p>
    </b-modal>
    <b-modal ok-only ok-title="Ohhhhhhhhhh" id="modalmultiplayers" title="Mode multijoueurs">
      <p class="text-left">Désolé, ce mode n'est pas encore disponible.</p>
    </b-modal>
    <b-modal ok-only ok-title="D'accord" id="modalabout" title="A propos">
      <p class="text-left">Ce jeu s'appuie librement sur le jeu de société <b>Concept</b> que nous vous conseillons.</p>
      <p class="text-left">Il n'est absolument pas cautionné par les auteurs originaux du jeu, il s'agit d'un hommage (et d'un petit test aussi). A la moindre demande, l'accès à ce prototype sera retiré.</p>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import easyjson from '../../data/success.json'
import mediumjson from '../../data/warning.json'
import hardjson from '../../data/danger.json'

const LOCAL = false
var appKey = 'keyrkS74q9vL9FBHT'
var appId = 'appzdYVnVaVLTKUB7'

export default {
  name: 'modals',
  components: { },
  props: [],
  methods: {
    retrieveRecords: function(recordType, offset) {
      var offset = offset !== undefined ? '?offset=' + offset : ''
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
        switch(recordType) {
          case 'success':
            this.words[recordType] = easyjson.records    
            break;
          case 'warning':
            this.words[recordType] = mediumjson.records
            break;
          default:
            this.words[recordType] = hardjson.records
        }
        // append the first row at the end of the array to use the first row as the current guess words
        this.words[recordType].push(this.words[recordType][0])
        // choose a first set of words to guess
        this.shuffleWords(undefined, recordType)
      }
    },
    shuffleWords: function(evt, key) {
      // pick a random index in each word subset and store the random index values at index 0 of the array
      if ( key === undefined ) {
        for (var iKey in this.words) {
          this.words[iKey][0] = this.words[iKey][Math.floor(Math.random() * this.words[iKey].length)];
        }
      } else {
        this.words[key][0] = this.words[key][Math.floor(Math.random() * this.words[key].length)];
      } 
      // prevent modal from closing
      if ( !(evt === undefined) ) {
        evt.preventDefault()
        this.$forceUpdate()
      }
    }
  },
  data: function () {
    return { 
      words: { success: [], warning: [], danger: [] }
    }
  },
  created () { 
    for (var key in this.words) {
      this.retrieveRecords(key)
    }
  }
}
</script>

<style scoped >
.alert {
  padding: 0 !important;
}
</style>