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
  currentBoardWords: [],
  currentBoardVariant: ''
}

// getters
const getters = {
  gameModeAllowChange: state => {
    // is true except when game mode is godMode and player is not God (== admin)
    return !(state.gameMode === 'godMode' && !state.gameModeIsGod)
  }
}

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
  },
  setBoardVariant (state, variant) {
    state.currentBoardVariant = variant
  }
}

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations
}