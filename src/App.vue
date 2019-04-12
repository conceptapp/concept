<template>
  <div id="app">
    <div :class="{'container': !isHomePage}">
      <Toasts></Toasts>
      <MenuBar v-if="!isHomePage" />
      <Chat />
      <Alerts />
      <Modals />

      <!-- render component -->
      <router-view></router-view>

      <!-- append a blank div to placehold the navbar on mobile and give some space on the other devices -->
      <div v-if="!isHomePage" class="container" style="height:70px;" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MenuBar from '@/components/menu-bar'
import Modals from '@/components/modals'
import Alerts from '@/components/alerts'
import Chat from '@/components/chat'

export default {
  name: 'App',
  components: { Modals, MenuBar, Alerts, Chat },
  data: function () {
    return {
    }
  },
  computed: {
    ...mapState ({
      colors: state => state.cards.colors
    }),
    isHomePage: function() {
      return this.$route.name === "Home"
    }
  },
  methods: {
  },
  created () {
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
