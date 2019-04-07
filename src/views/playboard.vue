<template>
  <div>
    <b-modal id="confirmGiveUp" ref="confirmGiveUp" 
      title="Vraiment ?"
      @ok="giveUp()"
      @cancel="chrono()"
    >
      <p class="my-4">Êtes-vous sûr de vouloir abandonner la partie ?</p>
    </b-modal>
    <MainRow />
    <b-container fluid class="mt-2">
      <b-row class="rounded shadow-sm p-2 mb-3" style="background-color: #f0f0f0">
        <b-col>
          <h4 class="mt-1">Devinez le mot caché dans ce plateau</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="3">
          <b-card title="Règles du jeu">
            <p class="text-left">Essayez de deviner le plus rapidement possible le mot associé à ce tableau.<br>
            Vous pouvez proposer autant de mots que vous le souhaitez, à vous d'être le plus rapide.</p>
          </b-card>
        </b-col>
        <b-col v-if="!isBoardAlreadyPlayed(boardId)">
          <b-card title="Temps écoulé">
            <Timer ref="timer" /><br>
            <div v-if="!isPlayerGaveUp">
              <b-button @click="chrono()" variant="primary" class="mt-3">
                {{ btnPlayLabel }}
              </b-button>
              <b-button variant="secondary" class="mt-3"
                v-if="isPlayingBoard"
                @click="chrono();$refs['confirmGiveUp'].show()"
              >
                Abandonner
              </b-button>
              <b-button v-if="isPlayingBoard === false" @click="pauseGame()" variant="secondary" class="mt-3">
                Finir plus tard
              </b-button>
            </div>
            <div v-if="isPlayerGaveUp">
              <hr />
              <h4>Partie abandonnée</h4>
              <p class="card-body">Dommage ! Meilleure chance la prochaine fois.</p>
              <p class="mb-3">Le mot à trouver était : <strong>{{ getBoardWords(boardId)[0] }}</strong>.</p>
            </div>
          </b-card>
        </b-col>
        <b-col md="6" v-if="!isBoardAlreadyPlayed(boardId) && !isPlayerGaveUp">
          <b-card title="A vous de jouer" :class="{'border-success': isGuessFound}">
            <b-form inline @submit="checkGuess" v-if="!isGuessFound && !isPlayerGaveUp">
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
                <b-button type="submit" variant="primary">Deviner</b-button>
              </b-form-group>
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
              Vous avez déjà joué à ce plateau 
              <span v-if="getBoardPlayerInfo(boardId)['found']">et vous avez trouvé en</span>
              <span v-if="getBoardPlayerInfo(boardId)['gaveUp']">et vous aviez abandonné au bout de</span>
               {{ timeSpent }}.<br>
              Le mot à trouver était : <b>{{getBoardWords(boardId)[0]}}</b>.<br>
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
import { EventBus } from '@/event-bus.js'
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
      isGuessFound: false,
      isPlayerGaveUp: false
    }
  },
  computed: {
    ...mapState ({
      types: state => state.cards.types,
      cards: state => state.cards.cards,
      colors: state => state.cards.colors,
      isPlayingBoard: state => state.game.isPlayingBoard
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
      switch(this.isPlayingBoard) {
        case true:
          return 'Pause'
        case false:
          return 'Reprendre'
        default:
          return 'Démarrer'
      }
    }
  },
  methods: {
    ...mapMutations([
      'setGameModeDisplayBoard',
      'setIsPlayingBoard'
    ]),
    ...mapActions([
      'setGameMode'
    ]),
    checkGuess: function(e) {
      e.preventDefault()
      // start timer if not already running
      if (this.isPlayingBoard !== true) this.chrono()
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
            'gaveUp': false,
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
      switch(this.isPlayingBoard) {
        case true:
          timerComponent.pause()
          this.setIsPlayingBoard(false)
          break
        case false:
          timerComponent.resume()
          this.setIsPlayingBoard(true)
          break
        case null:
          timerComponent.reset()
          this.setIsPlayingBoard(true)
      }
      // display or hide guessCards
      // this.setGameModeDisplayBoard(this.isPlayingBoard)
    },
    giveUp: function() {
      // player can't find and wants to give up the game
      // send board update to the server
      console.log('user gave up && currentboard', this.currentBoard)
      var currentBoardWords = this.getBoardWords(this.boardId)
      $socket.emit('upsert_board', {
        'creator': this.currentBoard.creator,  // need as key for request server-side
        'word': currentBoardWords[0],     // need as key for request server-side
        'player': {
          'playerName': this.user.displayName,
          'playerEmail': this.user.email,
          'found': false,
          'gaveUp': true,
          'timeSpent': this.$refs.timer.milliseconds,
          'lastPlayed': new Date()
        },
        // need to pass all the params for the mongoose update server-side
        'word_variants': this.currentBoard.word_variants,  
        'guess_cards': this.currentBoard.guess_cards,
        'difficulty': this.currentBoard.difficulty
      })
      // display the board and the word to the player

      this.isPlayerGaveUp = true
    },
    pauseGame: function() {

    }
  },
  created () {
    // set game mode
    this.setGameMode('boardPlay')
    // start game when trigger chrono
    EventBus.$on('boardplay-chrono', data => this.chrono())
  }
}
</script>

<style scoped>
#playerGuessWords {
  list-style: none;
}
</style>
