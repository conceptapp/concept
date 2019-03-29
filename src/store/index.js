import Vue from 'vue'
import Vuex from 'vuex'
import cards from './modules/cards'
import game from './modules/game'
import alerts from './modules/alerts'
import user from './modules/user'

// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = { }

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = { }

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = { }

// getters are functions
const getters = { }

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  modules: {
    cards,
    game,
    alerts,
    user
  },
  state,
  getters,
  actions,
  mutations
})