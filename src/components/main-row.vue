/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
  <div id="main-row">
    <div class="container-body">
      <b-row id="header-row" align-v="center">
        <!-- displays an overlay explanation when playing boardPlay -->
        <!-- hide on screens smaller than lg / md / sm -->
        <b-col v-if="gameMode==='boardPlay' && !isPlayingBoard" class="overlay d-none d-sm-block">
          <h4 class="rounded shadow-sm p-2 mb-2" style="background-color: #f0f0f0">Bienvenue dans le mode "tour à tour"</h4>
          <p class="text-left">Vous allez découvrir un plateau de jeu préparé par un autre joueur, ces icônes doivent vous permettre de trouver le mot caché. Vous pouvez proposer autant de mots que vous le souhaitez, soyez le plus rapide et comparez vous ensuite aux autres joueurs.</p>
          <p class="text-left d-none d-lg-block">Vous pouvez mettre en pause le jeu ou le reprendre plus tard grâce aux boutons disponibles sous le chronomètre. Vous pouvez également demander un indice (s'ils sont disponibles pour ce plateau de jeu), le nombre d'indices utilisés pour trouver sera affiché dans le classement final.</p>
          <p class="text-middle">
            <b-button @click="chrono()" variant="primary" class="mt-3">
              {{isPlayingBoard===null ? 'Démarrer le jeu' : 'Reprendre le jeu'}}
            </b-button>
          </p>
        </b-col>
        <!-- hide on screens smaller than lg / md / sm -->
        <b-col v-if="isBoardEditable" cols="2" class="d-none d-sm-block">
          <ConceptCard />
        </b-col>
        <!-- show only on mobile -->
        <b-col cols="1" class="d-sm-none" />
        <b-col>
          <!-- show all the concept by row, one color each -->
          <!-- eslinnt-disable-next-line vue/use-v-on-style -->
          <div
            v-for="(color, index) in colors"
            :key="index"
            :id="color"
            :class="{ 'active': color == selectedColor }"
            @click="setCurrentColor(color)"
            :droppable="isBoardEditable"
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
            <transition-group name="fade" class="guess-cards">
              <div
                v-for="(card, index) in guessCardsToDisplay[color]"
                v-if="gameMode!=='boardPlay' || gameModeDisplayBoard"
                :key="index + 1"
                class="card"
              >
                <Card
                  :card-info="card"
                  :icon-color="color"
                  add-or-remove="remove"
                />
              </div>
            </transition-group>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import ConceptCard from '@/components/concept-card'
import Card from '@/components/card'

export default {
  name: 'MainRow',
  components: { Card, ConceptCard },
  props: {
    type: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
      dismissSecs: 5,
      dismissCountDown: 0,
      showDismissibleAlert: false
    }
  },
  computed: {
    ...mapState ({
      colors: state => state.cards.colors,
      selectedColor: state => state.cards.selectedColor,
      cards: state => state.cards.cards,
      guessCards: state => state.cards.guessCards,
      cardDragged: state => state.cards.cardDragged,
      currentGameRoom: state => state.game.currentGameRoom,
      alerts: state => state.alerts.alerts,
      boards: state => state.game.boards,
      boardId: state => state.game.boardId,
      gameMode: state => state.game.gameMode,
      gameModeDisplayBoard: state => state.game.gameModeDisplayBoard,
      currentBoardGuessCards: state => state.game.currentBoardGuessCards,
      isPlayingBoard: state => state.game.isPlayingBoard
    }),
    ...mapGetters([
      'isBoardEditable'
    ]),
    guessCardsToDisplay: function() {
      return this.gameMode === 'boardPlay' ? this.currentBoardGuessCards : this.guessCards
    }
  },
  methods: {
    ...mapMutations([
      'pushGuessCards',
      'setGuessCards',
      'removeGuessCards',
      'setCurrentColor',
      'setGameRooms',
      'pushAlert',
      'setBoardId',
      'setIsPlayingBoard'
    ]),
    addIcon: function (data) {
      // Name, Tooltip_fr
      // check if user is allowed to change guess cards
      if (!this.isBoardEditable) { 
        // display error message, user is not allowed to change cards
        this.pushAlert({
          msg: "Désolé, seul l'organisateur de la partie peut modifier les cartes",
          dismissCountDown: 5,
          variant: 'danger'
        })
      } else {
        this.pushGuessCards({ 'color': this.selectedColor, 'cards': data })
      }
    },
    removeIcon: function (data) {
      // check if user is allowed to change guess cards
      if (!this.isBoardEditable) {
        // display error message, user is not allowed to change cards
        this.pushAlert({
          msg: "Désolé, seul l'organisateur de la partie peut modifier les cartes",
          dismissCountDown: 5,
          variant: 'danger'
        })
      } else {
        // remove clicked icon 
        // color row depends from the call 
        // if dragged, use color from data, else, use active color
        var cardColor = Object.keys(this.cardDragged).length > 0 ? data.color : this.selectedColor
        this.removeGuessCards({ 'color': cardColor, 'cards': data })
      }
    },
    chrono: function() {
      EventBus.$emit('boardplay-chrono')
    },
    dragenter: function (ev) {
      ev.preventDefault()
    },
    dragover: function (ev) {
      // set current color as the div being dragged over to set active class
      this.setCurrentColor(ev.target.id)
      ev.preventDefault()
    },
    drop: function (ev) {
      // try to add icon into current color row
      this.addIcon(this.cardDragged)
      ev.preventDefault()
    }
  },
  created () {
    // initialize the Guess Cards arrays
    this.$store.dispatch('initGuessCards')
    // set the first boardId and init card
    this.setBoardId(this.$route.params.boardId)
    // listen to events
    EventBus.$on('add-icon', data => this.addIcon(data))
    EventBus.$on('remove-icon', data => this.removeIcon(data))
    EventBus.$on('init-guess-cards', data => this.$store.dispatch('initGuessCards'))
  },  
  watch: {
    '$route' (to, from) {
      // react to route changes - update boardId
      this.setBoardId(this.$route.params.boardId)
    }
  },
  sockets: {
    connect () {
      // console.log('connected to main server')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#header-row{
  padding-right: 15px;
  position: relative;
}
.overlay {
  height: 100%;
  width:100%;
  background-color:rgba(255,255,255,0.85);
  position:absolute;
  z-index: 2;
}
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
