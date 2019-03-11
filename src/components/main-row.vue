/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
	<div id="main-row">
    <!-- garder la marque au milieu sur mobile -->
    <b-navbar class="navbar navbar-expand-lg navbar-light bg-light d-none d-sm-block">
      <b-navbar-nav>
        <b-navbar-brand class="navbar-brand" href="#">Concept</b-navbar-brand>
        <b-nav-item-dropdown text="Jouer">
          <b-dropdown-item href="#">Afficher la carte en cours</b-dropdown-item>
          <b-dropdown-item href="#">Tirer une autre carte</b-dropdown-item>
          <b-dropdown-item href="#">----------------------</b-dropdown-item>
          <b-dropdown-item href="#">Réinitialiser le jeu</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item href="#">Contribuer</b-nav-item>
        <b-nav-item href="#">Règles du jeu</b-nav-item>
        <b-nav-item href="#">A propos</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <!-- mobile navbar TODO ajouter les events -->
    <div class="container d-sm-none" style="line-height:1.3em;">
      <b-navbar class="navbar navbar-expand-lg navbar-dark bg-dark" fixed="bottom" style="padding-top:0;padding-bottom:0;">
        <b-navbar-nav>
          <b-nav-item href="#"><font-awesome-icon icon="play-circle" /><br />Jouer</b-nav-item>          
          <b-nav-item href="#"><font-awesome-icon icon="trash-restore" /><br />Réinitialiser</b-nav-item>
          <b-nav-item href="#"><font-awesome-icon icon="book-open" /><br />Règles</b-nav-item>
          <b-nav-item href="#"><font-awesome-icon icon="plus-square" /><br />Contribuer</b-nav-item>
          <b-nav-item href="#"><font-awesome-icon icon="bars" /><br />More</b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </div>
    <!-- end of mobile navbar -->
    <div class="container-body">
      <div id="header-row" class="row">
        <div class="col-2 d-none d-sm-block">
          <conceptCard
          ></conceptCard>
        </div>
        <div class="col-1 d-sm-none"></div>
        <div class="col-10">
          <!-- show all the concept by row, one color each -->
          <!-- TODO wrap all this in a component to get flexibility on mobile design ? -->
          <div
            v-for="(color, index) in sharedState.colors"
            class="row align-items-center rounded shadow-sm guess-row"
            v-bind:class="{ 'active': color == sharedState.selectedColor }"
            v-on:click="sharedState.selectedColor = color"
          >
            <div class="col-auto guess-icon">
              <font-awesome-icon v-bind:icon="index == 0 ? 'question-circle' : 'exclamation-circle'" size="2x" :color="color" />
            </div>
            <transition-group name="fade" class="guess-cards">
              <div v-for="(card, index) in sharedState.guessCards[color]" :key="index" class="card">
								<!-- v-on:remove-icon="removeIcon" -->
                <card
                	v-bind:store="store"
                  v-bind:cardInfo="card"
                  v-bind:iconColor="color"
                  addOrRemove="remove"
                ></card>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import card from '@/components/card'
import conceptCard from '@/components/concept-card'

export default {
  name: 'mainRow',
  components: { card, conceptCard },
  props: ['store', 'type'],
  data: function () {
    return { 
      sharedState: this.store.state
    }
  },
  methods: {
    addIcon: function (data) {
      // Name, Tooltip_fr
      // first time a color is called, need to create the empty array
      if (this.sharedState.guessCards[this.sharedState.selectedColor] == null) {
        this.sharedState.guessCards[this.sharedState.selectedColor] = []
      }
      this.sharedState.guessCards[this.sharedState.selectedColor].push(data)
    },
    removeIcon: function(data) {
      // remove clicked icon from current active color
      this.sharedState.guessCards[this.sharedState.selectedColor] = this.sharedState.guessCards[this.sharedState.selectedColor].filter( 
        function(obj) {
          return !(obj.Name == data.Name)
      })
    },
    // initialize an empty array to be pushed for every color
		initGuessCards: function() {
		  var obj = {}
		  for (var i = 0; i < this.sharedState.colors.length; i++) {
		    obj[this.sharedState.colors[i]] = []
		  }
		  return obj
		},
    reset: function() {
      this.sharedState.guessCards = this.initGuessCards()
      this.sharedState.selectedColor = this.sharedState.colors[0] // select the default color
    }
  },
  created () {
    // initialize the Guess Cards arrays
    this.sharedState.guessCards = this.initGuessCards()
    // listen to events
    EventBus.$on('reset', args => this.reset(args))
    EventBus.$on('add-icon', data => this.addIcon(data))
    EventBus.$on('remove-icon', data => this.removeIcon(data))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>