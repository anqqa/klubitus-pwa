<template>
  <v-row>
    <v-col cols="6" md="3" v-for="image in imageList" :key="image.id" class="d-flex child-flex">
      <v-card :to="image.to" nuxt>
        <ResponsiveImage
          :src="image.url"
          :color="image.color"
          aspect-ratio="1"
          position="center top"
          desktop-size="25vw"
          tablet-size="33vw"
          mobile-size="50vw"
        />
        <v-card-actions v-if="image.description" class="caption">
          {{ image.description }}
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
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
