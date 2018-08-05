<template>

  <section>
    <article v-for="gallery in galleryList" :key="gallery.id">
      <nuxt-link :to="gallery.url">
        {{ gallery.name }}
      </nuxt-link>
    </article>
  </section>

</template>


<script>
  import { slug } from '../../utils/text';


  export default {
    props: {
      galleries: { default: () => [], type: Array },
    },

    computed: {
      galleryList() {
        const galleries = [];

        this.galleries.slice(0).forEach(gallery => {
          galleries.push({
            ...gallery,
            url: this.localePath({ name: 'galleries-id', params: { id: `${gallery.id}-${slug(gallery.name)}` } }),
          })
        });

        return galleries;
      }
    }
  };
</script>


<style scoped>

</style>
