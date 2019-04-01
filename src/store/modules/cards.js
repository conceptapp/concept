import axios from 'axios'
import typesjson from '../../../data/types.json'
import cards1json from '../../../data/cards-1.json'
import cards2json from '../../../data/cards-2.json'

import $socket from '@/websocket-instance'

// initial state
const state = {
  colors: ['#10C177', '#FE4365', '#1693A5', '#420943'],
  selectedColor: '#10C177', // select a default color
  types: [],
  cards: [],
  guessCards: {},
  cardDragged: {}
}

// getters
const getters = {}

// actions
const LOCAL = true
const appKey = 'keyrkS74q9vL9FBHT'
const appId = 'appzdYVnVaVLTKUB7'
const actions = {
  retrieveRecords ({ commit, state }, { 'recordType': recordType, 'offset': offset}) {
    // console.log('retrieveRecords: ', state, recordType, offset)
    // query all the data from airtable or local JSON stored in /data
    offset = offset !== undefined ? '&offset=' + offset : ''
    if (!LOCAL) {
      axios.get(
        'https://api.airtable.com/v0/' + appId + '/' + recordType + '?sort%5B0%5D%5Bfield%5D=index' + offset,
        {
          headers: { Authorization: 'Bearer ' + appKey }
        }
      ).then(function (response) {
        if (recordType === 'Types') {
          commit('setTypes', response.data.records)
        } else {
          // get the cards data
          if (offset === '') {
            // this.sharedState.cards = response.data.records
            // this.retrieveRecords('Cards', response.data.offset)
            commit('setCards', response.data.records)
            this.dispatch('retrieveRecords', { 'recordType': 'Cards', 'offset': response.data.offset})
          } else {
            // this.sharedState.cards.concat(response.data.records)
            commit('setCards', state.cards.concat(response.data.records))
          }
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
      })
    } else {
      if (recordType === 'Types') {
        // this.sharedState.types = typesjson.records
        commit('setTypes', typesjson.records)
      } else {
        // this.sharedState.cards = cards1json.records.concat(cards2json.records)
        commit('setCards', cards1json.records.concat(cards2json.records))
      }
    }
  },
  initGuessCards ({ commit, state, rootState }) {
    // console.log('initGuessCards: ', commit, state, rootState)
    var obj = {}
    for (var i = 0; i < state.colors.length; i++) {
      obj[state.colors[i]] = []
    }
    commit('setGuessCards', { 'guessCards': obj, 'updateServer': true })
  },
  pushWebsocket ({ commit, state, rootState, rootGetters }) {
    // console.log('pushWebsocket', state, rootState, rootGetters)
    if (rootGetters.gameModeMultiplayers) {
      console.log("trigger update to the websocket server: ", state.guessCards, rootState.game.currentGameRoom)
      // if playing in multiplayer mode, push the info to the websocket server
      $socket.emit('update_cards_from_client', {
        'currentGameRoom': rootState.game.currentGameRoom,
        'guessCards': state.guessCards
      })
    }
  }
}

// mutations
const mutations = {
  setTypes (state, types) {
    state.types = types
  },
  setCards (state, cards) {
    state.cards = cards
  },
  setGuessCards (state, { 'guessCards': guessCards, 'updateServer': updateServer }) {
    // console.log('setGuessCards: ', state, guessCards, updateServer)
    state.guessCards = guessCards
    if (updateServer) this.dispatch('pushWebsocket')
  },
  pushGuessCards (state, { 'color': color, 'cards': cards }) {
    // console.log('pushGuessCards', state, color, cards)
    state.guessCards[color].push(cards)
    this.dispatch('pushWebsocket')
  },
  removeGuessCards (state, { 'color': color, 'cards': cards }) {
    state.guessCards[color] = state.guessCards[color].filter(
      function (obj) {
        return !(obj.Name === cards.Name)
      })
    this.dispatch('pushWebsocket')
  },
  setCurrentColor (state, color) {
    // console.log('setCurrentColor', state, color)
    state.selectedColor = color
  },
  setCardDragged (state, card) {
    state.cardDragged = card
  }
}

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations
}