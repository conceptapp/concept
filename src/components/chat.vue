/*

### Component ###
This component displays the chat box
Design inspired by https://bootsnipp.com/snippets/nNg98

## Props ##

## Behavior ##

*/

<template>
  <div id="chatbox" class="container-fluid h-100">
    <div class="row justify-content-center h-100">
      <div class="col-md-8 col-xl-6 chat">
        <div class="card">
          <div class="card-header msg_head">
            <div class="d-flex bd-highlight">
              <div class="img_cont">
                <img src="https://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg" class="rounded-circle user_img">
                <span class="online_icon"></span>
              </div>
              <div class="user_info">
                <span>{{currentGameRoom}}</span>
              </div>
            </div>
            <span id="action_menu_btn"><i class="fas fa-ellipsis-v"></i></span>
            <div class="action_menu">
              <ul>
                <li><i class="fas fa-user-circle"></i> View profile</li>
                <li><i class="fas fa-users"></i> Add to close friends</li>
                <li><i class="fas fa-plus"></i> Add to group</li>
                <li><i class="fas fa-ban"></i> Block</li>
              </ul>
            </div>
          </div>
          <div class="card-body msg_card_body">
            <div class="d-flex justify-content-start mb-4">
              <div class="img_cont_msg">
                <img src="https://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg" class="rounded-circle user_img_msg">
              </div>
              <div class="msg_cotainer">
                Hi, how are you samim?
                <span class="msg_time">8:40 AM, Today</span>
              </div>
            </div>
            <div class="d-flex justify-content-end mb-4">
              <div class="msg_cotainer_send">
                Hi Maryam i am good tnx how about you?
                <span class="msg_time_send">8:55 AM, Today</span>
              </div>
              <div class="img_cont_msg">
                <img src="https://via.placeholder.com/40">
              </div>
            </div>
            <div class="d-flex justify-content-start mb-4">
              <div class="img_cont_msg">
                <img src="https://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg" class="rounded-circle user_img_msg">
              </div>
              <div class="msg_cotainer">
                I am good too, thank you for your chat template
                <span class="msg_time">9:00 AM, Today</span>
              </div>
            </div>
            <div class="d-flex justify-content-end mb-4">
              <div class="msg_cotainer_send">
                You welcome Maryam
                <span class="msg_time_send">9:05 AM, Today</span>
              </div>
              <div class="img_cont_msg">
                <img src="https://via.placeholder.com/40">
              </div>
            </div>
            <div class="d-flex justify-content-start mb-4">
              <div class="img_cont_msg">
                <img src="https://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg" class="rounded-circle user_img_msg">
              </div>
              <div class="msg_cotainer">
                I am looking for your next templates
                <span class="msg_time">9:07 AM, Today</span>
              </div>
            </div>
            <div class="d-flex justify-content-end mb-4">
              <div class="msg_cotainer_send">
                Ok, thank you have a good day
                <span class="msg_time_send">9:10 AM, Today</span>
              </div>
              <div class="img_cont_msg">
                <img src="https://via.placeholder.com/40">
              </div>
            </div>
            <div class="d-flex justify-content-start mb-4">
              <div class="img_cont_msg">
                <img src="https://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg" class="rounded-circle user_img_msg">
              </div>
              <div class="msg_cotainer">
                Bye, see you
                <span class="msg_time">9:12 AM, Today</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="input-group">
              <textarea name="" class="input-chat form-control type_msg" placeholder="Type your message..."></textarea>
              <div class="input-group-append">
                <span class="input-group-text send_btn"><font-awesome-icon icon="location-arrow" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'Chat',
  components: { },
  data: function () {
    return {
    }
  },
  computed: {
    ...mapState ({
      currentGameRoom: state => state.game.currentGameRoom,
      gameMode: state => state.game.gameMode,
    }),
    ...mapGetters([
    ]),
  },
  methods: {
    ...mapMutations([
    ]),
    addIcon: function (data) {
      // Name, Tooltip_fr
      // check if user is allowed to change guess cards
      if (!this.isBoardEditable) { 
        // display error message, user is not allowed to change cards
        this.pushAlert({
          msg: "Désolé, seul l'organisateur de la partie peut modifier les cartes",
          dismissCountDown: 5,
          variant: 'danger'
        })
      } else {
        this.pushGuessCards({ 'color': this.selectedColor, 'cards': data })
      }
    },
  },
  created () {
    // listen to events
    EventBus.$on('add-icon', data => this.addIcon(data))
  },  
  sockets: {
    connect () {
      // console.log('connected to main server')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat{
  margin-top: auto;
  margin-bottom: auto;
}
.card{
  height: 500px;
  border-radius: 15px !important;
  background-color: rgba(0,0,0,0.4) !important;
}
.contacts_body{
  padding:  0.75rem 0 !important;
  overflow-y: auto;
  white-space: nowrap;
}
.msg_card_body{
  overflow-y: auto;
}
.card-header{
  border-radius: 15px 15px 0 0 !important;
  border-bottom: 0 !important;
}
.card-footer{
border-radius: 0 0 15px 15px !important;
  border-top: 0 !important;
}
.container{
  align-content: center;
}
.search{
  border-radius: 15px 0 0 15px !important;
  background-color: rgba(0,0,0,0.3) !important;
  border:0 !important;
  color:white !important;
}
.search:focus{
     box-shadow:none !important;
       outline:0px !important;
}
.type_msg{
  background-color: rgba(0,0,0,0.3) !important;
  border:0 !important;
  color:white !important;
  height: 60px !important;
  overflow-y: auto;
}
  .type_msg:focus{
     box-shadow:none !important;
       outline:0px !important;
}
.input-chat{
border-radius: 15px 0 0 15px !important;
}
.send_btn{
border-radius: 0 15px 15px 0 !important;
background-color: rgba(0,0,0,0.3) !important;
  border:0 !important;
  color: white !important;
  cursor: pointer;
}
.search_btn{
  border-radius: 0 15px 15px 0 !important;
  background-color: rgba(0,0,0,0.3) !important;
  border:0 !important;
  color: white !important;
  cursor: pointer;
}
.contacts{
  list-style: none;
  padding: 0;
}
.contacts li{
  width: 100% !important;
  padding: 5px 10px;
  margin-bottom: 15px !important;
}
.active{
  background-color: rgba(0,0,0,0.3);
}
.user_img{
  height: 70px;
  width: 70px;
  border:1.5px solid #f5f6fa;

}
.user_img_msg{
  height: 40px;
  width: 40px;
  border:1.5px solid #f5f6fa;

}
.img_cont{
  position: relative;
  height: 70px;
  width: 70px;
}
.img_cont_msg{
  height: 40px;
  width: 40px;
}
.online_icon{
position: absolute;
height: 15px;
width:15px;
background-color: #4cd137;
border-radius: 50%;
bottom: 0.2em;
right: 0.4em;
border:1.5px solid white;
}
.offline{
background-color: #c23616 !important;
}
.user_info{
margin-top: auto;
margin-bottom: auto;
margin-left: 15px;
}
.user_info span{
font-size: 20px;
color: white;
}
.user_info p{
font-size: 10px;
color: rgba(255,255,255,0.6);
}
.msg_cotainer{
margin-top: auto;
margin-bottom: auto;
margin-left: 10px;
border-radius: 25px;
background-color: #82ccdd;
padding: 10px;
position: relative;
}
.msg_cotainer_send{
margin-top: auto;
margin-bottom: auto;
margin-right: 10px;
border-radius: 25px;
background-color: #78e08f;
padding: 10px;
position: relative;
}
.msg_time{
position: absolute;
left: 0;
bottom: -15px;
color: rgba(255,255,255,0.5);
font-size: 10px;
}
.msg_time_send{
position: absolute;
right:0;
bottom: -15px;
color: rgba(255,255,255,0.5);
font-size: 10px;
}
.msg_head{
position: relative;
}
#action_menu_btn{
position: absolute;
right: 10px;
top: 10px;
color: white;
cursor: pointer;
font-size: 20px;
}
.action_menu{
z-index: 1;
position: absolute;
padding: 15px 0;
background-color: rgba(0,0,0,0.5);
color: white;
border-radius: 15px;
top: 30px;
right: 15px;
display: none;
}
.action_menu ul{
list-style: none;
padding: 0;
margin: 0;
}
.action_menu ul li{
width: 100%;
padding: 10px 15px;
margin-bottom: 5px;
}
.action_menu ul li i{
padding-right: 10px;

}
.action_menu ul li:hover{
cursor: pointer;
background-color: rgba(0,0,0,0.2);
}
@media(max-width: 576px){
.contacts_card{
margin-bottom: 15px !important;
}
}
</style>
