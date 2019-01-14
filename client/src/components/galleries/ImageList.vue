<template>

  <section class="grid">
    <nuxt-link v-for="image in imageList"
               :key="image.id"
               :to="image.url"
               :style="image.style">
      <span v-if="image.description">{{ image.description }}</span>
    </nuxt-link>
  </section>

</template>


<script>
  export default {
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
            url:   this.url.replace(':imageId', image.id),
          })
        });

        return images;
      }
    }
  };
</script>


<style scoped>
  .grid a {
    padding: 0;
  }
  .grid a span {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
    flex: 1;
    padding: 1rem;
  }
</style>
