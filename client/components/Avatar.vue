<template>
  <figure class="image avatar is-48x48">
    <img v-if="imageUrl" :src="imageUrl" alt="Avatar">
    <span v-else
          :class="theme"
          class="icon is-full">{{ initials }}</span>
  </figure>
</template>


<script>
  import { colorFromText } from '../utils/text';


  export default {
    props: {
      imageUrl: { default: null, type: String },
      name:     { default: null, type: String },
    },

    computed: {
      initials() { return this.name.substr(0, 2); },
      theme()    { return 'theme-' + colorFromText(this.name); },
    }
  };
</script>
