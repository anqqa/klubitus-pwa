<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <nuxt-link v-if="page > 1" :to="prevUrl" class="button pagination-previous" exact
      >&laquo; {{ prev }}</nuxt-link
    >
    <span v-else class="button pagination-previous">&laquo; {{ prev }}</span>

    <nuxt-link v-if="page < pages" :to="nextUrl" class="button pagination-next" exact
      >{{ next }} &raquo;</nuxt-link
    >
    <span v-else class="button pagination-next">{{ next }} &raquo;</span>

    <ul class="pagination-list">
      <li v-for="paginate in paginated" :key="paginate.page">
        <nuxt-link
          v-if="typeof paginate.page === 'number'"
          :to="paginate.url"
          active-class="is-primary"
          class="button"
          exact
        >
          {{ paginate.page }}
        </nuxt-link>
        <span v-else class="pagination-separator">&hellip;</span>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { Location } from 'vue-router';

@Component({})
export default class Pagination extends Vue {
  @Prop() next!: string;
  @Prop({ default: 0 }) pages!: number;
  @Prop() prev!: string;
  @Prop() route!: Location;

  get page() {
    return this.getPageFromQuery(this.$route.query);
  }

  get paginated() {
    const pages: Array<{ page: number | string; url: string | boolean }> = [];
    const paginate: Array<number | string> = [1];

    if (this.pages < 6) {
      for (let page = 2; page < this.pages; page++) {
        paginate.push(page);
      }
    } else {
      if (this.page > 4) {
        paginate.push('ellipsis-1');
      }

      for (
        let page = Math.max(2, this.page - 2);
        page <= Math.min(this.pages - 1, this.page + 2);
        page++
      ) {
        paginate.push(page);
      }

      if (this.page < this.pages - 3) {
        paginate.push('ellipsis-2');
      }
    }

    paginate.push(this.pages);

    paginate.forEach(page => {
      const url = typeof page === 'number' ? this.getUrlForPage(page) : false;

      pages.push({ page, url });
    });

    return pages;
  }

  get prevUrl() {
    return this.getUrlForPage(this.page - 1);
  }

  get nextUrl() {
    return this.getUrlForPage(this.page + 1);
  }

  head() {
    if (this.pages && this.route) {
      const link: Array<{ hid: string; rel: string; href: string }> = [];

      if (this.page > 1) {
        link.push({ hid: 'prev', rel: 'prev', href: this.getUrlForPage(this.page - 1) });
      }

      if (this.page < this.pages) {
        link.push({ hid: 'next', rel: 'next', href: this.getUrlForPage(this.page + 1) });
      }

      return { link };
    }
  }

  getPageFromQuery(query) {
    return 'page' in query ? parseInt(query.page) || 1 : 1;
  }

  getUrlForPage(page) {
    const route = { ...this.route, query: { ...(this.route.query || {}) } };

    if (page > 1) {
      route.query.page = page;
    } else if ('page' in route.query) {
      delete route.query.page;
    }

    return this.localePath(route);
  }
}
</script>
