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
<!--       <div class="row text-left">
        <div v-if="!playerNameValid" class="col">
          <h5 class="card-title text-left">Quel est votre nom ?</h5>
          <b-form-group id="playerNameForm">
            <b-form-input
              id="get_player_name"
              v-model.trim="playerName"
              type="text"
              class=""
              maxlength="30"
              placeholder="John Doe"
              :state="playerNameValid"
            />
            <b-form-invalid-feedback>
              On y est presque...<br>Pouvez-vous me donner un petit nom d'au moins 2 caractères&nbsp;?
            </b-form-invalid-feedback>
          </b-form-group>
          <div class="text-right">
            <b-button @click="validate_player_form()" variant="primary">
                Valider
            </b-button>
          </div>
        </div>
      </div> -->
      <div v-if="sharedState.currentGameRoom!=''" class="row text-left align-items-center">
        <div class="col">
          <h5 class="card-title text-left">
            Partie en cours : <i>{{ sharedState.currentGameRoom }}</i>
          </h5>
        </div>
      </div>
      <div v-if="sharedState.isMultiPlayer" class="row text-right align-items-center">
        <div class="ml-auto col-auto">
          <b-button @click="hideModal" variant="primary">Jouer maintenant</b-button>
          <b-button @click="leave_game()">Quitter la partie</b-button>
        </div>
      </div>
      <div v-if="!sharedState.isMultiPlayer" class="row text-left">
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
                v-model="sharedState.gameMode" 
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
              <b-button v-if="newGame in this.sharedState.gameRooms" @click="join_game(newGame)" variant="light">
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

export default {
  name: 'ModalMultiplayers',
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
      newGame: '',
      // playerName: '',
      submitStatus: null,
      newGameValid: null,
      gameModeValid: null
      // playerNameValid: null
    }
  },
  computed: {
    multiplayersGameModes: function () {
      var filteredGames = {}
      for (var el in this.sharedState.gameRooms) {
        if (this.sharedState.gameRooms[el].mode !== 'asyncMode') {
          filteredGames[el] = this.sharedState.gameRooms[el]
        }
      }
      return filteredGames
    }
  },
  methods: {
    // validate_player_form: function() {
    //   this.playerNameValid = this.playerName.length > 1
    //   this.sharedState.playerName = this.playerName
    // },
    validate: function() {
      // validate form
      this.newGameValid = !(this.newGame.length === 0)
      this.gameModeValid = !(this.sharedState.gameMode === '')
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
      this.sharedState.currentGameRoom = newGame
      // set god mode by default if nothing selected
      if (this.sharedState.gameMode === '') { this.sharedState.gameMode = 'godMode' }
      // game creator is God by default
      this.sharedState.gameModeIsGod = true
      // create a new game server-side
      console.log('emit create_game')
      this.$socket.emit('create_game', {
        'currentGameRoom': this.newGame,
        'guessCards': this.sharedState.guessCards,
        'gameMode': this.sharedState.gameMode,
        'player': this.playerName
      })
      // push current guess cards to the server
      EventBus.$emit('update-cards')
      // activate multiplayer mode
      this.sharedState.isMultiPlayer = true
    },
    join_game: function (game) {
      console.log('joining game: ', game)
      // register this game as the current game room
      this.sharedState.currentGameRoom = game
      // activate multiplayer mode
      this.sharedState.isMultiPlayer = true
      // set current gameMode
      console.log('current game: ', this.sharedState.gameRooms[game])
      this.sharedState.gameMode = this.sharedState.gameRooms[game]['mode']
      // join the game server side
      this.$socket.emit('join_game', {
        'game': game,
        'player': this.playerName
      })
    },
    leave_game: function () {
      console.log('leaving game: ', this.sharedState.currentGameRoom)
      // tell the server we're leaving the game
      this.$socket.emit('leave_game', {
        'game': this.sharedState.currentGameRoom,
        'player': this.playerName
      })
      // reset current game room
      this.sharedState.currentGameRoom = ''
      // deactivate multiplayer mode
      this.sharedState.isMultiPlayer = false
      // reset current gameMode
      this.sharedState.gameMode = ''
      // reset god credentials
      this.sharedState.gameModeIsGod = false
    },
    hideModal: function () {
      this.$refs.modalmultiplayers.hide()
    }
  }
}
</script>

<style scoped >
</style>
