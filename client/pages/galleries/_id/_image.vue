<template>

  <main class="container">
    <div class="row">

      <figure class="col-8 has-text-center">
        <Tags :editable="isEditing" :tags="image.notes" :orig-size="origSize">
          <img :src="image.url">
        </Tags>
        <figcaption>{{ description }}</figcaption>
      </figure>

      <div class="col-4">
        &copy; <span v-html="copyright" />,
        <nuxt-link to="/">{{ image.author.username }}</nuxt-link><br>
        <small>{{ comments }}, {{ views }}</small>
        <br>
        <button class="button is-tiny" @click="isEditing = !isEditing">
          <span class="icon"><i class="bx bx-purchase-tag" /></span>
          <span v-if="isEditing">Stop tagging</span>
          <span v-else>Tag people</span>
        </button>
        &nbsp;
        <button v-if="image.exif" class="button is-tiny" @click="showExif = !showExif">
          <span class="icon"><i class="bx bx-info-circle" /></span>
          <span v-if="showExif">Hide image details</span>
          <span v-else>Show image details</span>
        </button>
        <Exif v-if="showExif" :exif="image.exif" />

        <hr>

        <h4>{{ event }}</h4>
        <small>{{ eventInfo }}</small>

        <hr>

        <CommentList :comments="image.comments" />
      </div>

    </div>
  </main>

</template>


<script>
  import format from 'date-fns/format';
  import sortBy from 'lodash/sortBy';

  import CommentList from '../../../components/CommentList';
  import Exif from '../../../components/image/Exif';
  import Tags from '../../../components/image/Tags';
  import { count } from '../../../utils/text';


  export default {

    async asyncData({ app, params }) {
      const galleryId = parseInt(params.id);
      const imageId   = parseInt(params.image);

      const { data: gallery } = await app.$axios.$get(`gallery/${galleryId}`);
      const { data: image }   = await app.$axios.$get(`gallery/${galleryId}/${imageId}`);

      return { gallery, image };
    },

    components: { CommentList, Exif, Tags },

    data: () => ({
      isEditing: false,
      showExif:  false,
    }),

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

      description() {
        if (!this.image.notes) {
          return this.image.description;
        }

        const description = [];

        sortBy(this.image.notes, ['x', 'width']).forEach(note => description.push(note.name));

        return description.join(', ');
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

      origSize() { return { width: this.image.width, height: this.image.height }; },

      views() { return count(this.image.view_count, 'view', 'views'); },
    },

  };
</script>


<style scoped>

</style>
