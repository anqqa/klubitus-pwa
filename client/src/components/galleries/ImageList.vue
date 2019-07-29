<template>
  <section class="grid">
    <nuxt-link v-for="image in imageList" :key="image.id" :to="image.to">
      <figure>
        <ResponsiveImage
          :src="image.url"
          :color="image.color"
          :ratio="1"
          class="image is-square"
          desktop-size="25vw"
          tablet-size="33vw"
          mobile-size="50vw"
        />
        <figcaption v-if="image.description">{{ image.description }}</figcaption>
      </figure>
    </nuxt-link>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import ResponsiveImage from '@/components/ResponsiveImage.vue';
import Image from '@/models/Image';

@Component({
  components: { ResponsiveImage },
})
export default class ImageList extends Vue {
  @Prop() images!: Image[];
  @Prop() url!: string;

  get imageList() {
    const images: any[] = [];

    this.images.slice(0).forEach(image => {
      images.push({
        ...image,
        to: this.url.replace(':imageId', image.id!.toString()),
      });
    });

    return images;
  }
}
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
