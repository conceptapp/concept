import Vue from 'vue'
import Vuex from 'vuex'
import cards from './modules/cards'

// import cart from './modules/cart'
// import products from './modules/products'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  // types: [],
  // cards: [],
  // guessCards: {},
  // cardDragged: {},
  colors: ['#10C177', '#FE4365', '#1693A5', '#420943'],
  selectedColor: '#10C177', // select a default color
  currentUser: '',
  isMultiPlayer: false,
  playerName: '',
  currentGameRoom: '',
  gameRooms: [],
  gameMode: '',
  gameModeIsGod: false,
  gameModeAllowChange: true,
  alerts: []
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  increment (state) {
    state.count++
  },
  decrement (state) {
    state.count--
  }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  increment: ({ commit }) => commit('increment'),
  decrement: ({ commit }) => commit('decrement'),
  incrementIfOdd ({ commit, state }) {
    if ((state.count + 1) % 2 === 0) {
      commit('increment')
    }
  },
  incrementAsync ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('increment')
        resolve()
      }, 1000)
    })
  }
}

// getters are functions
const getters = {
  evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd'
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  modules: {
    cards
  },
  state,
  getters,
  actions,
  mutations
})