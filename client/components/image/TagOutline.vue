<template>
  <div :style="style" class="tag-outline" />
</template>


<script>
  import { sizeToStyle } from '../../utils/style';


  export default {
    props: {
      tag: { default: () => null, type: Object }
    },

    computed: {
      style: {
        cache: false,
        get()  { return sizeToStyle(this.tag); },
      }
    }
  };
</script>


<style scoped>
  .tag-outline {
    border: 1px dashed rgba(255, 255, 255, 0.5);
    outline: 1px dashed rgba(0, 0, 0, 0.5);
    position: absolute;
  }
</style>
