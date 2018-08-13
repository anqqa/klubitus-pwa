<template>

  <div>
    kuveja
  </div>

</template>


<script>
  export default {

    async asyncData({ app, params, query }) {
      console.log(params, query);
    },

    watchQuery: ['page'],

  };
</script>


<style scoped>

</style>
