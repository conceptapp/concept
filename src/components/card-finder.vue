/*

### Component ###
This component finds a concept card in the whole array
It calls the card component to display

## Props ##
cards: all the cards of the game
card_id: the currentn card to be displayed

## Behavior ##
TODO add rollover to display tooltip

*/

<template>
  <section>
    <card 
      v-bind:cardInfo="arrCard"
      addOrRemove="add"
      v-on:add-icon="addIcon"
    ></card>
  </section>
</template>

<script>
import card from '@/components/card'

export default {
  name: 'cardFinder',
  components: { card },
  props: ['cards', 'cards2', 'cardId', 'type'],
  methods: {
    addIcon: function(data) {
      this.$emit('add-icon', data)
    }
  },
  data: function () {
    return { }
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
      // append the type of the card to the array
      arr.fields['type'] = this.type
      return arr.fields
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
