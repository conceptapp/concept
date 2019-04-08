/*

### Component ###
This component contains the modal dialogs

## Props ##

## Behavior ##

*/

<template>
  <div id="modal-dialogs">
    <!-- Modal dialog pour afficher les règles du jeu -->
    <b-modal
      id="modalrules"
      ok-only
      ok-title="Merci"
      title="Règles du jeu"
    >
      <section v-if="gameMode !== 'boardPlay'">
        <h4>Jeu live</h4>
        <p class="text-left">
          Un premier joueur ouvre le jeu sur son téléphone (ou tous les autres joueurs quittent leurs yeux de l'écran). Ce joueur clique sur le bouton "Jouer" caché derrière la carte "Concept".
        </p>
        <p class="text-left">
          Sur la carte, il choisit le mot ou l'expression qu'il veut faire deviner.
        </p>
        <p class="text-left">
          Pour faire deviner le mot, il dispose de l'ensemble des <i>concepts</i> disponibles sur le plateau de jeu. Le premier concept étatn le concept principal, les autres lignes des concepts secondaires.
        </p>
        <p class="text-left">
          Pour ajouter un <i>concept</i> à un concept principal ou secondaire, le joueur clique sur la ligne du concept puis clique sur l'icône du concept qu'il veut ajouter et clique sur le <font-awesome-icon icon="plus-circle" />. Pour supprimer un <i>concept</i>, il clique sur l'icône du concept qu'il a ajouté et clique sur la <font-awesome-icon icon="trash" />.
        </p>
        <p class="text-left">
          Lorsque l'un des autres joueurs trouve le mot ou l'expression qu'il fallait deviner, le joueur qui faisait deviner peut réinitialiser le plateau en cliquant sur la carte "Concept" et le bouton "Réinitialiser".
        </p>
        <h4>Jeu solo / plateau</h4>
        <p class="text-left">
          Dans ce mode de jeu, vous piochez un mot et vous pouvez alors construire un plateau de jeu avec des icônes associées. L'objectif reste identique : faire deviner des mots aux autres joueurs. Vous pouvez créer autant de plateaux que vous souhaitez en essayant de nouveaux mots à chaque fois.
        </p>
        <p class="text-left">
          Puis à votre tour, vous pouvez tenter de découvrir les mots cachés par les plateaux créés par les autres joueurs.
        </p>
      </section>
      <section v-if="gameMode === 'boardPlay'">
        <h4>Jeu solo / devinez le plateau</h4>
        <p class="text-left">
          Essayez de deviner le plus rapidement possible le mot associé à ce tableau.
          Vous pouvez proposer autant de mots que vous le souhaitez, à vous d'être le plus rapide.
        </p>
      </section>
    </b-modal>
    <b-modal id="modalabout" ok-only ok-title="D'accord"title="A propos">
      <p class="text-left">
        Ce jeu s'appuie librement sur le jeu de société <b>Concept</b> que nous vous conseillons.
      </p>
      <p class="text-left">
        Il n'est absolument pas cautionné par les auteurs originaux du jeu, il s'agit d'un hommage (et d'un petit test aussi). A la moindre demande, l'accès à ce prototype sera retiré.
      </p>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ModalRules',
  components: { },
  props: { },
  computed: {
    ...mapState ({
      gameMode: state => state.game.gameMode
    })
  },
  methods: {
  }
}
</script>

<style scoped >
</style>
