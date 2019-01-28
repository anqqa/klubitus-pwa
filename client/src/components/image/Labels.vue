<template>

  <div class="labels">
    <ul>
      <LabelTree v-for="label in labels" :key="label.name" :label="label" />
    </ul>
  </div>

</template>


<script>
  import LabelTree from './LabelTree';


  export default {
    name: 'Labels',

    components: { LabelTree },

    props: {
      labels: { default: () => [], type: Array },
    },
  };
</script>


<style scoped>
  ul {
    list-style: none;
  }
</style>
