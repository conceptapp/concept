/*

### Component ###
This component displays a concept card

## Props ##
cards: all the cards of the game
card_id: the currentn card to be displayed

## Behavior ##
TODO add rollover to display tooltip

*/

<template>
  <section>
    <div class="row no-gutters">
      <div
        @click="tooltipShown = !tooltipShown"
        :draggable="gameModeAllowChange"
        v-on:dragstart="dragstart"
        v-on:dragend="dragend"
        class="col-auto concept-icon"
      >
        <!-- v-on:dragover="dragover"
        v-on:dragenter="dragenter" -->
        <img
          :src="icon"
          :alt="cardInfo.Tooltip_fr"
          :title="cardInfo.Tooltip_fr"
        >
      </div>
      <transition name="fade">
        <div
          v-show="tooltipShown"
          class="col"
        >
          <div class="container-fluid tooltip-row">
            <div class="row align-items-center tooltip-row">
              <div class="col-auto px-1 px-sm-2">
                <p
                  v-html="cardInfo.Tooltip_fr"
                  class="card-text"
                />
              </div>
              <div
                v-if="addOrRemove == 'add' && gameModeAllowChange"
                @click="tooltipShown = !tooltipShown;changeIcon('add-icon', cardInfo)"
                class="col-auto px-1 px-sm-2 icon-pointer"
              >
                <font-awesome-icon
                  :color="sharedState.selectedColor"
                  icon="plus-circle"
                  size="2x"
                />
              </div>
              <div
                v-if="addOrRemove == 'remove' && gameModeAllowChange"
                @click="tooltipShown = !tooltipShown;changeIcon('remove-icon', cardInfo)"
                class="col-auto px-1 px-sm-2 icon-pointer"
              >
                <font-awesome-icon
                  :color="iconColor"
                  icon="trash"
                  size="2x"
                />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import { EventBus } from '@/event-bus.js'

export default {
  name: 'Card',
  props: {
    store: {
      type: Object,
      default: function () {
        return {}
      }
    },
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
      default: '#10C177'
    }
  },
  data: function () {
    return {
      tooltipShown: false,
      sharedState: this.store.state
    }
  },
  computed: {
    icon: function () {
      return require('../assets/images/cards/' + this.cardInfo.type + '/' + this.cardInfo.Name + '.png')
    },
    gameModeAllowChange: {
      // getter
      get: function () {
        return this.sharedState.gameModeAllowChange
      },
      // setter
      set: function () {
        // if game mode is godMode, check if user is God to be allowed to remove cards
        this.sharedState.gameModeAllowChange = !(this.sharedState.gameMode === 'godMode' && !this.sharedState.gameModeIsGod)
        // console.log(this.sharedState.gameMode === 'godMode', !this.sharedState.gameModeIsGod, this.sharedState.gameModeAllowChange)
      }
    }
  },
  methods: {
    changeIcon: function (addOrRemove, data) {
      // EventBus.$emit('remove-icon', cardInfo)
      EventBus.$emit(addOrRemove, data)
    },
    dragstart: function (ev) {
      // store the current card dragged
      this.sharedState.cardDragged = this.cardInfo
    },
    dragend: function (ev) {
      // reset current dragged card
      this.sharedState.cardDragged = {}
    }
    // drop: function(ev) {
    //   console.log('drop: ', ev)
    //   console.log(this.sharedState.cardDragged)
    //   ev.preventDefault
    //   return true
    // },
    //     dragenter: function(ev) {
    //       // console.log('dragenter: ', ev)
    // //    this.$el.insertBefore this._placeholder, posElem.nextSibling
    //       ev.preventDefault
    //       return true
    //     },
    //     dragover: function(ev) {
    //       // console.log('dragover: ', ev)
    //     }
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
