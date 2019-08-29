<template>
  <v-container fluid>
    <v-row justify="space-between">
      <v-col cols="12" md="6">
        <h1 class="display-1">Latest in Event Photography</h1>
      </v-col>
      <v-col v-if="isAuthenticated" cols="auto">
        <v-btn :to="localePath('galleries-upload')" color="primary" nuxt>
          <v-icon left>mdi-image-plus</v-icon> Add Photos
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="9">
        <GalleryList :galleries="galleries" />
      </v-col>

      <v-col md="3">
        <v-navigation-drawer floating permanent right width="100%">
          <v-list nav>
            <v-list-item :to="localePath('galleries')" nuxt>
              <v-list-item-content>Galleries Home</v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-subheader class="text-uppercase">Event Photography</v-subheader>
            <v-list-item-group>
              <v-list-item :to="localePath('galleries-events-year-month-day')" nuxt>
                <v-list-item-content>
                  <v-list-item-title>Browse Galleries</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item nuxt>
                <v-list-item-content>
                  <v-list-item-title>Top 10</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>

            <v-divider />

            <v-subheader class="text-uppercase">Flyers</v-subheader>
            <v-list-item-group>
              <v-list-item :to="localePath('galleries-flyers')" nuxt>
                <v-list-item-content>
                  <v-list-item-title>Browse Flyers</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item nuxt>
                <v-list-item-content>
                  <v-list-item-title>Random Flyer</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import GalleryList from '@/components/galleries/GalleryList.vue';
import { authStore } from '@/store/auth';
import { Actions, DatePayload, galleriesStore, Getters } from '@/store/galleries';

@Component({
  components: { GalleryList },
  head: { title: 'Galleries' },
})
export default class GalleriesIndex extends Vue {
  @authStore.Getter
  isAuthenticated!: boolean;

  @galleriesStore.Getter(Getters.GALLERIES_BY_DATE)
  getGalleriesByDate!: (date: DatePayload, page?: number) => any;

  async fetch({ store }) {
    const getGalleries = store.getters[`galleries/${Getters.GALLERIES_BY_DATE}`];

    if (!getGalleries({}).length) {
      await store.dispatch(`galleries/${Actions.GET_GALLERIES_BY_DATE}`, { limit: 8 });
    }
  }

  get galleries() {
    const galleriesWithRelations: any[] = [];
    const galleries: any[] = this.getGalleriesByDate({});

    galleries.forEach(gallery =>
      galleriesWithRelations.push({
        ...gallery,
        default_image:
          gallery.default_image_id && this.$store.state.images.images[gallery.default_image_id],
      })
    );

    return galleriesWithRelations;
  }
}
</script>
