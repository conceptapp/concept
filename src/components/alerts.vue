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

export default {
  name: 'Alerts',
  components: { },
  props: { },
  data: function () {
    return {
    }
  },
  computed: mapState ({
    alerts: state => state.alerts.alerts
  }),
  created () { },
  methods: {
    ...mapMutations([
      'removeAlert'
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
