<template>
  <v-container fluid>
    <v-row justify="space-between">
      <v-col cols="12" md="6">
        <h1 class="display-1" v-text="title" />
        <h2 v-if="galleries" class="headline">
          {{ format(galleries) }} galleries with {{ format(images) }} images
        </h2>
      </v-col>
      <v-col v-if="isAuthenticated" cols="auto">
        <v-btn :to="localePath('galleries-upload')" color="primary" nuxt>
          <v-icon left>mdi-image-plus</v-icon> Add Photos
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="9">
        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />

        <nuxt-child :key="$route.fullPath" />

        <v-pagination v-if="pages > 1" :length="pages" v-model="page" total-visible="7" />
      </v-col>

      <v-col md="3">
        <v-navigation-drawer floating permanent right width="100%">
          <v-list nav dense>
            <v-list-item :to="localePath('galleries')" nuxt exact>
              <v-list-item-content>&laquo; Galleries Home</v-list-item-content>
            </v-list-item>

            <v-divider />

            <template
              v-for="browseYear in Object.keys(stats)
                .sort()
                .reverse()"
            >
              <v-list-item
                :key="browseYear"
                :to="
                  localePath({
                    name: 'galleries-events-year-month-day',
                    params: { year: browseYear },
                  })
                "
                nuxt
              >
                <v-list-item-title>
                  {{ browseYear }}
                  <small> ({{ getStat('galleries', browseYear) }}) </small>
                </v-list-item-title>
                <v-list-item-action><v-icon>mdi-chevron-down</v-icon></v-list-item-action>
              </v-list-item>
              <template v-if="~~year === ~~browseYear">
                <v-list-item
                  v-for="browseMonth in Object.keys(stats[year])
                    .sort()
                    .reverse()"
                  :key="browseMonth"
                  :to="
                    localePath({
                      name: 'galleries-events-year-month-day',
                      params: { year, month: browseMonth },
                    })
                  "
                >
                  <v-list-item-title>
                    {{ stats[year][browseMonth].name }}
                    <small> ({{ stats[year][browseMonth].galleries }}) </small>
                  </v-list-item-title>
                </v-list-item>
              </template>
            </template>
          </v-list>
        </v-navigation-drawer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import format from 'date-fns/format';
import get from 'lodash/get';
import sumBy from 'lodash/sumBy';
import transform from 'lodash/transform';
import { Component, mixins } from 'nuxt-property-decorator';

import PaginatedMixin from '@/mixins/paginated';
import { authStore } from '@/store/auth';

const formatter = new Intl.NumberFormat();

type Stats = Record<number, Record<number, { name: string; galleries: number; images: number }>>;

@Component({
  head: { title: 'Galleries' },
})
export default class EventGalleries extends mixins(PaginatedMixin) {
  @authStore.Getter
  isAuthenticated!: boolean;

  stats: Stats = {};

  format = formatter.format;

  async asyncData({ $axios }) {
    const data = await $axios.$get('galleries/stats');

    const stats = transform(
      data,
      (
        result: Stats,
        value: Record<'gallery_count' | 'image_count' | 'month' | 'year', number>
      ) => {
        (result[value.year] || (result[value.year] = {}))[value.month] = {
          galleries: value.gallery_count,
          images: value.image_count,
          name: format(new Date(value.year, value.month - 1), 'MMM'),
        };
      },
      {}
    );

    return { stats };
  }

  get day(): number {
    return parseInt(this.$route.params.day);
  }
  get month(): number {
    return parseInt(this.$route.params.month);
  }
  get year(): number {
    return parseInt(this.$route.params.year);
  }
  get galleries(): number {
    return this.getStat('galleries', this.year, this.month);
  }
  get pages() {
    return Math.ceil(this.galleries / 20);
  }
  get images(): number {
    return this.getStat('images', this.year, this.month);
  }

  get title(): string | number {
    return this.month
      ? format(new Date(this.year, this.month - 1), 'MMMM yyyy')
      : this.year || 'Event Photography';
  }
  getStat(stat: string, year: number, month: number): number {
    if (month) {
      return get(this.stats, [year, month, stat].join('.'), 0);
    }

    if (year) {
      return sumBy(Object.values(get(this.stats, year)), stat);
    }

    return 0;
  }
}
</script>
