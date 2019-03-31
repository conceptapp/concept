import Vue from 'vue'

const state = {
  user: null,
  pageAfterLogin: ''
}

const mutations = {
  updateUser (state, { user }) {
    Vue.set(state, 'user', user)
  },
  setPageAfterLogin (state, page) {
  	state.pageAfterLogin = page
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
