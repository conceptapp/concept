/*

### Component ###
This component displays the chat box
Design inspired by https://bootsnipp.com/snippets/nNg98

## Props ##

## Behavior ##

*/

<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :title="currentGameRoom"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showFile="false"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      placeholder="Ecrivez votre message" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import $socket from '@/websocket-instance'
// import { EventBus } from '@/event-bus.js'
import hash from 'object-hash'

export default {
  name: 'Chat',
  components: { },
  data() {
    return {
      messageList: [], // the list of the messages to show, can be paginated and adjusted dynamically
      // currently empty, could be filled with history when user join the game
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#1693A5',
          text: '#ffffff'
        },
        launcher: {
          bg: '#1693A5'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#1693A5',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown
    }
  },
  computed: {
    ...mapState ({
      currentGameRoom: state => state.game.currentGameRoom,
      gameRooms: state => state.game.gameRooms,
    }),
    ...mapGetters ([
      'user'
    ]),
    participants: function() {
      if (!this.gameRooms[this.currentGameRoom]) { return [] }
      // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      return this.gameRooms[this.currentGameRoom].players.map(function(el) { 
        // console.log("in participants", el)
        return {
          'id': el.chatId,
          'name': el.name,
          'imageUrl': el.avatarUrl ? el.avatarUrl : 'https://api.adorable.io/avatars/100/abott@adorable.png'
        }
      })
    }
  },
  methods: {
    sendMessage (text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
      }
    },
    onMessageWasSent (message) {
      // called when the user sends a message
      this.messageList = [ ...this.messageList, message ]
      // emit a websocket to push message to the other players
      // console.log('onMessageWasSent', message)
      $socket.emit('chat_new_message_from_client', {
        'game_room': this.currentGameRoom,
        'message': {
          // 'playerName': this.user.displayName,
          'author': hash(this.user.email),
          'data': message.data,
          'type': message.type
        }
      })
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    }
  }, 
  sockets: {
    chat_new_message_from_server (data) {
      console.log('got new chat message from server', data)
      var message = data.message
      // if author is me, then don't take into account, message was already pushed
      if (message.author !== hash(this.user.email)) {
        this.messageList = [ ...this.messageList, message ]
        this.newMessagesCount = this.newMessagesCount + 1
      } else {
        console.log('message sent by me :)')
      }
    }
  }
}
</script>

<style>
.sc-chat-window, .sc-launcher {
  z-index: 99;
}
</style>
