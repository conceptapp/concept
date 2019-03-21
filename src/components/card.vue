/*

### Component ###
This component displays a concept card

## Props ##
cards: all the cards of the game
card_id: the currentn card to be displayed

## Behavior ##
TODO add rollover to display tooltip

*/

<template>
  <section>
    <div class="row no-gutters">
              <!-- @click="test" -->
      <div
        @click="tooltipShown = !tooltipShown"
        :draggable="this.sharedState.gameModeAllowChange"
        v-on:dragend="dragend"
        v-on:touchend="touchend"
        v-on:touchmove="touchmove"
        class="col-auto concept-icon"
      >
<!--         v-on:dragstart="dragstart"
 -->
        <!-- v-on:touchstart="dragstart" -->

        <!-- v-on:dragover="dragover"
        v-on:dragenter="dragenter" -->
        <img
          :src="icon"
          :alt="cardInfo.Tooltip_fr"
          :title="cardInfo.Tooltip_fr"
        >
      </div>
      <transition name="fade">
        <div
          v-show="tooltipShown"
          class="col"
        >
          <div class="container-fluid tooltip-row">
            <div class="row align-items-center tooltip-row">
              <div class="col-auto px-1 px-sm-2">
                <p
                  v-html="cardInfo.Tooltip_fr"
                  class="card-text"
                />
              </div>
              <div
                v-if="addOrRemove == 'add' && this.sharedState.gameModeAllowChange"
                @click="tooltipShown = !tooltipShown;changeIcon('add-icon', cardInfo)"
                class="col-auto px-1 px-sm-2 icon-pointer"
              >
                <font-awesome-icon
                  :color="sharedState.selectedColor"
                  icon="plus-circle"
                  size="2x"
                />
              </div>
              <div
                v-if="addOrRemove == 'remove' && this.sharedState.gameModeAllowChange"
                @click="tooltipShown = !tooltipShown;changeIcon('remove-icon', cardInfo)"
                class="col-auto px-1 px-sm-2 icon-pointer"
              >
                <font-awesome-icon
                  :color="iconColor"
                  icon="trash"
                  size="2x"
                />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import { EventBus } from '@/event-bus.js'

export default {
  name: 'Card',
  props: {
    store: {
      type: Object,
      default: function () {
        return {}
      }
    },
    cardInfo: {
      type: Object,
      default: function () {
        return {}
      }
    },
    addOrRemove: {
      type: String,
      default: 'add'
    },
    iconColor: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      tooltipShown: false,
      sharedState: this.store.state
    }
  },
  computed: {
    icon: function () {
      return require('../assets/images/cards/' + this.cardInfo.type + '/' + this.cardInfo.Name + '.png')
    },
    gameMode: function() {
      return this.sharedState.gameMode
    }
  },
  watch: {
    gameMode: function (oldValue, newValue) {
      this.sharedState.gameModeAllowChange = !(this.sharedState.gameMode === 'godMode' && !this.sharedState.gameModeIsGod)
    }
  },
  methods: {
    changeIcon: function (addOrRemove, data) {
      // EventBus.$emit('remove-icon', cardInfo)
      EventBus.$emit(addOrRemove, data)
    },
    dragstart: function (ev) {
      console.log('getting dragged')
      // store the current card dragged
      this.sharedState.cardDragged = this.cardInfo
      // add current icon color (if empty, card comes from type rows, if color is set, card comes from guess row)
      this.sharedState.cardDragged['color'] = this.iconColor
    },
    dragend: function (ev) {
      // if card is dragged from guess row, remove card
      if (this.sharedState.cardDragged['color'] !== '') {
        EventBus.$emit('remove-icon', this.cardInfo)
      }
      // reset current dragged card
      this.sharedState.cardDragged = {}
    },
    touchmove: function(e) {
      console.log("touchmove: ", e)
      /* listen to the touchMove event,
      every time it fires, grab the location
      of touch and assign it to box */
      
      // grab the location of touch
      var touchLocation = e.targetTouches[0]
      
      // assign box new coordinates based on the touch.
      e.target.style.left = touchLocation.pageX + 'px'
      e.target.style.top = touchLocation.pageY + 'px'
      e.target.style.position = "absolute"
    },
    // test: function(e) {
    //   console.log('test')
    //   e.target.style.left = '40px'
    //   e.target.style.top = '250px'
    //   console.log(e.target)
    // },
    touchend: function(e) {
     /* record the position of the touch
      when released using touchend event.
      This will be the drop position. */
      
      // current box position.
      var x = parseInt(e.target.style.left)
      var y = parseInt(e.target.style.top)
      e.target.style.position = "relative"
    }
    // touchmove: function(event) {
    //   console.log('getting moved')
    //   var touch = event.targetTouches[0];
    //   // Place element where the finger is
    //   event.target.style.left = touch.pageX + 'px'
    //   event.target.style.top = touch.pageY + 'px'
    //   event.preventDefault()
    // },
    // touchHandler: function(event) {
    //   console.log('touchHandler called')
    //   var touches = event.changedTouches,
    //       first = touches[0],
    //       type = "";
    //        switch(event.type)
    //   {
    //       case "touchstart": type = "mousedown"; break;
    //       case "touchmove":  type="mousemove"; break;        
    //       case "touchend":   type="mouseup"; break;
    //       default: return;
    //   }
   
    //   var simulatedEvent = document.createEvent("MouseEvent");
    //   simulatedEvent.initMouseEvent(type, true, true, window, 1, 
    //                             first.screenX, first.screenY, 
    //                             first.clientX, first.clientY, false, 
    //                             false, false, false, 0/*left*/, null);
    //   first.target.dispatchEvent(simulatedEvent);
    //   event.preventDefault();
    // }
  }
  // ,
  // created () {
  //   document.addEventListener("touchstart", this.touchHandler, true);
  //   document.addEventListener("touchmove", this.touchHandler, true);
  //   document.addEventListener("touchend", this.touchHandler, true);
  //   document.addEventListener("touchcancel", this.touchHandler, true);
  //   document.addEventListener("touchmove", function(e){}, {passive:false});
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-text {
  white-space: pre-wrap;
  font-size: 0.9em;
  line-height: 1.1;
  text-align: left;
}
.concept-icon, .icon-pointer {
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.tooltip-row {
  height: 100%;
}
#box {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: #ccc;
}
</style>
