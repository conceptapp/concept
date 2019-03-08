/*

### Component ###
This component displays the main card of the game

## Props ##

## Behavior ##

*/

<template>
  <div style="width=100%">
    <!-- hide on screens wider than lg / md / sm -->
    <div class="card d-sm-none" style="color:green">
          ?
    </div>
    <!-- hide on screens smaller than lg / md / sm -->
    <div id="main-card-front" class="d-none d-sm-block">
      <!-- using Vue flip component https://github.com/kgrandemange/vue-flip -->
      <vue-flip :active-click="true" width="100%" height="auto">
        <div slot="front">
          <div class="card main-card shadow">
            <img style="max-height:230px" :src="require('@/assets/images/logo.png')" />
          </div>
        </div>
        <div slot="back">
          <div class="card main-card shadow">
            <b-button variant="primary" @click="play">Jouer</b-button>
            <b-button variant="secondary" @click="reset">Réinitialiser</b-button>
            <b-button variant="secondary" v-b-modal.modalrules>Règles</b-button>
            <b-button variant="light" v-b-modal.modalabout>A propos</b-button>
          </div>
        </div>
      </vue-flip>
    </div>
    <b-modal ok-only ok-title="Merci" id="modalrules" title="Règles du jeu">
      <p class="text-left">Un premier joueur ouvre le jeu sur son téléphone (ou tous les autres joueurs quittent leurs yeux de l'écran). Ce joueur clique sur le bouton "Jouer" caché derrière la carte "Concept".</p>
      <p class="text-left">Sur la carte, il choisit le mot ou l'expression qu'il veut faire deviner.</p>
      <p class="text-left">Pour faire deviner le mot, il dispose de l'ensemble des <i>concepts</i> disponibles sur le plateau de jeu. Le premier concept étatn le concept principal, les autres lignes des concepts secondaires.</p>
      <p class="text-left">Pour ajouter un <i>concept</i> à un concept principal ou secondaire, le joueur clique sur la ligne du concept puis clique sur l'icône du concept qu'il veut ajouter et clique sur le <font-awesome-icon icon="plus-circle" />. Pour supprimer un <i>concept</i>, il clique sur l'icône du concept qu'il a ajouté et clique sur la <font-awesome-icon icon="trash" />.</p>
      <p class="text-left">Lorsque l'un des autres joueurs trouve le mot ou l'expression qu'il fallait deviner, le joueur qui faisait deviner peut réinitialiser le plateau en cliquant sur la carte "Concept" et le bouton "Réinitialiser".</p>
    </b-modal>
    <b-modal ok-only ok-title="D'accord" id="modalabout" title="A propos">
      <p class="text-left">Ce jeu s'appuie librement sur le jeu de société <b>Concept</b> que nous vous conseillons.</p>
      <p class="text-left">Il n'est absolument pas cautionné par les auteurs originaux du jeu, il s'agit d'un hommage (et d'un petit test aussi). A la moindre demande, l'accès à ce prototype sera retiré.</p>
    </b-modal>
  </div>
</template>

<script>
import VueFlip from 'vue-flip'

export default {
  name: 'mainCard',
  components: { 'vue-flip': VueFlip },
  props: [],
  methods: {
    play: function() {
      alert("Play")
    },
    reset: function() {
      this.$emit('reset')
    },
    rules: function() {
      alert("Rules")
    },
    about: function() {
      alert("about")
    }
  },
  data: function () {
    return { }
  },
  computed: {
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
