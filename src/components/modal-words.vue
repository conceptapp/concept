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
    ref="modalwords"
    @cancel="shuffleWords"
    @ok="playMainboard"
    title="C'est parti !"
    :ok-title="gameMode === 'boardCreation' ? 'Créer le plateau' : 'Ok, c\'est parti' "
    cancel-title="Une autre carte"
  >
    <section
      v-if="words.danger.length > 0 && words.warning.length > 0 && words.success.length > 0"
      v-for="(wordtype, variant, index) in words"
      :key="index"
    >
      <div v-for="(definition, key, index_w) in wordtype[0].fields" :key="index_w" 
        class="mb-3" :class="[isActive(definition) ? 'active':'word-card', 'alert-'+variant]"
        @click="pushWord(definition, variant)">
          {{ definition }}
      </div>
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
import { mapState, mapMutations, mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import $socket from '@/websocket-instance.js'
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
  props: { },
  data: function () {
    return {
      words: { success: [], warning: [], danger: [] }
    }
  },
  computed: {
    ...mapState ({
      gameMode: state => state.game.gameMode,
      currentBoardWords: state => state.game.currentBoardWords,
      currentBoardVariant: state => state.game.currentBoardVariant,
      guessCards: state => state.cards.guessCards,
      alerts: state => state.alerts.alerts
    }),
    ...mapGetters(['user']),
  }, 
  created () {
    for (var key in this.words) {
      this.retrieveRecords(key)
    }
    // register event to show this modal
    EventBus.$on('show-modal-words', data => this.$refs.modalwords.show())
    EventBus.$on('cancelBoardCreation', data => this.resetBoard())
    EventBus.$on('saveBoard', data => this.saveBoard())
  },
  methods: {
    ...mapMutations([
      'pushBoardWord',
      'resetBoardWords',
      'pushAlert',
      'setBoardVariant'
    ]),
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
    },
    isActive: function(definition) {
      // activate if game mode is board creation && word was clicked
      return this.currentBoardWords.indexOf(definition) !== -1 && this.gameMode === 'boardCreation'
    },
    pushWord: function(word, variant) {
      // start from scratch
      if (this.currentBoardWords.length > 0) {
        this.resetBoardWords()
      }
      this.pushBoardWord(word)
      this.setBoardVariant(String(variant))
    },
    playMainboard: function() {
      this.$router.push({ name: 'Mainboard' })
      if (this.gameMode === 'boardCreation') {
        this.pushAlert({
          boardCreationMode: true
        })
      }
    },
    saveBoard: function() {
      // console.log('saveBoard', this.user.displayName , this.currentBoardWords, this.guessCards)
      $socket.emit('upsert_board', {
        'creator': this.user.displayName,
        'word': this.currentBoardWords[0],
        'word_variants': this.currentBoardWords,
        'guess_cards': this.guessCards,
        'difficulty': this.currentBoardVariant
      })
      this.pushAlert({
        msg: 'Le plateau de jeu a été enregistré.',
        dismissCountDown: 5,
        variant: 'info'
      })
    }
  }
}
</script>

<style scoped >
.alert {
  padding: 0 !important;
}
.word-card {
  transition: box-shadow .3s;
  cursor: pointer;
}
.word-card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175) !important;
}
.active, .active:hover {
  box-shadow: inset 0px 0px 10px #000;
}
</style>
