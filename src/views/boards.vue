/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h5 class="card-title text-left">Plateaux disponibles</h5>
        <!-- create a fake index -->
        <b-table :fields="fields" :items="boards_filtered" striped>
          <template slot="index" slot-scope="data">
            {{ data.index + 1 }}
          </template>
          <!-- replace variant by difficulty -->
          <template slot="_id" slot-scope="data">
            <b-link :to="{ name: 'Mainboard', params: { boardId: data.value } }">{{data.value}}</b-link>
          </template>          <!-- replace variant by difficulty -->
          <template slot="difficulty" slot-scope="data">
            {{ format_difficulty(data.value) }}
          </template>
          <!-- format date creation -->
          <template slot="createdAt" slot-scope="data">
            {{ data.value }}
          </template>
          <!-- display count of players -->
          <template slot="players" slot-scope="data">
            {{ data.value.length }}
          </template>
          <!-- display words if user created the board -->
          <template slot="word_variants" slot-scope="data">
            <b-button size="sm" @click="data.toggleDetails" class="mr-2" v-if="display_words(data)">
              {{ data.detailShowing ? 'Masquer' : 'Afficher' }} les mots
            </b-button>
          </template>
          <template slot="row-details" slot-scope="data">
            <b-card>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right">Test</b-col>
                <b-col>{{ data.value }}</b-col>
              </b-row>
            </b-card>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'Boards',
  components: {  },
  props: {
    store: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
      boards: [],
      boards_filtered: [],
      fields: [
        'index',
        {
          key: 'creator',
          label: 'Créé par'
        },
        {
          key: '_id',
          label: 'URL du plateau'
        },
        {
          key: 'difficulty',
          label: 'Difficulté'
        },
        {
          key: 'createdAt',
          label: 'Créé le',
          formatter: (value, key, item) => {
            return new Date(value).toLocaleDateString('fr-fr')
          }
        },
        {
          key: 'word_variants',
          label: 'Mot et variantes'
        },
        {
          key: 'players',
          label: 'Nombre de joueurs'
        }
      ]
    }
  },
  computed: {
    ...mapState ({
      playerName: state => state.game.playerName
    })
  },
  methods: {
    filter_board: function (boards) {
      return boards.map( (item) => {
        let tmp = item
        tmp['_cellVariants'] = { difficulty: item.difficulty }
        return tmp
      })
      boards.forEach( function(board) {
        // delete board['word_variants']
        // board['Créé par'] = board['creator']
        // delete board['creator']

      })
      return boards
    },
    format_difficulty: function (d) {
      switch (d) {
        case 'danger':
          return 'difficile'
        case 'alert':
          return 'moyen'
        default:
          return 'facile'
      }
    },
    display_words: function (el) {
      // allow words display if current player is creator
      console.log(el)
      return el.item.creator === this.playerName
    }
  },
  sockets: {
    connect () {
      console.log('connected to main server from boards.vue')
      this.$root.$socket.emit('get_boards', { })
    },
    disconnect() {
      console.log('disconnnected to server from boards.vue')
    },
    boards_info (data) {
      // retrieve boards from server
      console.log('boards_info', data)
      this.boards = data
      // and clean up data
      this.boards_filtered = this.filter_board(data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
