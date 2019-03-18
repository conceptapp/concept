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
      <div class="col-auto concept-icon" v-on:click="tooltipShown = !tooltipShown">
        <img v-bind:src="icon" v-bind:alt="cardInfo.Tooltip_fr" v-bind:title="cardInfo.Tooltip_fr" />
      </div>
      <transition name="fade">
        <div v-show="tooltipShown" class="col">
          <div class="container-fluid tooltip-row">
            <div class="row align-items-center tooltip-row">
              <div class="col-auto px-1 px-sm-2">
                <p class="card-text" v-html="cardInfo.Tooltip_fr"></p>
              </div>
              <div v-if="addOrRemove == 'add' && isGod" class="col-auto px-1 px-sm-2 icon-pointer" v-on:click="tooltipShown = !tooltipShown;changeIcon('add-icon', cardInfo)">
                <font-awesome-icon icon="plus-circle" size="2x" :color="sharedState.selectedColor" />
              </div>
              <div v-if="addOrRemove == 'remove' && isGod" class="col-auto px-1 px-sm-2 icon-pointer" v-on:click="tooltipShown = !tooltipShown;changeIcon('remove-icon', cardInfo)">
                <font-awesome-icon icon="trash" size="2x" :color="iconColor" />
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
  name: 'card',
  props: ['store', 'cardInfo', 'addOrRemove', 'iconColor'], // 'selectedColor', 
  methods: {
    changeIcon: function(addOrRemove, data) {
      // EventBus.$emit('remove-icon', cardInfo)
      EventBus.$emit(addOrRemove, data)
    }
  },
  data: function () {
    return { 
      tooltipShown: false,
      sharedState: this.store.state
    }
  },
  computed: {
    icon: function() {
      return require('../assets/images/cards/' + this.cardInfo.type + '/' + this.cardInfo.Name + '.png')
    },
    isGod: function() {
      // if game mode is godMode, check if user is God to be allowed to remove cards
      if (this.sharedState.gameMode == 'godMode' && !this.sharedState.gameModeIsGod) { return false }
      return true
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
