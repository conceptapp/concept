
// initial state
const state = {
  alerts: []
}

// getters
const getters = {}

// actions
const actions = {
  // dummy ({ commit, state, rootState }) {
  // }
}

// mutations
const mutations = {
  pushAlert (state, alert) {
    state.alerts.push(alert)
  },
  removeAlert (state, index) {
    state.alerts.splice(index, 1)
  }
}

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations
}