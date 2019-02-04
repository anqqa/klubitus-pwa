<template>

  <section class="masonry">
    <nuxt-link v-for="image in imageList"
               :key="image.id"
               :to="image.to"
               class="brick">
      <ResponsiveImage :src="image.url" desktop-size="25vw" tablet-size="33vw" mobile-size="50vw" />
      <span v-if="image.description">{{ image.description }}</span>
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
            style: `background-image: url(${image.url})`,
            to:    this.url.replace(':imageId', image.id),
          })
        });

        return images;
      }
    }
  };
</script>


<style scoped>
  .brick span {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
    bottom: 0;
    flex: 1;
    left: 0;
    padding: 1rem;
    position: absolute;
    right: 0;
  }
</style>
