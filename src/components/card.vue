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
    <div>
      <img v-bind:src="icon" v-bind:alt="arrCard.Tooltip_fr" v-bind:title="arrCard.Tooltip_fr" /> 
    </div>
  </section>
</template>

<script>
export default {
  name: 'card',
  props: ['cards', 'cardId', 'type'],
  methods: {
  },
  data: function () {
    return {
    }
  },
  computed: {
    arrCard: function() {
      var arr = this.cards.find(obj => {
        return obj.id === this.cardId
      })
      // console.log(this.cards)
      if (arr == null) {console.log(this.cardId)}
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
.card {
}
</style>
