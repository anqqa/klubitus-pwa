<template>

  <section class="grid">
    <nuxt-link v-for="gallery in galleryList"
               :key="gallery.id"
               :to="gallery.to">
      <figure>
        <ResponsiveImage v-if="gallery.imageUrl"
                         :src="gallery.imageUrl"
                         :color="gallery.imageColor"
                         :ratio="16/9"
                         class="image is-16by9"
                         desktop-size="25vw"
                         tablet-size="33vw"
                         mobile-size="50vw" />
        <div v-else class="image is-16by9" />
        <figcaption>
          <h3 class="h6">{{ gallery.name }}</h3>
        </figcaption>
      </figure>
    </nuxt-link>
  </section>

</template>


<script>
  import { slug } from '../../utils/text';
  import ResponsiveImage from '../ResponsiveImage';


  export default {
    components: { ResponsiveImage },
    props: {
      galleries: { default: () => [], type: Array },
    },

    computed: {
      galleryList() {
        const galleries = [];

        this.galleries.slice(0).forEach(gallery => {
          galleries.push({
            ...gallery,
            imageColor: gallery.default_image && gallery.default_image.color,
            imageUrl:   gallery.default_image && gallery.default_image.url,
            to:         this.localePath({ name: 'galleries-id', params: { id: `${gallery.id}-${slug(gallery.name)}` } }),
          })
        });

        return galleries;
      }
    }
  };
</script>


<style scoped>
  a {
    transition: opacity 0.1s ease-in-out;
  }

  figure {
    position: relative;
  }

  figcaption {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
    bottom: 0;
    flex: 1;
    left: 0;
    padding: 1rem;
    position: absolute;
    right: 0;
  }
</style>
