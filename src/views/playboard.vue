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
        <b-col md="3" v-if="!isBoardAlreadyPlayed(boardId)">
          <b-card title="Temps écoulé">
            <Timer ref="timer" /><br>
            <b-button @click="chrono()" variant="primary" class="mt-3">
              {{ btnPlayLabel }}
            </b-button>
          </b-card>
        </b-col>
        <b-col v-if="!isBoardAlreadyPlayed(boardId)">
          <b-card title="A vous de jouer" :class="{'border-success': isGuessFound}">
            <b-form inline @submit="checkGuess" v-if="!isGuessFound">
              <b-form-group 
                label="Proposez des mots :"
                label-for="playerGuess">
                <b-form-input
                  id="playerGuess"
                  v-model.trim="playerGuess"
                  :state="isNewGuess"
                  value=""
                  autocomplete="off"
                  class="m-3">
                </b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary">Deviner</b-button>
            </b-form>
            <div v-if="isGuessFound">
              <h4 class="card-body text-success">Bravo ! vous avez gagné !!!</h4>
              <h6 class="mb-3">Le mot à trouver était : <strong>{{ getBoardWords(boardId)[0] }}</strong>.</h6>
            </div>
            <ul id="playerGuessWords" class="text-left ml-2">
              <li v-for="word in playerGuessWords">
                <span class="fa-li ml-5"><font-awesome-icon icon="question" :color="colors[0]" /></span>{{ word }}
              </li>
            </ul>
          </b-card>
        </b-col>
        <b-col v-if="isBoardAlreadyPlayed(boardId)">
          <b-card title="Encore vous ?">
            <div class="card-body">
              Vous avez déjà joué à ce plateau et vous avez trouvé en {{ timeSpent }}.<br>
              Voulez-vous en <b-link :to="{ name: 'BoardsTable' }">essayer un autre ?</b-link>
            </div>
          </b-card>
        </b-col>
      </b-row>      
    </b-container>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import $socket from '@/websocket-instance'
import MainRow from '@/components/main-row'
import Timer from '@/components/timer'

export default {
  name: 'Playboard',
  components: { MainRow, Timer },
  data: function () {
    return {
      playerGuess: '',
      playerGuessWords: [],
      isPlaying: null,
      isGuessFound: false,
    }
  },
  computed: {
    ...mapState ({
      types: state => state.cards.types,
      cards: state => state.cards.cards,
      colors: state => state.cards.colors,
      // boardId: state => state.game.boardId
    }),
    ...mapGetters ([
      'user',
      'boardId',
      'getBoard',
      'getBoardWords',
      'getBoardPlayerInfo',
      'isBoardAlreadyPlayed'
    ]),
    currentBoard: function() {
      return this.getBoard(this.boardId)
    },
    timeSpent: function() {
      if ('timeSpent' in this.getBoardPlayerInfo(this.boardId)) {
        var duration = this.getBoardPlayerInfo(this.boardId).timeSpent
        var milliseconds = parseInt((duration % 1000) / 100),
          seconds = Math.floor((duration / 1000) % 60),
          minutes = Math.floor((duration / (1000 * 60)) % 60),
          hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

        hours = hours === 0 ? '' : hours + ' heures,'
        minutes = minutes === 0 ? '' : minutes + ' minutes et '
        return hours + minutes + seconds + " secondes"
      } else {
        return "00:00"
      }
    },
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
      'setGameModeDisplayBoard'
    ]),
    ...mapActions([
      'setGameMode'
    ]),
    checkGuess: function(e) {
      e.preventDefault()
      // start timer if not already running
      if (this.isPlaying !== true) this.chrono()
      // append the guess words array to feedback what was already tried
      if (this.isNewGuess) {
        this.playerGuessWords.push(this.playerGuess)
      }
      // check if the suggested word is correct
      console.log('in checkGuess', this.getBoardWords(this.boardId))
      // var currentBoard = this.getBoard(this.boardId)
      var currentBoardWords = this.getBoardWords(this.boardId)
      if (currentBoardWords.indexOf(this.playerGuess) !== -1) {
        this.isGuessFound = true
        // stop timer
        this.$refs.timer.pause()
        // update server with player who won
        console.log('currentboard', this.currentBoard)
        $socket.emit('upsert_board', {
          'creator': this.currentBoard.creator,  // need as key for request server-side
          'word': currentBoardWords[0],     // need as key for request server-side
          'player': {
            'playerName': this.user.displayName,
            'playerEmail': this.user.email,
            'found': true,
            'timeSpent': this.$refs.timer.milliseconds,
            'lastPlayed': new Date()
          },
          // need to pass all the params for the mongoose request server-side
          'word_variants': this.currentBoard.word_variants,  
          'guess_cards': this.currentBoard.guess_cards,
          'difficulty': this.currentBoard.difficulty
        })
      }
    },
    chrono: function() {
      // initialize GuessFound variable if user is navigating beween pages without refreshing the page
      this.isGuessFound = false
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
  }
}
</script>

<style scoped>
#playerGuessWords {
  list-style: none;
}
</style>
