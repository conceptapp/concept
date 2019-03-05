/*

### Component ###

## Props ##


## Behavior ##


*/

<template>
  <section class="container">
    <div class="card">
      <div class="card-header">Concept</div>
      <div class="card-body">
        Lorem ipsum
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'card',
  props: [''],
  methods: {
  },
  data: function () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding-top:10px;
}
.card {
  min-height:300px;
}
</style>
