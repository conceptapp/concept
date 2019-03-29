/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
  <div id="alert-messages" class="row">
    <div v-for="(alert, index) in alerts"
        :key="index"
        :id="alert"
        class="col-12">
      <b-alert
        v-if="alert.boardCreationMode"
        :show="true"
        dismissible
        fade
        variant="info"
        @dismissed="cancelBoardCreation(index)">
        Mot à faire deviner : <u>{{ currentBoardWords[0] }}</u> 
        ~~ <b-link @click="saveBoard(index)" class="alert-link">Enregistrer le plateau</b-link> ~~
      </b-alert>
      <b-alert
        v-else
        :show="alert.dismissCountDown"
        dismissible
        fade
        :variant="alert.variant"
        @dismissed="removeCurrentAlert(index)"
        @dismiss-count-down="countDownChanged()"
      >
        {{alert.msg}}
      </b-alert>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'Alerts',
  components: { },
  props: { },
  data: function () {
    return {
    }
  },
  computed: mapState ({
    alerts: state => state.alerts.alerts,
    currentBoardWords: state => state.game.currentBoardWords
  }),
  created () { },
  methods: {
    ...mapMutations([
      'removeAlert',
      'resetBoardWords'
    ]),
    countDownChanged: function(dismissCountDown) {
      // console.log('dismissCountDown', dismissCountDown)
      // this.sharedState.alerts[index].dismissCountDown = dismissCountDown
      // this.dismissCountDown = dismissCountDown
    },
    removeCurrentAlert: function(index) {
      // clean up the alert array
      // this.sharedState.alerts.splice(index, 1)
      this.removeAlert(index)
      // console.log('remove alert: ', this.sharedState.alerts, index)
    },
    cancelBoardCreation: function(index) {
      this.removeAlert(index)
      this.resetBoardWords()    
    },
    saveBoard: function(index) {
      // hide alert
      this.removeAlert(index)
      EventBus.$emit('saveBoard', {})      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
