/*

### Component ###
This component displays a concept card

## Props ##
cards: all the cards of the game
card_id: the currentn card to be displayed

## Behavior ##

*/

<template>
  <section>
    <b-row no-gutters>
      <div
        @click="tooltipShown = !tooltipShown"
        :draggable="isBoardEditable"
        v-on:dragstart="dragstart"
        v-on:dragend="dragend"
        class="col-auto concept-icon"
      >
        <img
          :src="icon"
          :alt="cardInfo.Tooltip_fr"
          v-b-tooltip.hover.top
          :title="cardInfo.Tooltip_fr"
        >
      </div>
      <transition name="fade">
        <b-col v-show="tooltipShown">
          <div class="container-fluid tooltip-row">
            <b-row class="row align-items-center tooltip-row">
              <div class="col-auto px-1 px-sm-2">
                <p class="card-text">{{cardInfo.Tooltip_fr}}</p>
              </div>
              <div
                v-if="addOrRemove == 'add' && isBoardEditable"
                @click="tooltipShown = !tooltipShown;changeIcon('add-icon', cardInfo)"
                class="col-auto px-1 px-sm-2 icon-pointer"
              >
                <font-awesome-icon :color="selectedColor" icon="plus-circle" size="2x" />
              </div>
              <div
                v-if="addOrRemove == 'remove' && isBoardEditable"
                @click="tooltipShown = !tooltipShown;changeIcon('remove-icon', cardInfo)"
                class="col-auto px-1 px-sm-2 icon-pointer"
              >
                <font-awesome-icon :color="iconColor" icon="trash" size="2x" />
              </div>
            </b-row>
          </div>
        </b-col>
      </transition>
    </b-row>
  </section>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'Card',
  props: {
    cardInfo: {
      type: Object,
      default: function () {
        return {}
      }
    },
    addOrRemove: {
      type: String,
      default: 'add'
    },
    iconColor: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      tooltipShown: false
    }
  },
  computed: {
    ...mapState ({
      selectedColor: state => state.cards.selectedColor,
      cardDragged: state => state.cards.cardDragged,
      gameMode: state => state.game.gameMode,
      gameModeIsGod: state => state.game.gameModeIsGod
    }),
    ...mapGetters([
      'isBoardEditable'
    ]),
    icon: function () {
      return require('../assets/images/cards/' + this.cardInfo.type + '/' + this.cardInfo.Name + '.png')
    }
  },
  methods: {
    ...mapMutations([
      'setCardDragged'
    ]),
    changeIcon: function (addOrRemove, data) {
      // EventBus.$emit('remove-icon', cardInfo)
      EventBus.$emit(addOrRemove, data)
    },
    dragstart: function (ev) {
      // add current icon color (if empty, card comes from type rows, if color is set, card comes from guess row)
      this.cardInfo['color'] = this.iconColor
      // store the current card dragged
      this.setCardDragged(this.cardInfo)
    },
    dragend: function (ev) {
      // if card is dragged from guess row, remove card
      if (this.cardDragged['color'] !== '') {
        EventBus.$emit('remove-icon', this.cardInfo)
      }
      // reset current dragged card
      this.setCardDragged({})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-text {
  white-space: pre-wrap;
  font-size: 0.9em;
  line-height: 1.1;
  text-align: left;
}
.concept-icon, .icon-pointer {
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.tooltip-row {
  height: 100%;
}
</style>
