<template>

  <section class="masonry">
    <nuxt-link v-for="image in imageList"
               :key="image.id"
               :to="image.to"
               class="brick">
      <figure>
        <ResponsiveImage :src="image.url"
                         :color="image.color"
                         :ratio="1"
                         class="image is-square"
                         desktop-size="25vw"
                         tablet-size="33vw"
                         mobile-size="50vw" />
        <figcaption v-if="image.description">{{ image.description }}</figcaption>
      </figure>
    </nuxt-link>
  </section>

</template>


<script>
  import ResponsiveImage from '../ResponsiveImage';


  export default {
    components: { ResponsiveImage },

    props: {
      images: { default: () => [], type: Array },
      url:    { default: '', type: String },
    },

    computed: {
      imageList() {
        const images = [];

        this.images.slice(0).forEach(image => {
          images.push({
            ...image,
            to: this.url.replace(':imageId', image.id),
          })
        });

        return images;
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
