import Vue from 'vue'

const state = {
  user: null
}

const mutations = {
  updateUser (state, { user }) {
    Vue.set(state, 'user', user)
  }
}
const getters = {
  user: state => state.user
}
const actions = {
}

export default {
  state,
  mutations,
  actions,
  getters
}
