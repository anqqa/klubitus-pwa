<template>
  <nav class="pagination" role="navigation" aria-label="pagination">

    <ul class="pagination-list">
      <li v-for="paginate in paginated" :key="paginate.page">
        <nuxt-link v-if="typeof paginate.page === 'number'"
                   :to="paginate.url"
                   class="button"
                   exact>
          {{ paginate.page }}
        </nuxt-link>
        <span v-else class="pagination-separator">&hellip;</span>
      </li>
    </ul>

    <nuxt-link v-if="current > 1"
               :to="prevUrl"
               class="button pagination-previous">&laquo; {{ prev }}</nuxt-link>
    <span v-else class="button pagination-previous">&laquo; {{ prev }}</span>

    <nuxt-link v-if="current < pages"
               :to="nextUrl"
               class="button pagination-next">{{ next }} &raquo;</nuxt-link>
    <span v-else class="button pagination-next">{{ next }} &raquo;</span>

  </nav>
</template>


<script>
  export default {

    props: {
      next:  { default: null, type: String },
      page:  { default: 0, type: Number },
      pages: { default: 0, type: Number },
      prev:  { default: null, type: String },
      url:   { default: null, type: String },
    },

    data() {
      return { current: this.page };
    },

    computed: {
      paginated() {
        console.log('paginated', this.current, this.pages);
        const pages = [];
        const paginate = [1];

        if (this.pages < 6) {
          for (let page = 2; page < this.pages; page++) paginate.push(page);
        }
        else {
          if (this.current > 4) {
            paginate.push('ellipsis-1');
          }

          for (let page = Math.max(2, this.current - 2); page <= Math.min(this.pages - 1, this.current + 2); page++) {
            paginate.push(page);
          }

          if (this.current < this.pages - 3) {
            paginate.push('ellipsis-2');
          }
        }

        paginate.push(this.pages);

        paginate.forEach(page => {
          pages.push({ page, url: typeof page === 'string' ? false : this.url.replace('_page', page) });
        });

        return pages;
      },

      prevUrl() { return this.url.replace('_page', this.current - 1); },
      nextUrl() { return this.url.replace('_page', this.current + 1); },
    },

    watch: {
      '$route.path': function() {
        console.log('watch', this.$route.path, this.$route.params.page);

        if ('page' in this.$route.params) {
          this.current = parseInt(this.$route.params.page) || 1;
        }
      }
    },

    watchQuery: ['page'],

  };
</script>
