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
          <div class="container-fluid">
            <div class="row align-items-center">
              <div class="col px-2">
                <p class="card-text" v-html="cardInfo.Tooltip_fr"></p>
              </div>
              <div v-if="addOrRemove == 'add'" class="col icon-pointer" v-on:click="tooltipShown = !tooltipShown;$emit('add-icon', cardInfo)">
                <font-awesome-icon icon="plus-circle" size="2x" :color="color" />
              </div>
              <div v-if="addOrRemove == 'remove'" class="col icon-pointer" v-on:click="tooltipShown = !tooltipShown;$emit('remove-icon', cardInfo)">
                <font-awesome-icon icon="minus-circle" size="2x" :color="color" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'card',
  props: ['cardInfo', 'addOrRemove'],
  methods: {
  },
  data: function () {
    return { 
      tooltipShown: false,
      color: "green"
    }
  },
  computed: {
    icon: function() {
      return require('../assets/images/cards/' + this.cardInfo.type + '/' + this.cardInfo.Name + '.png')
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
.fa-circle-plus{
  color: green;
}
</style>
