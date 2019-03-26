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
      <span class="font-weight-bold">{{ type.fields.Title_fr }}</span>
    </div>
    <div class="row">
      <!-- for each type, display the concept icons -->
      <!--           <transition-group name="list-complete" tag="p"> -->
      <div
        v-for="card in currentCards"
        :key="card.id"
        class="card"
      >
        <Card
          :card-info="card.fields"
          add-or-remove="add"
        />
      </div>
      <!--           </transition-group> -->
    </div>
  </section>
</template>

<script>
// import { EventBus } from '@/event-bus.js'
import { mapState } from 'vuex'
import Card from '@/components/card'

export default {
  name: 'TypeRow',
  components: { Card },
  props: {
    type: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    ...mapState ({
      cards: state => state.cards.cards
    }),
    currentCards: function () {
      var t = this.type
      var a = this.cards.filter(function (el) {
        return el.fields.Type[0] === t.id
      })
      // append the type of the card to the array for use in the child component
      a = a.map(function (card) {
        card['fields']['type'] = t.fields.Type
        return card
      }, this)
      return a
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
