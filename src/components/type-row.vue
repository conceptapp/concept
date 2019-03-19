/*

### Component ###
This component finds a concept card in the whole array
It calls the card component to display

## Props ##
cards: all the cards of the game
type: the current type object of the row
selectedColor: the current selected color

## Behavior ##
On click, display tooltip next to the icon

*/

<template>
  <section>
    <div class="row"> 
      <span class="font-weight-bold">{{type.fields.Title_fr}}</span>
    </div>
    <div class="row">
      <!-- for each type, display the concept icons -->
<!--           <transition-group name="list-complete" tag="p"> -->
       <div class="card" v-for="card in currentCards" :key="card.id">
          <card 
            v-bind:store="store"
            v-bind:cardInfo="card.fields"
            addOrRemove="add"
          ></card>
        </div>
<!--           </transition-group> -->
    </div>
  </section>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import card from '@/components/card'

export default {
  name: 'typeRow',
  components: { Card },
  props: ['store', 'type'],
  methods: {
  },
  data: function () {
    return { 
      sharedState: this.store.state
    }
  },
  computed: {
    currentCards: function() {
      var t = this.type
      var a = this.sharedState.cards.filter(function (el) {
        return el.fields.Type[0] == t.id
      })
      // append the type of the card to the array for use in the child component
      a = a.map(function (card) {
        card['fields']['type'] = t.fields.Type
        return card
      }, this)
      return a
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
