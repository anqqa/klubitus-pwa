<template>
  <main class="row">
    <nav class="sidebar col-2">
      <nuxt-link :to="localePath('galleries')">Galleries Home</nuxt-link>
      <br />

      <h3 class="h6 has-text-tertiary">Event Photography</h3>
      <ul>
        <li>
          <nuxt-link :to="localePath('galleries-events-year-month-day')"
            >Browse Galleries</nuxt-link
          >
        </li>
        <li>
          Top 10
        </li>
      </ul>

      <h3 class="h6 has-text-tertiary">Flyers</h3>
      <ul>
        <li>
          <nuxt-link :to="localePath('galleries-flyers')">Browse Flyers</nuxt-link>
        </li>
        <li>
          Random Flyer
        </li>
      </ul>
    </nav>

    <div class="col main-content">
      <h1>Galleries</h1>

      <header>
        <h2>Latest in Event Photography</h2>

        <nav v-if="isAuthenticated" class="actions">
          <nuxt-link :to="localePath('galleries-upload')" class="button is-primary">
            <span class="icon"><i class="bx bx-cloud-upload"/></span>
            Upload Photos
          </nuxt-link>
        </nav>
      </header>

      <GalleryList :galleries="galleries" />

      <h2>Latest in Flyers</h2>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import GalleryList from '@/components/galleries/GalleryList.vue';
import { authStore } from '@/store/auth';
import { Actions, Getters } from '../../store/galleries';

@Component({
  components: { GalleryList },
  head: { title: 'Galleries' },
})
export default class GalleriesIndex extends Vue {
  @authStore.Getter isAuthenticated!: boolean;

  async fetch({ store }) {
    const getGalleries = store.getters[`galleries/${Getters.GALLERIES_BY_DATE}`];

    if (!getGalleries({}).length) {
      await store.dispatch(`galleries/${Actions.GET_GALLERIES_BY_DATE}`, { limit: 8 });
    }
  }

  get galleries() {
    const galleriesWithRelations: any[] = [];
    const getGalleries = this.$store.getters[`galleries/${Getters.GALLERIES_BY_DATE}`];
    const galleries: any[] = getGalleries({});

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
