/*

### Component ###
This component displays the profile page

## Props ##

## Behavior ##

*/

<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row v-if="user">
      <b-col>
        <h4 class="card-title text-left mt-2">Votre profil</h4>
        <p class="text-left">
          Votre email : {{user.email}}<br>
          <b-button @click="$auth.logout()" variant="primary">Se déconnecter</b-button>
        </p>
      </b-col>
    </b-row>
    <b-row v-if="!user">
      <b-col>
        <h4 class="card-title text-left mt-2">Vous n'êtes pas connecté</h4>
        <p class="text-left">
          <b-button @click="$root.$emit('bv::show::modal', 'modallogin')" variant="primary">Se connecter</b-button>
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import $socket from '@/websocket-instance'

export default {
  name: 'Profile',
  components: {  },
  props: { },
  data: function () {
    return { }
  },
  computed: {
    ...mapState ({
    }),
    ...mapGetters([
      'user'
    ])
  },
  methods: {
  },
  created: function() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
