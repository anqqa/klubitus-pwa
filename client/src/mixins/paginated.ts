import { Component, Vue } from 'nuxt-property-decorator';

@Component({})
export default class PaginatedMixin extends Vue {
  pages: number = 0;

  get page(): number {
    return parseInt(this.$route.query.page as string, 10) || 1;
  }

  set page(page: number) {
    const query = { ...this.$route.query };

    if (page > 1) {
      query.page = page.toString();
    } else if ('page' in query) {
      delete query.page;
    }

    this.$router.push({ ...this.$route, query });
  }
}
