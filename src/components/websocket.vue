<template>
  <div class="card mt-3">
    <div class="card-body">
      <div class="card-title">
        <h3>Chat Group</h3>
        <hr>
      </div>
      <div class="card-body">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="messages"
        >
          <p>{{ msg }}</p>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <form @submit.prevent="sendMessage">
        <div class="gorm-group">
          <label for="user">User:</label>
          <input
            v-model="user"
            type="text"
            class="form-control"
          >
        </div>
        <div class="gorm-group pb-3">
          <label for="message">Message:</label>
          <input
            v-model="message"
            type="text"
            class="form-control"
          >
        </div>
        <button
          type="submit"
          class="btn btn-success"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Websocket',
  data () {
    return {
      textarea: '',
      message: '',
      messages: [],
      count: 0,
      user: 'anonymous'
    }
  },
  sockets: {
    connect () {
      console.log('connected to chat server')
    },
    count (val) {
      this.count = val.count
    },
    message (data) { // this function gets triggered once a socket event of `message` is received
      // this.textarea += data + '\n' // append each new message to the textarea and add a line break
      // this.messages = [...this.messages, data];
      // you can also do this.messages.push(data)
      console.log('got message from server: ', data)
      this.messages.push(data)
    }
  },
  methods: {
    sendMessage () {
      console.log('sending message: ', this.message)
      // this will emit a socket event of type `function`
      this.$socket.emit('message', this.message) // send the content of the message bar to the server
      this.message = '' // empty the message bar
    }
  }
}
</script>
