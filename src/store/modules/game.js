import $socket from '@/websocket-instance'
import { EventBus } from '@/event-bus.js'
import router from '../../router/index.js'

// initial state
const state = {
  currentGameRoom: '',
  gameRooms: [],
  gameMode: '', // boardPlay, boardCreation, godMode, allPlayersMode, local
  // gameModeDisplayBoard: false,
  currentBoardWords: [],
  currentBoardVariant: '',
  // currentBoardGuessCards: {},
  isPlayingBoard: null, // true if user has started a board game in boardPlay mode
  boards: {},
  boardId: '' // keep the variable for socket calls, preferably use the getter if on playboard (url param should be set up)
}

// getters
const getters = {
  boardId: (state, getters, rootState) => {
    // console.log('getters board Id', router.currentRoute.params.boardId)
    if (state.boardId && state.boardId !== router.currentRoute.params.boardId) { // keep this test to watch state.boardId in the getter
      console.log('boardId and route are differents', state.boardId, router.currentRoute.params.boardId)
    }
    return router.currentRoute.params.boardId
  },
  gameModeIsGod: (state, getters, rootState) => {
    console.log('gameModeIsGod', state, getters, rootState)
    if (state.gameRooms[state.currentGameRoom]) {
      return state.gameRooms[state.currentGameRoom].creator_email === rootState.user.user.email
    } else {
      return false
    }
  },
  gameModeDisplayBoard: (state, getters, rootState) => {
    // getter should be used on playBoard mode to display guessCards
    // if user is currently playing (timer running) or if user gave up or found, return true
    return state.isPlayingBoard || getters.isBoardAlreadyPlayed(getters.boardId)
  },
  gameModeMultiplayers: state => {
    return ['allPlayersMode','godMode'].indexOf(state.gameMode) !== -1
  },
  getBoard: (state, getters, rootState) => (boardId) => {
    // return board information for boardId
    // console.log('currentboard', state.boards, "boardId", boardId, "length", state.boards.length)
    if (boardId !== undefined && state.boards.length > 0) {
      return state.boards.find(x => x._id === boardId)
    } else {
      return undefined
    }
  },
  getBoardGuessCards: (state, getters, rootState) => (boardId) => {
    // console.log('getBoardGuessCards', state, getters, rootState, boardId)
    // return guessCards for the boardId in param
    if (boardId !== undefined) {
      var board = getters.getBoard(getters.boardId)
    }
    if (board) {
      return board.guess_cards
    } else {
      // if boards are not loaded yet (or wrong boardId) init an empty object with colors to avoid javascript error in console
      var obj = {}
      for (var i = 0; i < rootState.cards.colors.length; i++) {
        obj[rootState.cards.colors[i]] = []
      }
      return obj
    }
  },
  getBoardWords: (state, getters, rootState) => (boardId) => {
    // console.log('getBoardWords', state, getters, rootState, boardId)
    // return word and variants for the boardId in param
    if (boardId !== undefined) {
      return getters.getBoard(getters.boardId).word_variants
    } else {
      return []
    }
  },
  getBoardPlayerInfo: (state, getters, rootState) => (boardId) => {
    // return the player information (playerName, playerEmail, found, timeSpent: Number in milliseconds, lastPlayed: Date)
    var board = getters.getBoard(boardId)
    if (board && rootState.user.user !== null) {
      return board.players.filter(item => item.playerEmail === rootState.user.user.email)[0]
    } else {
      return {}
    }
  },
  isBoardAlreadyPlayed: (state, getters, rootState) => (boardId) => {
    // return true if current user has already played this board
    var board = getters.getBoard(boardId)
    // console.log('isBoardAlreadyPlayed', board, board.word, boardId)
    if (board && rootState.user.user !== null) {
      // check if user email matches any of the players and if he won or he gave up
      return board.players.some(function (item) {
        return item.playerEmail === rootState.user.user.email && (item.found || item.gaveUp)
      })
    } else {
      return false
    }
  },
  isBoardEditable: (state, getters, rootState) => {
    // board is editable unless gameMode == boardPlay or gameMode == isGod and player is not God
    return !(state.gameMode === 'boardPlay' || (state.gameMode === 'godMode' && !getters.gameModeIsGod))
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
    console.log('set gameRooms', gameRooms)
    state.gameRooms = gameRooms
  },
  setCurrentGameRoom (state, currentGameRoom) {
    state.currentGameRoom = currentGameRoom
  },
  setGameModeIsGod (state, isGod) {
    state.gameModeIsGod = isGod
  },
  // setGameModeDisplayBoard (state, bool) {
  //   state.gameModeDisplayBoard = bool
  // },
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
  setIsPlayingBoard (state, isPlaying) {
    state.isPlayingBoard = isPlaying
  },
  SOCKET_CONNECT (state, data) {
    // console.log('connected to server from game.js')
    if (Object.keys(state.boards).length === 0) {
      console.log('request boards to server')
      $socket.emit('get_boards', { })
    }
  },
  SOCKET_BOARDS_INFO (state, data) {
    // console.log('got socket board info', data)
    // retrieve boards from server websocket call
    state.boards = data
    if (state.boardId && state.boards.length > 0) {
      state.currentBoardGuessCards = data.find(x => x._id === state.boardId).guess_cards
    }
  },
  SOCKET_UPDATE_GAME_ROOMS (state, data) {
    console.log('update game rooms from socket call', state, data)
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