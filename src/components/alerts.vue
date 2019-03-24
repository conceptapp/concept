/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
  <div id="alert-messages" class="row">
    <div v-for="(alert, index) in sharedState.alerts"
        :key="index"
        :id="alert"
        class="col-12">
      <b-alert
        :show="alert.dismissCountDown"
        dismissible
        fade
        :variant="alert.variant"
        @dismissed="removeAlert(index)"
        @dismiss-count-down="countDownChanged()"
      >
        {{alert.msg}}
      </b-alert>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Alerts',
  components: { },
  props: {
    store: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
      sharedState: this.store.state
      // dismissSecs: 5,
      // dismissCountDown: 0,
      // showDismissibleAlert: false
    }
  },
  created () {
    // this.sharedState.alerts.push({
    //   msg: "Test 2 Désolé, seul l'organisateur de la partie peut modifier les cartes",
    //   dismissCountDown: 5,
    //   variant: 'info'
    // })
  },
  methods: {
    countDownChanged: function(dismissCountDown) {
      // console.log('dismissCountDown', dismissCountDown)
      // this.sharedState.alerts[index].dismissCountDown = dismissCountDown
      // this.dismissCountDown = dismissCountDown
    },
    removeAlert: function(index) {
      // clean up the alert array
      this.sharedState.alerts.splice(index, 1)
      console.log('remove alert: ', this.sharedState.alerts, index)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
