<template>

  <main class="container">
    <div class="row">

      <figure class="col-8 has-text-center">
        <img :src="image.url">
        <figcaption>{{ image.description }}</figcaption>
      </figure>

      <div class="col-4">
        <h4>{{ event }}</h4>
        <small>{{ eventInfo }}</small>
        <hr>

        &copy; <span v-html="copyright" />,
        <nuxt-link to="/">{{ image.author.username }}</nuxt-link><br>
        <small>{{ comments }}, {{ views }}</small>

        <CommentList :comments="image.comments" />
      </div>

    </div>
  </main>

</template>


<script>
  import format from 'date-fns/format';

  import CommentList from '../../../components/CommentList';
  import { count } from '../../../utils/text';


  export default {

    async asyncData({ app, params }) {
      const galleryId = parseInt(params.id);
      const imageId   = parseInt(params.image);

      const { data: gallery } = await app.$axios.$get(`gallery/${galleryId}`);
      const { data: image }   = await app.$axios.$get(`gallery/${galleryId}/${imageId}`);

      return { gallery, image };
    },

    components: { CommentList },

    computed: {
      comments() { return count(this.image.comment_count, 'comment', 'comments'); },

      copyright() {
        const createdAt = new Date(this.image.created_at);
        const copyright = [createdAt.getFullYear()];

        if (copyright[0] !== new Date().getFullYear()) {
          copyright.push(new Date().getFullYear());
        }

        return copyright.join(' &ndash; ');
      },

      event() { return this.gallery.event ? this.gallery.event.name : this.gallery.name; },

      eventInfo() {
        if (this.gallery.event) {
          return format(this.gallery.event.begins_at, 'MMMM D, YYYY')
            + ' @ ' + this.gallery.event.venue_name + ', ' + this.gallery.event.city_name;
        }
        else {
          return format(this.gallery.event_date, 'MMMM D, YYYY');
        }
      },

      views() { return count(this.image.view_count, 'view', 'views'); },
    }

  };
</script>


<style scoped>

</style>
