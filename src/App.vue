<template>
  <div id="app">
    <div class="container">
      <Toasts></Toasts>
      <MenuBar />
      <Alerts />
      <Modals />

      <!-- render component -->
      <router-view></router-view>

      <!-- append a blank div to placehold the navbar on mobile and give some space on the other devices -->
      <div class="container" style="height:70px;" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
// import firebase from 'firebase/app'
// import "firebase/auth"
import MenuBar from '@/components/menu-bar'
import Modals from '@/components/modals'
import Alerts from '@/components/alerts'

export default {
  name: 'App',
  components: { Modals, MenuBar, Alerts },
  data: function () {
    return {
    }
  },
  computed: {
    ...mapState ({
      // user: state => state.user.user,
      colors: state => state.cards.colors
    }),
    ...mapGetters(['user']) 
  },
  methods: {
    ...mapMutations([
      // 'setCurrentUser',
    ])
  },
  created () {
    // store current user if already logged-in 
    // var user = firebase.auth().currentUser
    // if (this.user) {
    //   // this.setCurrentUser(user)
    //   console.log('playerName', this.user.displayName)
    //   this.setPlayerName(this.user.displayName)
    // }
  }
}
</script>

<style>
#app {
<!--   font-family: 'Avenir', Helvetica, Arial, sans-serif; -->
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}
.container-body {
  padding-top:10px;
  margin-top: 10px;
}
</style>
