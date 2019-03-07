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
    <div class="row no-gutters concept-icon" v-on:click="tooltipShown = !tooltipShown">
      <div class="col-auto">
        <img v-bind:src="icon" v-bind:alt="arrCard.Tooltip_fr" v-bind:title="arrCard.Tooltip_fr" />
      </div>
      <transition name="fade">
        <div v-show="tooltipShown" class="col">
          <div class="card-block px-2">
            <p class="card-text" v-html="arrCard.Tooltip_fr"></p>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'card',
  props: ['cards', 'cards2', 'cardId', 'type'],
  methods: {
  },
  data: function () {
    return { 
      tooltipShown: false
    }
  },
  computed: {
    arrCard: function() {
      // console.log("this.cards: ", this.cards)
      var arr = this.cards.find(obj => {
        return obj.id === this.cardId
      })
      // console.log("Array", arr)
      if (arr == null) {
        // console.log(this.cardId)
        var arr = this.cards2.find(obj => {
          return obj.id === this.cardId
        })
      }
      // console.log("Finall arr: ", arr)
      return arr.fields
    },
    icon: function() {
      return require('../assets/images/cards/' + this.type + '/' + this.arrCard.Name + '.png')
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
.concept-icon {
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
