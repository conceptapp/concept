/*

### Component ###
This component displays the main menu bar

## Props ##

## Behavior ##

*/

<template>
  <section id="menubar">
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
          <b-nav-item v-b-modal.modalmultiplayers>{{ sharedState.currentGameRoom }} <small v-if="sharedState.gameRooms[sharedState.currentGameRoom]" class="text-muted">(<font-awesome-icon icon="male" /> x {{ sharedState.gameRooms[sharedState.currentGameRoom]['count'] }})</small></b-nav-item>
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
  </section>
</template>

<script>
import { EventBus } from '@/event-bus.js'

export default {
  name: 'menuBar',
  components: { },
  props: ['store'],
  data: function () {
    return { 
      sharedState: this.store.state
    }
  },
  methods: {
    reset: function() {
      this.sharedState.guessCards = this.initGuessCards()
      this.sharedState.selectedColor = this.sharedState.colors[0] // select the default color
      this.pushWebsocket()
    }
  },
  created () {
    // listen to events
    EventBus.$on('reset', args => this.reset(args))
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