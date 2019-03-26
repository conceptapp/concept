/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
  <div id="main-row">
    <div class="container-body">
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
            v-for="(color, index) in colors"
            :key="index"
            :id="color"
            :class="{ 'active': color == selectedColor }"
            @:click="this.setCurrentColor(color)"
            :droppable="gameModeAllowChange"
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
                v-for="(card, index) in guessCards[color]"
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
import { mapState, mapMutations } from 'vuex'
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
    this.$store.dispatch('initGuessCards')
    // listen to events
    EventBus.$on('add-icon', data => this.addIcon(data))
    EventBus.$on('remove-icon', data => this.removeIcon(data))
    // EventBus.$on('update-cards', data => this.pushWebsocket())
    // EventBus.$on('init-guess-cards', data => this.initGuessCards())
    EventBus.$on('init-guess-cards', data => this.$store.dispatch('initGuessCards'))
  },
  computed: mapState ({
    colors: state => state.cards.colors,
    selectedColor: state => state.cards.selectedColor,
    cards: state => state.cards.cards,
    guessCards: state => state.cards.guessCards,
    cardDragged: state => state.cards.cardDragged,
    gameModeAllowChange: state => state.game.gameModeAllowChange,
    currentGameRoom: state => state.game.currentGameRoom
  }),
  methods: {
    ...mapMutations([
      'pushGuessCards',
      'setGuessCards',
      'removeGuessCards',
      'setCurrentColor',
      'setGameRooms'
    ]),
    addIcon: function (data) {
      // Name, Tooltip_fr
      // check if user is allowed to change guess cards
      if (!this.gameModeAllowChange) { return false }
      this.pushGuessCards({ 'color': this.selectedColor, 'cards': data })
    },
    removeIcon: function (data) {
      // check if user is allowed to change guess cards
      if (!this.gameModeAllowChange) { return false }
      // remove clicked icon 
      // color row depends from the call 
      // if dragged, use color from data, else, use active color
      var cardColor = Object.keys(this.cardDragged).length > 0 ? data.color : this.selectedColor
      this.removeGuessCards({ 'color': cardColor, 'cards': data })
    },
    dragenter: function (ev) {
      ev.preventDefault()
    },
    dragover: function (ev) {
      // set current color as the div being dragged over to set active class
      // selectedColor = ev.target.id
      this.setCurrentColor(ev.target.id)
      ev.preventDefault()
    },
    drop: function (ev) {
      // if user is allowed to change state, add icon nto current color row
      if (this.gameModeAllowChange) {
        this.addIcon(this.cardDragged)
      } else {
        // display error message, user is not allowed to change cards
        // this.dismissCountDown = this.dismissSecs
        this.sharedState.alerts.push({
          msg: "Désolé, seul l'organisateur de la partie peut modifier les cartes",
          dismissCountDown: 5,
          variant: 'danger'
        })
        // alert("Dans ce mode de jeu, vous n'êtes pas autorisé à changer les cartes, désolé.")
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
      // if this is current game, then update the cards but don't update server to avoid infinite loop
      if (data.currentGameRoom === this.currentGameRoom) {
        // this.sharedState.guessCards = data.guessCards
        this.setGuessCards({ 'guessCards': data.guessCards, 'updateServer': false })
      }
    },
    update_game_rooms (data) {
      console.log('updating game rooms: ', data)
      this.setGameRooms(data.game_rooms)
      // toast message when player joined or left the game
      if (data.game === this.currentGameRoom) {
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
