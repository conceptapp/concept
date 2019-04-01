import $socket from '@/websocket-instance'
import { EventBus } from '@/event-bus.js'

// initial state
const state = {
  currentGameRoom: '',
  gameRooms: [],
  gameMode: '', // boardPlay, boardCreation, godMode, allPlayersMode, local
  gameModeDisplayBoard: false,
  currentBoardWords: [],
  currentBoardVariant: '',
  currentBoardGuessCards: {},
  boards: [],
  boardId: ''
}

// getters
const getters = {
  gameModeIsGod: (state, getters, rootState) => {
    if (state.gameRooms[state.currentGameRoom]) {
      return state.gameRooms[state.currentGameRoom].creator_email === rootState.user.user.email
    } else {
      return false
    }
  },
  gameModeAllowChange: (state, getters) => {
    // is true except when game mode is godMode and player is not God (== creator of the game)
    return !(state.gameMode === 'godMode' && !getters.gameModeIsGod)
  },
  gameModeMultiplayers: state => {
    return ['allPlayersMode','godMode'].indexOf(state.gameMode) !== -1
  }
}

// actions
const actions = {
  setGameMode (context, gameMode) {
    // if switchting from multiplayer game mode to board mode, then leave current game room
    if (['allPlayersMode','godMode'].indexOf(state.gameMode) !== -1 && ['boardPlay', 'boardCreation'].indexOf(gameMode) !== -1) {
      EventBus.$emit('leave_game')
    }
    // if switching to anything but boardCreation, remove creation board alert
    if (gameMode !== 'boardCreation') {
      // https://stackoverflow.com/questions/41366388/vuex-access-state-from-another-module
      let index = context.rootState.alerts.alerts.findIndex(x => x.boardCreationMode === true)
      if (index !== -1) context.commit('removeAlert', index)
    }
    state.gameMode = gameMode
  },
  updateGameRooms ({ commit, state, rootState }, data) {
    commit('setGameRooms', data.game_rooms)
    // toast message when player joined or left the game
    if (data.game === state.currentGameRoom) {
      if (data.playerJoined !== undefined) {
        this._vm.$toast.info(data.playerJoined + ' a rejoint la partie')
      }
      if (data.playerLeft !== undefined) {
        this._vm.$toast.info(data.playerLeft + ' a quitté la partie')
      }
    }
  }
}

// mutations
const mutations = {
  setGameRooms (state, gameRooms) {
    state.gameRooms = gameRooms
  },
  setCurrentGameRoom (state, currentGameRoom) {
    state.currentGameRoom = currentGameRoom
  },
  setGameModeIsGod (state, isGod) {
    state.gameModeIsGod = isGod
  },
  setGameModeDisplayBoard (state, bool) {
    state.gameModeDisplayBoard = bool
  },
  pushBoardWord (state, word) {
    state.currentBoardWords.push(word)
  },
  resetBoardWords (state) {
    state.currentBoardWords = []
  },
  setBoardVariant (state, variant) {
    state.currentBoardVariant = variant
  },
  setBoardId (state, boardId) {
    state.boardId = boardId
  },
  SOCKET_CONNECT (state, data) {
    console.log('connected to server from game.js')
    if (state.boards.length === 0) {
      console.log('request boards to server')
      $socket.emit('get_boards', { })
    }
  },
  SOCKET_BOARDS_INFO (state, data) {
    // console.log('got socket board info', data)
    // retrieve boards from server websocket call
    state.boards = data
    console.log('boards info', data, state.boardId)
    if (state.boardId) {
      state.currentBoardGuessCards = data.find(x => x._id === state.boardId).guess_cards
    }
  },
  SOCKET_UPDATE_GAME_ROOMS (state, data) {
    // console.log('update game rooms from socket call')
    this.dispatch('updateGameRooms', data)
  }
}

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations
}