/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
  <b-container fluid>
    <h4 class="card-title text-left mt-2">Mode de jeu : plateaux</h4>
    <p class="text-left"> préciser les règles du jeu un peu ? </p>
    <h4 class="card-title text-left mt-2">Plateaux disponibles</h4>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Filtre" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Recherchez par joueur, mot, difficulté..."></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Effacer</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Par page" class="mb-0">
          <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
        </b-form-group>
      </b-col>

<!--       <b-col md="6" class="my-1 text-right">
        <b-form-checkbox
          id="checkbox-player-boards"
          v-model="filterPlayerBoards"
          name="checkbox-player-boards"
          :value="true"
          :unchecked-value="false">
          Uniquement vos plateaux
        </b-form-checkbox>
      </b-col> -->
    </b-row>

    <!-- create a fake index -->
    <b-table 
      :fields="fields" 
      :items="boards_filtered" 
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      @filtered="onFiltered"
      :busy="isBusy" 
      striped>
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
      <!-- display words if user created the board -->
      <template slot="word" slot-scope="data">
        <span v-if="is_player(data)">{{ data.item.word_variants[0] }}</span>
      </template>
      <!-- display words if user created the board -->
      <template slot="word_variants" slot-scope="data">
        <b-button size="sm" v-if="is_player(data)" @click="data.toggleDetails" variant="outline-secondary" class="mr-1 p-1">
          {{ data.detailsShowing ? 'Masquer' : 'Voir les variantes' }}
        </b-button>
      </template>
      <template slot="row-details" slot-scope="data">
        <b-card>
          <b-row class="mb-2">
            <b-col>
              <b-list-group>
                <b-list-group-item v-for="(word, key, index) in data.item.word_variants" :key="index" class="p-1">
                  {{ word }}
                </b-list-group-item>
              </b-list-group>
            </b-col>
            <b-col>
              <b-button size="sm" @click="this.alert('bientôt sur vos écrans')" class="mr-1 p-1">
                Ajouter des variantes
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </template>
      <!-- display count of players and button to access Hall of Fame -->
      <template slot="players" slot-scope="data">
        {{ data.value.length }}
      </template>
      <!-- display count of players and button to access Hall of Fame -->
      <template slot="scores" slot-scope="data">
        <!-- TODO v-if="data.value.length>0" -->
        <b-button size="sm" @click="this.alert('TODO lancer le Hall of Fame')" variant="outline-secondary" class="mr-1 p-1">
          Voir les scores
        </b-button>
      </template>
      <!-- display Play button -->
      <template slot="play" slot-scope="data">
        <b-button size="sm" v-if="!is_player(data)" @click="this.alert('TODO lancer le jeu / ouvrir le lien en fait ?')" variant="primary" class="mr-1 p-2">
          Jouer
        </b-button>
      </template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'Boards',
  components: {  },
  props: { },
  data: function () {
    return {
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      filter: null,
      filterPlayerBoards: false,
      isBusy: true,
      boards: [],
      boards_filtered: [],
      totalRows: 0,
      fields: [
        'index',
        {
          key: 'creator',
          label: 'Créé par',
          sortable: true
        },
        {
          key: 'difficulty',
          label: 'Difficulté',
          sortable: true
        },
        {
          key: 'createdAt',
          label: 'Créé le',
          formatter: (value, key, item) => {
            return new Date(value).toLocaleDateString('fr-fr')
          },
          sortable: true
        },
        {
          key: 'word',
          label: 'Mot à deviner',
          sortable: true
        },
        {
          key: 'word_variants',
          label: 'Variantes'
        },
        {
          key: 'players',
          label: 'Nombre de joueurs',
          sortable: true
        },
        {
          key: 'scores',
          label: 'Meilleurs scores'
        },
        {
          key: '_id',
          label: 'URL du plateau'
        },
        {
          key: 'play',
          label: 'Jouer'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['user']),
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
    filter_display: function(item, filter) {
      console.log(item)
      return this.is_player(item) // && filterPlayerBoards
    },
    format_difficulty: function (d) {
      switch (d) {
        case 'danger':
          return 'difficile'
        case 'warning':
          return 'moyen'
        default:
          return 'facile'
      }
    },
    is_player: function (el) {
      // allow words display if current player is creator
      if (this.user) {
        return el.item.creator === this.user.displayName
      } else {
        return false
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  },
  sockets: {
    connect () {
      console.log('connected to main server from boards.vue')
      // this.isBusy = true
      this.$root.$socket.emit('get_boards', { })
    },
    disconnect() {
      console.log('disconnnected to server from boards.vue')
    },
    boards_info (data) {
      // retrieve boards from server
      console.log('boards_info', data)
      this.isBusy = false
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
