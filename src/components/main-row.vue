/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
  <div id="main-row">
    <div class="container-body">
      <div id="alert-messages" class="row">
        <div class="col-12">
          <b-alert
            :show="dismissCountDown"
            dismissible
            fade
            variant="danger"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged"
          >
            Désolé, seul l'organisateur de la partie peut modifier les cartes
          </b-alert>
        </div>
      </div>
      <div id="header-row" class="row">
        <!-- hide on screens smaller than lg / md / sm -->
        <div class="col-2 d-none d-sm-block">
          <ConceptCard />
        </div>
        <!-- show only on mobile -->
        <div class="col-1 d-sm-none" />
        <div class="col-10">
          <!-- show all the concept by row, one color each -->
          <!-- eslinnt-disable-next-line vue/use-v-on-style -->
          <div
            v-for="(color, index) in sharedState.colors"
            :key="index"
            :id="color"
            :class="{ 'active': color == sharedState.selectedColor }"
            @:click="sharedState.selectedColor = color"
            :droppable="sharedState.gameModeAllowChange"
            v-on:dragover="dragover"
            v-on:dragenter="dragenter"
            v-on:drop="drop"
            class="row align-items-center rounded shadow-sm guess-row"
          >
            <div class="col-auto guess-icon">
              <font-awesome-icon
                :icon="index == 0 ? 'question-circle' : 'exclamation-circle'"
                :color="color"
                size="2x"
              />
            </div>
            <transition-group
              name="fade"
              class="guess-cards"
            >
              <div
                v-for="(card, index) in sharedState.guessCards[color]"
                :key="index + 1"
                class="card"
              >
                <Card
                  :store="store"
                  :card-info="card"
                  :icon-color="color"
                  add-or-remove="remove"
                />
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import ConceptCard from '@/components/concept-card'
import Card from '@/components/card'

export default {
  name: 'MainRow',
  components: { Card, ConceptCard },
  props: {
    store: {
      type: Object,
      default: function () {
        return {}
      }
    },
    type: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
      sharedState: this.store.state,
      dismissSecs: 5,
      dismissCountDown: 0,
      showDismissibleAlert: false
    }
  },
  created () {
    // initialize the Guess Cards arrays
    this.initGuessCards()
    // listen to events
    EventBus.$on('add-icon', data => this.addIcon(data))
    EventBus.$on('remove-icon', data => this.removeIcon(data))
    EventBus.$on('update-cards', data => this.pushWebsocket())
    EventBus.$on('init-guess-cards', data => this.initGuessCards())
  },
  methods: {
    addIcon: function (data) {
      // Name, Tooltip_fr
      // check if user is allowed to change guess cards
      if (!this.sharedState.gameModeAllowChange) { return false }
      // first time a color is called, need to create the empty array
      if (this.sharedState.guessCards[this.sharedState.selectedColor] == null) {
        this.sharedState.guessCards[this.sharedState.selectedColor] = []
      }
      this.sharedState.guessCards[this.sharedState.selectedColor].push(data)
      this.pushWebsocket()
    },
    removeIcon: function (data) {
      // check if user is allowed to change guess cards
      if (!this.sharedState.gameModeAllowChange) { return false }
      // remove clicked icon 
      // color row depends from the call 
      // if dragged, use color from data, else, use active color
      var cardColor = Object.keys(this.sharedState.cardDragged).length > 0 ? data.color : this.sharedState.selectedColor
      this.sharedState.guessCards[cardColor] = this.sharedState.guessCards[cardColor].filter(
        function (obj) {
          return !(obj.Name === data.Name)
        })
      this.pushWebsocket()
    },
    // initialize an empty array to be pushed for every color
    initGuessCards: function () {
      var obj = {}
      for (var i = 0; i < this.sharedState.colors.length; i++) {
        obj[this.sharedState.colors[i]] = []
      }
      this.sharedState.guessCards = obj
      this.pushWebsocket()
    },
    pushWebsocket: function () {
      // if playing in multiplayer mode, push the info to the websocket server
      if (this.sharedState.isMultiPlayer) {
        // console.log("updated info on the websocket server: ", this.sharedState.guessCards)
        this.$socket.emit('update_cards_from_client', {
          'currentGameRoom': this.sharedState.currentGameRoom,
          'guessCards': this.sharedState.guessCards
        })
      }
    },
    dragenter: function (ev) {
      ev.preventDefault()
    },
    dragover: function (ev) {
      // set current color as the div being dragged over to set active class
      this.sharedState.selectedColor = ev.target.id
      ev.preventDefault()
    },
    drop: function (ev) {
      // if user is allowed to change state, add icon nto current color row
      if (this.sharedState.gameModeAllowChange) {
        this.addIcon(this.sharedState.cardDragged)
      } else {
        // display error message, user is not allowed to change cards
        this.dismissCountDown = this.dismissSecs
        // alert("Dans ce mode de jeu, vous n'êtes pas autorisé à changer les cartes, désolé.")
      }
      ev.preventDefault()
      // return true
    },
    countDownChanged: function(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    }
  },
  sockets: {
    connect () {
      // console.log('connected to main server')
    },
    update_cards_from_server (data) {
      console.log('server asked to update cards: ', data)
      // if this is current game, then update the cards
      if (data.currentGameRoom === this.sharedState.currentGameRoom) {
        this.sharedState.guessCards = data.guessCards
      }
    },
    update_game_rooms (data) {
      console.log('updating game rooms: ', data)
      this.sharedState.gameRooms = data.game_rooms
      // toast message when player joined or left the game
      if (data.game === this.sharedState.currentGameRoom) {
        if (data.playerJoined !== undefined) {
          this.$toast.info(data.playerJoined + ' a rejoint la partie')
        }
        if (data.playerLeft !== undefined) {
          this.$toast.info(data.playerLeft + ' a quitté la partie')
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.guess-cards {
  display: contents;
}
.guess-icon {
  padding: 0px 5px 0px 5px !important;
}
.guess-row {
  min-height: 50px;
  cursor: pointer;
  margin: 0 0 14px 0;
}
.active {
  background-color: #e9ecef;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
