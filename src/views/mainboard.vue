<template>
  <div>
    <MainRow />
    <div class="container-body">
      <div id="concept-cards">
        <!-- display all the concept types -->
        <section
          v-for="type in types"
          :key="type.id"
        >
          <typeRow :type="type" />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MainRow from '@/components/main-row'
import TypeRow from '@/components/type-row'

export default {
  name: 'Mainboard',
  components: { MainRow, TypeRow },
  data: function () {
    return {
    }
  },
  computed: mapState ({
    types: state => state.cards.types,
    cards: state => state.cards.cards
  }),
  methods: {
  },
  created () {
    // retrieve all the main types from Airtable
    this.$store.dispatch('retrieveRecords', {'recordType': 'Types'})
    // retrieve all the cards from airtable (100 records max per request)
    this.$store.dispatch('retrieveRecords', { 'recordType': 'Cards'})
  }
}
</script>

<style>
#concept-cards {
  margin-left: 15px;
}
</style>
