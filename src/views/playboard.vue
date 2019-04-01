<template>
  <div>
    <MainRow />
    <b-container fluid>
      <b-row class="rounded shadow-sm p-2 mb-2" style="background-color: #f0f0f0">
        <b-col>
          <h4>Devinez le mot caché dans ce plateau</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3">
          <b-card title="Règles du jeu">
            <p class="text-left">Essayez de deviner le plus rapidement possible le mot associé à ce tableau.<br>
            Vous pouvez proposer autant de mots que vous le souhaitez, à vous d'être le plus rapide.</p>
          </b-card>
        </b-col>
        <b-col md="3">
          <b-card title="Temps écoulé">
            <Timer ref="timer" /><br>
            <b-button @click="chrono()" variant="primary" class="mt-3">
              {{ btnPlayLabel }}
            </b-button>
          </b-card>
        </b-col>
        <b-col>
          <b-card title="A vous de jouer">
            <b-form inline @submit="checkGuess">
              <b-form-group 
                label="Proposez des mots :"
                label-for="playerGuess">
                <b-form-input
                  id="playerGuess"
                  v-model="playerGuess"
                  :state="isNewGuess"
                  value=""
                  autocomplete="off"
                  class="m-3"></b-form-input>
                </b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary">Deviner</b-button>
            </b-form>
            <ul id="playerGuessWords" class="text-left ml-2">
              <li v-for="word in playerGuessWords">
                <span class="fa-li ml-5"><font-awesome-icon icon="question" :color="colors[0]" /></span>{{ word }}
              </li>
            </ul>
          </b-card>
        </b-col>
      </b-row>      
    </b-container>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import MainRow from '@/components/main-row'
import Timer from '@/components/timer'

export default {
  name: 'Playboard',
  components: { MainRow, Timer },
  data: function () {
    return {
      playerGuess: '',
      playerGuessWords: [],
      isPlaying: null
    }
  },
  computed: {
    ...mapState ({
      types: state => state.cards.types,
      cards: state => state.cards.cards,
      colors: state => state.cards.colors
      // boardId: state => state.game.boardId
    }),
    isNewGuess: function () {
      return this.playerGuess === '' ? null : this.playerGuessWords.indexOf(this.playerGuess) === -1
    },
    btnPlayLabel: function() {
      switch(this.isPlaying) {
        case true:
          return 'Pause'
        case false:
          return 'Reprendre'
        default:
          return 'Démarrer le jeu'
      }
    }
  },
  methods: {
    ...mapMutations([
      // 'setBoardId',
      // 'setGameMode',
      'setGameModeDisplayBoard'
    ]),
    ...mapActions([
      'setGameMode'
    ]),
    checkGuess: function(e) {
      if (this.isPlaying !== true) {
        this.chrono()
      } 
      // append the guess words array to feedback what was already tried
      if (this.isNewGuess) {
        this.playerGuessWords.push(this.playerGuess)
      }
      e.preventDefault()
    },
    chrono: function() {
      // start, stop or resume chrono depending if currently playing
      var timerComponent = this.$refs.timer
      switch(this.isPlaying) {
        case true:
          timerComponent.pause()
          this.isPlaying = false
          break
        case false:
          timerComponent.resume()
          this.isPlaying = true
          break
        case null:
          timerComponent.reset()
          this.isPlaying = true
      }
      // display or hide guessCards
      this.setGameModeDisplayBoard(this.isPlaying)
    }
  },
  created () {
    // set game mode
    this.setGameMode('boardPlay')
    // // retrieve all the main types from Airtable
    // this.$store.dispatch('retrieveRecords', {'recordType': 'Types'})
    // // retrieve all the cards from airtable (100 records max per request)
    // this.$store.dispatch('retrieveRecords', { 'recordType': 'Cards'})
  }
}
</script>

<style scoped>
#playerGuessWords {
  list-style: none;
}
</style>
