/*

### Component ###
This component displays the main header row

## Props ##

## Behavior ##

*/

<template>
  <b-container fluid>
    <h4 class="card-title text-left mt-2">Mode de jeu : plateaux</h4>
    <p class="text-left">TODO préciser les règles du jeu un peu ? TODO Et renvoyer vers la création des plateaux </p>
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
      stacked="md"
      striped>
      <div slot="table-busy" class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Chargement en cours...</strong>
      </div>
      <template slot="index" slot-scope="data">
        {{ data.index + 1 }}
      </template>
      <!-- replace variant by difficulty -->
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
                <b-list-group-item v-for="(word, key, index) in data.item.word_variants" :key="index" class="p-2">
                  {{ word }}
                </b-list-group-item>
              </b-list-group>
            </b-col>
            <b-col>
              <b-form>
                <b-input-group>
                  <b-form-input v-model="word_variant" placeholder="Synonymes, variante orthographique..."></b-form-input>
                  <b-input-group-append>
                    <b-button type="submit" @click.stop.prevent="addVariant(data.index, data.item)">Ajouter une variante</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form>
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
        <b-button size="sm"
          v-if="!is_player(data)" 
          @click="$router.push({ name: 'Playboard', params: { boardId: data.item._id} })"
          variant="primary" class="mr-1 p-2">
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
import $socket from '@/websocket-instance'

export default {
  name: 'Boards',
  components: {  },
  props: { },
  data: function () {
    return {
      word_variant: '',
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      filter: null,
      filterPlayerBoards: false,
      totalRows: 0,
      fields: [
        {
          key: 'index',
          label: 'Num',
          sortable: true
        },
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
        // {
        //   key: '_id',
        //   label: 'URL du plateau'
        // },
        {
          key: 'play',
          label: 'Jouer'
        }
      ]
    }
  },
  computed: {
    ...mapState ({
      boards: state => state.game.boards
    }),
    ...mapGetters([
      'user'
    ]),
    isBusy: function() {
      return this.boards.length === 0
    },
    boards_filtered: function() {
      return this.filter_board(this.boards)
    }
  },
  methods: {
    filter_board: function (boards) {
      if (boards.length > 0) {
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
      } else {
        return []
      }
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
    },
    addVariant(index, item) {
      // push a new variant to word_variant
      item.word_variants.push(this.word_variant)
      // update board on server
      $socket.emit('update_board_variants', {
        'creator': item.creator,  // need as key for request server-side
        'word': item.word,     // need as key for request server-side
        'word_variants': item.word_variants
      })
    }
  },
  created: function() {
    // trigger websocket at the server to get boards
    $socket.emit('get_boards', { })
  },
  sockets: {
    connect () {
    },
    disconnect() {
      // console.log('disconnected from server from boards.vue')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
