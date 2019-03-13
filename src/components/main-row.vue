/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
	<div id="main-row">
    <!-- desktop navbar -->
    <b-navbar class="navbar navbar-expand-lg navbar-light bg-light d-none d-sm-block">
      <b-navbar-nav>
        <b-navbar-brand class="navbar-brand">Concept</b-navbar-brand>
        <b-nav-item v-b-modal.modalplay>Jouer</b-nav-item>
        <b-nav-item v-b-modal.modalmultiplayers>Multijoueurs</b-nav-item>
        <b-nav-item @click="reset">Réinitialiser le jeu</b-nav-item>
        <b-nav-item href="https://jrmie818423.typeform.com/to/Kf9Ux6" target="_blank">Contribuer</b-nav-item>
        <b-nav-item v-b-modal.modalrules>Règles du jeu</b-nav-item>
        <!-- hide about on tablets -->
        <b-nav-item class="d-md-none" v-b-modal.modalabout>A propos</b-nav-item>
        <!-- right aligned items -->
        <b-navbar-nav class="ml-auto" v-if="sharedState.currentGameRoom!=''">
          <b-navbar-brand>{{ sharedState.currentGameRoom }}</b-navbar-brand>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-navbar>
    <!-- mobile navbar - top navbar to display brand && bottom navbar for navigation -->
    <div class="d-sm-none" style="line-height:1.3em;">
	    <b-navbar id="brand-navbar" class="navbar navbar-expand-lg navbar-dark bg-dark">
	      <b-navbar-nav class="ml-auto mx-auto">
        	<b-navbar-brand class="navbar-brand">Concept</b-navbar-brand>
      	</b-navbar-nav>
    	</b-navbar>
      <b-navbar class="navbar navbar-expand-lg navbar-dark bg-dark" fixed="bottom" style="padding-top:0;padding-bottom:0;">
        <b-navbar-nav class="ml-auto mx-auto">
          <b-nav-item v-b-modal.modalplay><font-awesome-icon icon="play-circle" /><br />Jouer</b-nav-item>          
          <b-nav-item v-b-modal.modalmultiplayers><font-awesome-icon icon="users" /><br />Multijoueurs</b-nav-item>
          <b-nav-item @click="reset"><font-awesome-icon icon="trash-restore" /><br />Réinitialiser</b-nav-item>
<!--           <b-nav-item href="#"><font-awesome-icon icon="plus-square" /><br />Contribuer</b-nav-item> -->
          <b-nav-item v-b-modal.modalrules><font-awesome-icon icon="book-open" /><br />Règles</b-nav-item>
<!--           <b-nav-item href="#"><font-awesome-icon icon="bars" /><br />More</b-nav-item> -->
        </b-navbar-nav>
      </b-navbar>
    </div>
    <!-- end of mobile navbar -->
    <div class="container-body">
      <div id="header-row" class="row">
        <!-- hide on screens smaller than lg / md / sm -->
        <div class="col-2 d-none d-sm-block">
          <conceptCard></conceptCard>
        </div>
        <!-- show only on mobile -->
        <div class="col-1 d-sm-none"></div>
        <div class="col-10">
          <!-- show all the concept by row, one color each -->
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
    <modals 
      v-bind:store=store
    ></modals>
  </div>
</template>

<script>
import { EventBus } from '@/event-bus.js'
import card from '@/components/card'
import conceptCard from '@/components/concept-card'
import modals from '@/components/modals'

export default {
  name: 'mainRow',
  components: { card, conceptCard, modals },
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
      this.pushWebsocket()
    },
    removeIcon: function(data) {
      // remove clicked icon from current active color
      this.sharedState.guessCards[this.sharedState.selectedColor] = this.sharedState.guessCards[this.sharedState.selectedColor].filter( 
        function(obj) {
          return !(obj.Name == data.Name)
      })
      this.pushWebsocket()
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
      this.pushWebsocket()
    },
    pushWebsocket: function() {
      // if playing in multiplayer mode, push the info to the websocket server
      if ( this.sharedState.isMultiPlayer ) {
        // console.log("updated info on the websocket server: ", this.sharedState.guessCards)
        this.$socket.emit('update_cards_from_client', { 
          'currentGameRoom': this.sharedState.currentGameRoom,
          'guessCards': this.sharedState.guessCards
        })
      }
    }
  },
  sockets: {
    connect () {
      // console.log('connected to main server')
    },
    update_cards_from_server (data) {
      // console.log('server asked to update cards: ', data)
      // if this is current game, then update the cards
      if (data.currentGameRoom == this.sharedState.currentGameRoom) {
        this.sharedState.guessCards = data.guessCards
      }
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
#brand-navbar {
	margin-left: -15px;
	margin-right: -15px;
}
</style>