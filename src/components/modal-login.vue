/*

### Component ###
This component displays the login elements

## Props ##

## Behavior ##

*/

<template>
    <!-- Modal dialog pour afficher le mode multijoueurs -->
  <b-modal
    id="modallogin"
    ref="modallogin"
    :hide-footer="true"
    title="Identification"
  >
    <div class="row text-left">
      <div v-if="currentUser===''" class="col">
        <h6 class="card-title text-left">Merci de vous authentifier pour lancer le mode multi-joueurs</h6>
        <b-form-group id="emailForm"
            label="Email :"
            label-cols-xl="4"
            label-cols-lg="3"
            label-for="email" >
          <b-form-input id="email"
            v-model.trim="email"
            type="email"
            class=""
            placeholder="john.doe@gmail.com"
          />
          <!-- :state="emailValid" -->
          <b-form-invalid-feedback>
            On y est presque...<br>Pouvez-vous me donner un petit nom d'au moins 2 caractères&nbsp;?
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="passwordForm"
            label="Mot de passe :"
            label-cols-xl="4"
            label-cols-lg="3"
            label-for="password" >
          <b-form-input id="password"
            v-model.trim="password"
            type="password"
            class=""
            placeholder="***********"
          />
        </b-form-group>
        <span v-if="signup">
          <b-form-group id="passwordconfirmationForm"
              label="Confirmez votre mot de passe :"
              label-cols-xl="4"
              label-cols-lg="3"
              label-for="passwordconfirmation">
            <b-form-input
              id="passwordconfirmation"
              type="password"
              class=""
              placeholder="***********"
            />
          </b-form-group>
          <b-form-group id="playerNameForm"
            label="Nom ou pseudo :"
            label-cols-xl="4"
            label-cols-lg="3"
            label-for="get_player_name">
            <b-form-input
              id="get_player_name"
              v-model.trim="playerNameForm"
              type="text"
              class=""
              maxlength="30"
              placeholder="John Doe"
              :state="playerNameValid"
            />
            <b-form-invalid-feedback>
              On y est presque...<br>Pouvez-vous me donner un petit nom d'au moins 2 caractères&nbsp;?
            </b-form-invalid-feedback>
          </b-form-group>
        </span>
        <div class="text-right">
          <span v-if="!signup">
            <b-button @click="signup = !signup" variant="outline-secondary">Créer mon compte</b-button>
            <b-button @click="login()" variant="primary">S'identifier</b-button>
          </span>
          <span v-else>
            <b-button @click="signup = !signup" variant="outline-secondary">S'identifier</b-button>
            <b-button @click="signUp()" variant="primary">Créer mon compte</b-button>
          </span>
        </div>
        <hr>
        <div class="login">
          <p class="text-center">
            ou connectez-vous avec votre compte Google<br>
            <button @click="socialLogin" class="social-button">
              <img alt="google logo" :src="require('@/assets/images/google-logo.png')">
            </button>
          </p>
        </div>
      </div>
      <div v-else class="col">
        <p class="text-center">
          <b-button @click="logout" variant="primary">Se déconnecter</b-button>
        </p>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { EventBus } from '@/event-bus.js'
import firebase from 'firebase/app'
import "firebase/auth"


export default {
  name: 'ModalLogin',
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
      sharedState: this.store.state,
      signup: false,
      playerNameForm: '',
      playerNameValid: null,
      email: '',
      password: ''
    }
  },
  computed: mapState ({
    // colors: state => state.cards.colors,
    // selectedColor: state => state.cards.selectedColor,
    currentUser: state => state.game.currentUser,
    playerName: state => state.game.playerName,
    // currentGameRoom: state => state.game.currentGameRoom,
    // gameRooms: state => state.game.gameRooms
  }),  
  created () {
  },
  methods: {
    ...mapMutations([
      'setPlayerName',
      'setCurrentUser'
    ]),
    validate_player_form: function() {
      this.playerNameValid = this.playerName.length > 1
      this.setPlayerName(this.playerNameForm)
    },
    login: function() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (result) => {
          // alert('Yeah, you are connected')
          // var currentUser = firebase.auth().currentUser
          // console.log('user logged in: ', result)
          // store current user and display name
          this.setCurrentUser(result.user)
          this.setPlayerName(result.user.displayName)
          this.hideModal()
          this.sharedState.alerts.push({
            msg: 'Connexion réussie, vous êtes désormais connecté. Bienvenue ' + result.user.displayName + '.',
            dismissCountDown: 5,
            variant: 'info'
          })
        },
        (err) => {
          // alert('Oops. ' + err.message)
          this.sharedState.alerts.push({
            msg: 'La connexion a échouée. Le message remonté est : ' + err.message,
            dismissCountDown: 15,
            variant: 'danger'
          })
        }
      )
    },
    socialLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
        // alert('Yeah, you are connected')
        // var currentUser = firebase.auth().currentUser
        console.log('user logged in: ', result)
        // store current user and display name
        this.setCurrentUser(result.user)
        this.setPlayerName(result.user.displayName)
        this.hideModal()
        this.sharedState.alerts.push({
          msg: 'Connexion réussie, vous êtes désormais connecté. Bienvenue ' + result.user.displayName + '.',
          dismissCountDown: 5,
          variant: 'info'
        })  
      }).catch((err) => {
        // alert('Oops. ' + err.message)
        this.sharedState.alerts.push({
          msg: 'La connexion a échouée. Le message remonté est : ' + err.message,
          dismissCountDown: 15,
          variant: 'danger'
        })
      });
    },
    signUp: function() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          // store current user and display name
          this.setCurrentUser(user)
          // update player name
          var logged_user = firebase.auth().currentUser;
          logged_user.updateProfile({
              displayName: this.playerNameForm
          }).then(function() {
              // Update successful
              this.setPlayerName(this.playerNameForm)
              this.hideModal()
          }.bind(this), function(error) {
              // An error happened.
              console.log('playerName not updated sorry')
          })
        },
        (err) => {
          alert('Oops. ' + err.message)
        }
      )
    },
    logout: function() {
      firebase.auth().signOut().then(() => {
        // alert('you have been signed out')
        this.setCurrentUser('')
        this.setPlayerName('')
        this.sharedState.alerts.push({
          msg: 'Vous avez été déconnecté.',
          dismissCountDown: 5,
          variant: 'info'
        })
      })
    },
    hideModal() {
      this.$refs.modallogin.hide()
    }
  },
  sockets: {
    connect () {
      // console.log('connected to main server')
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .social-button {
    width: 75px;
    background: white;
    padding: 10px;
    border-radius: 100%;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
    outline: 0;
    border: 0;
  }
  .social-button:active {
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
  }
  .social-button img {
    width: 100%;
  }
</style>
