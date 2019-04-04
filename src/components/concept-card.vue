/*

### Component ###
This component displays the main card of the game

## Props ##

## Behavior ##

*/

<template>
  <div style="width=100%">
    <div id="main-card-front">
      <!-- using Vue flip component https://github.com/kgrandemange/vue-flip -->
<!--       <vue-flip
        v-if="['allPlayersMode','godMode', 'local'].indexOf(this.gameMode) === -1"
        :active-click="true"
        width="100%"
        height="auto"
      >
        <div slot="front">
          <div class="card main-card shadow">
            <img
              :src="require('@/assets/images/logo.png')"
              style="max-height:230px;width:100%;"
            >
          </div>
        </div>
        <div slot="back">
          <div class="card main-card shadow">
            <b-button v-b-modal.modalplaymultiplayers variant="primary">
              Jeu live
            </b-button>
            <b-button @click="launchPlaySolo()" variant="primary">
              Jeu tour à tour
            </b-button>
            <b-button v-b-modal.modalrules variant="secondary">
              Règles du jeu
            </b-button> -->
            <!-- hide about on tablets -->
<!--             <b-button v-b-modal.modalabout class="d-md-none d-lg-block" variant="light">
              A propos
            </b-button>
          </div>
        </div>
      </vue-flip> -->
      <div slot="front">
        <div class="card main-card shadow">
          <img
            :src="require('@/assets/images/logo.png')"
            style="max-height:230px;width:100%;"
            @click="showModalWords()"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueFlip from 'vue-flip'
import { EventBus } from '@/event-bus.js'
import { mapState } from 'vuex'

export default {
  name: 'ConceptCard',
  components: { 'vue-flip': VueFlip },
  // props: [],
  data: function () {
    return { }
  },
  computed: {
    ...mapState ({
      gameMode: state => state.game.gameMode
    })
  },
  methods: {
    reset: function () {
      // this.$emit('reset')
      EventBus.$emit('reset', {})
    },
    showModalWords: function () {
      this.$root.$emit('bv::show::modal', 'modalwords')
    },
    launchPlaySolo() {
      // if user not authenticated, force auth first else show multiplayers modal
      if (!this.user) {
        this.setPageAfterLogin('modalplaysolo')
        this.showModalLogin()
      } else {
        this.$root.$emit('bv::show::modal', 'modalplaysolo')
      }
    }
  }
}
</script>

<!-- Removed "scoped" attribute to apply css to vue-flip -->
<style>
.main-card{
  padding: 5px;
  cursor: pointer;
}
.main-card .btn {
  margin: 10px 0;
}
.btn-primary {
  background-color: #1693A5 !important;
}
.front, .back {
  width: 100%;
  height: 100%;
}
</style>
