<template>

  <section class="grid">
    <nuxt-link v-for="gallery in galleryList"
               :key="gallery.id"
               :to="gallery.url"
               :style="gallery.style">
      <h3 class="h6">{{ gallery.name }}</h3>
    </nuxt-link>
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
            style: gallery.default_image ? `background-image: url(${gallery.default_image.url})` : '',
            url:   this.localePath({ name: 'galleries-id', params: { id: `${gallery.id}-${slug(gallery.name)}` } }),
          })
        });

        return galleries;
      }
    }
  };
</script>


<style scoped>
  .grid a {
    padding: 0;
  }
  .grid a h3 {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
    flex: 1;
    padding: 1rem;
  }
</style>
