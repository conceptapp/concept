/*

### Component ###
This component contains only the modal dialog and some websocket calls for multiplayer games

## Props ##

## Behavior ##

*/

<template>
  <!-- Modal dialog pour afficher le mode multijoueurs -->
  <b-modal
    id="modalmultiplayers"
    ref="modalmultiplayers"
    :hide-footer="true"
    title="Mode multijoueurs"
  >
    <div class="container-fluid">
      <div v-if="currentGameRoom!=''" class="row text-left align-items-center">
        <div class="col">
          <h5 class="card-title text-left">
            Partie en cours : <i>{{ currentGameRoom }}</i>
          </h5>
        </div>
      </div>
      <div v-if="isMultiPlayer" class="row text-right align-items-center">
        <div class="ml-auto col-auto">
          <b-button @click="hideModal();$router.push({ name: 'Mainboard' })" variant="primary">Jouer maintenant</b-button>
          <b-button @click="leave_game()">Quitter la partie</b-button>
        </div>
      </div>
      <div v-if="!isMultiPlayer" class="row text-left">
        <div class="col">
          <h5 class="card-title text-left">Créer une nouvelle partie</h5>
          <b-form>
            <b-form-group
              id="gameTypeForm"
              label="Nom du jeu :"
              label-cols-xl="4"
              label-cols-lg="3"
              label-for="create_game_room"
            >
              <b-form-input
                id="create_game_room"
                v-model.trim="newGame"
                type="text"
                class=""
                maxlength="30"
                placeholder="La partie de Max"
                :state="newGameValid"
                v-on:blur="validate()"
              />
              <b-form-invalid-feedback>
                Une petite seconde...<br>Pouvez-vous donner un petit nom à votre partie&nbsp;?
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="gameTypeForm"
              label="Type de partie :"
              label-cols-xl="4"
              label-cols-lg="3"
              label-for="game_type_select"
            >
              <b-form-select id="game_type_select" 
                v-model="gameModeForm" 
                :state="gameModeValid"
                @input="validate()"
              >
                <option value="" selected disabled="">Sélectionnez un type de jeu</option>
                <option value="godMode">Vous seul pouvez ajouter des cartes</option>
                <option value="allPlayersMode">Tous les joueurs peuvent proposer des cartes</option>
                <!-- <option value="asyncMode" disabled>Proposer un plateau que d'autres joueurs doivent deviner</option> -->
              </b-form-select>
              <b-form-invalid-feedback>
                Juste... pouvez-vous choisir le type de partie que vous voulez jouer&nbsp;? S'il vous plaît&nbsp;?
              </b-form-invalid-feedback>
            </b-form-group>
            <div class="text-right">
              <b-button v-if="newGame in gameRooms" @click="join_game(newGame)" variant="light">
                Rejoindre
              </b-button>
              <b-button v-else @click="create_game(newGame)" variant="primary">
                Créer
              </b-button>
            </div>
          </b-form>
          <div v-if="Object.keys(multiplayersGameModes).length">
            <hr>
            <h5 class="card-title text-left">
              Rejoindre une partie
            </h5>
            <div class="container-fluid">
              <div
                v-for="(game_room, key, index) in multiplayersGameModes"
                :key="index"
                class="row text-left align-items-center my-2"
              >
                <div class="col-lg-1 d-none d-lg-block p-0">
                  <img
                    :src="require('@/assets/images/bullet-puzzle.png')"
                    style="max-height:20px;"
                  >
                </div>
                <div class="col-8 p-0" style="line-height: initial;">
                  {{ key }}<br><small><i>{{ game_room.mode == 'godMode' ? "Jeu géré par l'organisateur" : "Jeu ouvert à tous les participants" }}</i></small>
                </div>
                <div class="col-3 p-0">
                  <b-button @click="join_game(key)" type="submit" variant="light">Rejoindre</b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import $socket from '@/websocket-instance.js'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'ModalMultiplayers',
  components: { },
  props: { },
  data: function () {
    return {
      newGame: '',
      submitStatus: null,
      newGameValid: null,
      gameModeForm: '',
      gameModeValid: null
    }
  },
  computed: {
    ...mapState ({
      guessCards: state => state.cards.guessCards,
      isMultiPlayer: state => state.game.isMultiPlayer,
      currentGameRoom: state => state.game.currentGameRoom,
      gameMode: state => state.game.gameMode,
      gameRooms: state => state.game.gameRooms,
      gameModeIsGod: state => state.game.gameModeIsGod
    }),
    ...mapGetters(['user']),
    multiplayersGameModes: function () {
      var filteredGames = {}
      for (var el in this.gameRooms) {
        if (this.gameRooms[el].mode !== 'asyncMode') {
          filteredGames[el] = this.gameRooms[el]
        }
      }
      return filteredGames
    }
  },
  methods: {
    ...mapMutations([
      'setGameMode',
      'setIsMultiPlayer',
      'setCurrentGameRoom',
      'setGameModeIsGod'
    ]),
    validate: function() {
      // validate form
      this.newGameValid = !(this.newGame.length === 0)
      this.gameModeValid = !(this.gameModeForm === '')
    },
    create_game: function (newGame) {
      console.log('creating game: ', newGame)
      // check if form is valid
      this.validate()
      if (!this.newGameValid || !this.gameModeValid) {
        return false
      }
      // reset form validation
      this.newGameValid = null
      this.gameModeValid = null
      // register this new game as the current game room
      this.setCurrentGameRoom(newGame)
      // set god mode by default if nothing selected
      this.gameModeForm = this.gameModeForm === '' ? this.setGameMode('godMode') : this.gameModeForm
      this.setGameMode(this.gameModeForm)
      // game creator is God by default
      this.setGameModeIsGod(true)
      // create a new game server-side
      console.log('emit create_game')
      $socket.emit('create_game', {
        'currentGameRoom': this.newGame,
        'guessCards': this.guessCards,
        'gameMode': this.gameMode,
        'player': this.user.displayName
      })
      // push current guess cards to the server
      EventBus.$emit('update-cards')
      // activate multiplayer mode
      this.setIsMultiPlayer(true)
    },
    join_game: function (game) {
      console.log('joining game: ', game)
      // register this game as the current game room
      this.setCurrentGameRoom(game)
      // activate multiplayer mode
      this.setIsMultiPlayer(true)
      // set current gameMode
      console.log('current game: ', this.gameRooms[game])
      this.setGameMode(this.gameRooms[game]['mode'])
      // join the game server side
      $socket.emit('join_game', {
        'game': game,
        'player': this.user.displayName
      })
    },
    leave_game: function () {
      console.log('leaving game: ', this.currentGameRoom)
      // tell the server we're leaving the game
      $socket.emit('leave_game', {
        'game': this.currentGameRoom,
        'player': this.user.displayName
      })
      // reset current game room
      this.setCurrentGameRoom('')
      // deactivate multiplayer mode
      this.setIsMultiPlayer(false)
      // reset current gameMode
      this.setGameMode('')
      // reset god credentials
      this.setGameModeIsGod(false)
    },
    hideModal: function () {
      this.$refs.modalmultiplayers.hide()
    }
  }
}
</script>

<style scoped >
</style>
