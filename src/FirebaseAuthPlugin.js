/*

### User auth plugin ###
This plugin handles authentication functions

## Props ##

## Behavior ##

*/


import store from './store'
import { mapMutations } from 'vuex'

import Firebase from 'firebase/app'
import 'firebase/auth'

// firebase configuration
const config = {
  apiKey: 'AIzaSyCi5GkjKyceprBZjCPxQBuxjlx6Z2CuBcs',
  authDomain: 'concept-35ade.firebaseapp.com',
  databaseURL: 'https://concept-35ade.firebaseio.com',
  projectId: 'concept-35ade',
  storageBucket: 'concept-35ade.appspot.com',
  messagingSenderId: '342176989553'
}

export default {
  install: (Vue, options) => {
    const firebase = Firebase.initializeApp(config)
    const auth = firebase.auth()
    Vue.prototype.$auth = {
      login: async (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          (result) => {
            console.log('auth result', result)
            store.commit('updateUser', result.user)
            // store.commit('setPlayerName', result.user.displayName)
            store.commit('pushAlert', {
              msg: 'Connexion réussie, vous êtes désormais connecté. Bienvenue ' + result.user.displayName + '.',
              dismissCountDown: 5,
              variant: 'info'
            })
          },
          (err) => {
            // alert('Oops. ' + err.message)
            store.commit('pushAlert', {
              msg: 'La connexion a échouée. Le message remonté est : ' + err.message,
              dismissCountDown: 15,
              variant: 'danger'
            })
          }
        )
        // return await auth.signInWithEmailAndPassword(username, pass)
      },
      login_social: async() => {
        const provider = new Firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then((result) => {
          // console.log('user logged in: ', result)
          // store current user and display name
          store.commit('updateUser',result.user)
          store.commit('pushAlert', {
            msg: 'Connexion réussie, vous êtes désormais connecté. Bienvenue ' + result.user.displayName + '.',
            dismissCountDown: 5,
            variant: 'info'
          })  
        }).catch((err) => {
          // alert('Oops. ' + err.message)
          store.commit('pushAlert', {
            msg: 'La connexion a échouée. Le message remonté est : ' + err.message,
            dismissCountDown: 15,
            variant: 'danger'
          })
        });
      },
      signup: async (email, password, displayName) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
            // store current user and display name
            store.commit('updateUser',result.user)          
            // update player name
            var logged_user = firebase.auth().currentUser
            logged_user.updateProfile({
              displayName: displayName
            }).then(function() {
                // Update successful
            }, function(error) {
                // An error happened.
                console.log('playerName not updated sorry')
            })
          },
          (err) => {
            alert('Oops. ' + err.message)
          }
        )
      },
      logout: async () => {
        firebase.auth().signOut().then(() => {
          // console.log('you have been signed out')
          store.commit('updateUser', { user: null }) 
          // this.setPlayerName('')
          store.commit('pushAlert', {
            msg: 'Vous avez été déconnecté.',
            dismissCountDown: 5,
            variant: 'info'
          })
        })
        // await auth.signOut()
      }
    }
    auth.onAuthStateChanged(user => {
      store.commit('updateUser',{ user })
    })
  }
}