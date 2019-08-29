<template>
  <v-row>
    <v-col
      cols="6"
      md="4"
      v-for="gallery in galleryList"
      :key="gallery.id"
      class="d-flex child-flex"
    >
      <v-card :to="gallery.to" nuxt>
        <ResponsiveImage
          v-if="gallery.imageUrl"
          :src="gallery.imageUrl"
          :color="gallery.imageColor"
          aspect-ratio="1"
          position="center top"
          gradient="to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 100%"
          desktop-size="20vw"
          tablet-size="33vw"
          mobile-size="50vw"
        >
          <v-card-title class="fill-height align-end white--text title" v-text="gallery.name" />
        </ResponsiveImage>

        <v-card-actions class="justify-space-between caption">
          <span v-if="gallery.date">{{ gallery.date }}</span>

          <span v-if="gallery.image_count" title="Images">
            <v-icon left x-small>mdi-camera</v-icon> {{ gallery.image_count }}
          </span>

          <span v-if="gallery.comment_count" title="Comments">
            <v-icon right x-small>mdi-comment</v-icon> {{ gallery.comment_count }}
          </span>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { format, parseISO } from 'date-fns';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import ResponsiveImage from '@/components/ResponsiveImage.vue';
import Gallery from '@/models/Gallery';
import { slug } from '@/utils/text';

@Component({
  components: { ResponsiveImage },
})
export default class GalleryList extends Vue {
  @Prop() galleries!: Gallery[];

  get galleryList() {
    const galleries: any[] = [];

    this.galleries.slice(0).forEach(gallery => {
      galleries.push({
        ...gallery,
        date: format(parseISO(gallery.event_date!), 'd MMM yyyy'),
        imageColor: gallery.default_image && gallery.default_image.color,
        imageUrl: gallery.default_image && gallery.default_image.url,
        to: this.localePath({
          name: 'galleries-id',
          params: { id: `${gallery.id}-${slug(gallery.name)}` },
        }),
      });
    });

    return galleries;
  }
}
</script>
