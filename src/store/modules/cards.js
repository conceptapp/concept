import axios from 'axios'
import typesjson from '../../../data/types.json'
import cards1json from '../../../data/cards-1.json'
import cards2json from '../../../data/cards-2.json'

// initial state
const state = {
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
  }
}

// mutations
const mutations = {
  setTypes (state, types) {
    state.types = types
  },
  setCards (state, cards) {
    state.cards = cards
  }
}

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations
}