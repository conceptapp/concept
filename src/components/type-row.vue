/*

### Component ###
This component finds a concept card in the whole array
It calls the card component to display

## Props ##
cards: all the cards of the game
type: the current type object of the row
color: the current selected color

## Behavior ##
On clickl, display tooltip next to the icon

*/

<template>
  <section>
    <div class="row"> 
      <b> {{type.fields.Title_fr}} </b><br />
    </div>
    <div class="row">
      <!-- for each type, display the concept icons -->
<!--           <transition-group name="list-complete" tag="p"> -->
       <div class="card" v-for="card in currentCards" :key="card.id">
          <card 
            v-bind:cardInfo="card.fields"
            v-bind:selectedColor="selectedColor"
            addOrRemove="add"
            v-on:add-icon="addIcon"
          ></card>
        </div>
<!--           </transition-group> -->
    </div>
  </section>
</template>

<script>
import card from '@/components/card'

export default {
  name: 'typeRow',
  components: { card },
  props: ['cards', 'type', 'selectedColor'],
  methods: {
    addIcon: function(data) {
      this.$emit('add-icon', data)
    }
  },
  data: function () {
    return { }
  },
  computed: {
    currentCards: function() {
      var t = this.type
      var a = this.cards.filter(function (el) {
        return el.fields.Type[0] == t.id
      })
      // append the type of the card to the array for use in the child component
      a = a.map(function (card) {
        card['fields']['type'] = t.fields.Type
        return card
      })
      return a
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
