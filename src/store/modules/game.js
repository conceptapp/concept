import $socket from '@/websocket-instance'

// initial state
const state = {
  currentUser: '',
  isMultiPlayer: false,
  playerName: '',
  currentGameRoom: '',
  gameRooms: [],
  gameMode: '',
  gameModeIsGod: false,
  gameModeAllowChange: true,
  currentBoardWords: []
}

// getters
const getters = {}

// actions
const actions = {
  // dummyAction ({ commit, state }, { 'recordType': recordType, 'offset': offset}) {
  //   // console.log('retrieveRecords: ', state, recordType, offset) 
  // }
}

// mutations
const mutations = {
  setGameRooms (state, gameRooms) {
    state.gameRooms = gameRooms
  },
  setCurrentGameRoom (state, currentGameRoom) {
    state.currentGameRoom = currentGameRoom
  },
  setGameMode (state, gameMode) {
    state.gameMode = gameMode
  },
  setGameModeIsGod (state, isGod) {
    state.gameModeIsGod = isGod
  },
  setGameModeAllowChange (state, allowChange) {
    state.gameModeAllowChange = allowChange
  },
  setIsMultiPlayer (state, isMultiPlayer) {
    state.isMultiPlayer = isMultiPlayer
  },
  setPlayerName (state, playerName) {
    state.playerName = playerName
  },
  setCurrentUser (state, currentUser) {
    state.currentUser = currentUser
  },
  pushBoardWord (state, word) {
    state.currentBoardWords.push(word)
  },
  resetBoardWords (state) {
    state.currentBoardWords = []
  }
}

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations
}