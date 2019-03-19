/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
	<div id="main-row">
    <menuBar
      v-bind:store="store"
    > </menuBar>
    <div class="container-body">
      <div id="header-row" class="row">
        <!-- hide on screens smaller than lg / md / sm -->
        <div class="col-2 d-none d-sm-block">
          <conceptCard></conceptCard>
        </div>
        <!-- show only on mobile -->
        <div class="col-1 d-sm-none"></div>
        <div class="col-10">
          <!-- show all the concept by row, one color each -->
          <div
            v-for="(color, index) in sharedState.colors"
            :id="color"
            class="row align-items-center rounded shadow-sm guess-row"
            v-bind:class="{ 'active': color == sharedState.selectedColor }"
            v-on:click="sharedState.selectedColor = color"
            :droppable="sharedState.gameModeAllowChange"
            v-on:dragover="dragover"
            v-on:dragenter="dragenter"
            v-on:drop="drop"
          >
            <div class="col-auto guess-icon">
              <font-awesome-icon v-bind:icon="index == 0 ? 'question-circle' : 'exclamation-circle'" size="2x" :color="color" />
            </div>
            <transition-group name="fade" class="guess-cards">
              <div v-for="(card, index) in sharedState.guessCards[color]" :key="index" class="card">
                <card
                	v-bind:store="store"
                  v-bind:cardInfo="card"
                  v-bind:iconColor="color"
                  addOrRemove="remove"
                ></card>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
    <modals 
      v-bind:store="store"
    ></modals>
  </div>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import conceptCard from '@/components/concept-card'
import menuBar from '@/components/menu-bar'
import card from '@/components/card'
import modals from '@/components/modals'


export default {
  name: 'mainRow',
  components: { card, ConceptCard, modals, menuBar },
  props: ['store', 'type'],
  data: function () {
    return { 
      sharedState: this.store.state
    }
  },
  methods: {
    addIcon: function (data) {
      // Name, Tooltip_fr
      // first time a color is called, need to create the empty array
      if (this.sharedState.guessCards[this.sharedState.selectedColor] == null) {
        this.sharedState.guessCards[this.sharedState.selectedColor] = []
      }
      this.sharedState.guessCards[this.sharedState.selectedColor].push(data)
      this.pushWebsocket()
    },
    removeIcon: function(data) {
      // remove clicked icon from current active color
      this.sharedState.guessCards[this.sharedState.selectedColor] = this.sharedState.guessCards[this.sharedState.selectedColor].filter( 
        function(obj) {
          return !(obj.Name == data.Name)
      })
      this.pushWebsocket()
    },
    // initialize an empty array to be pushed for every color
		initGuessCards: function() {
		  var obj = {}
		  for (var i = 0; i < this.sharedState.colors.length; i++) {
		    obj[this.sharedState.colors[i]] = []
		  }
		  return obj
		},
    pushWebsocket: function() {
      // if playing in multiplayer mode, push the info to the websocket server
      if ( this.sharedState.isMultiPlayer ) {
        // console.log("updated info on the websocket server: ", this.sharedState.guessCards)
        this.$socket.emit('update_cards_from_client', { 
          'currentGameRoom': this.sharedState.currentGameRoom,
          'guessCards': this.sharedState.guessCards
        })
      }
    },
    dragenter: function(ev) {
      ev.preventDefault()
    },
    dragover: function(ev) {
      // set current color as the div being dragged over to set active class
      this.sharedState.selectedColor = ev.target.id
      ev.preventDefault()
    },
    drop: function(ev) {
      // if user is allowed to change state, add icon nto current color row
      if (this.sharedState.gameModeAllowChange) { 
        this.addIcon(this.sharedState.cardDragged) 
      } else {
        alert("Dans ce mode de jeu, vous n'êtes pas autorisé à changer les cartes, désolé.")
      }
      ev.preventDefault()
      // return true
    }
  },
  sockets: {
    connect () {
      // console.log('connected to main server')
    },
    update_cards_from_server (data) {
      console.log('server asked to update cards: ', data)
      // if this is current game, then update the cards
      if (data.currentGameRoom == this.sharedState.currentGameRoom) {
        this.sharedState.guessCards = data.guessCards
      }
    },
    update_game_rooms (data) {
      console.log("updating game rooms: ", data)
      this.sharedState.gameRooms = data
    }
  },
  created () {
    // initialize the Guess Cards arrays
    this.sharedState.guessCards = this.initGuessCards()
    // listen to events
    EventBus.$on('add-icon', data => this.addIcon(data))
    EventBus.$on('remove-icon', data => this.removeIcon(data))
    EventBus.$on('update-cards', data => this.pushWebsocket())
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