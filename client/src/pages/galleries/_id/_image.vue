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
        &laquo; <nuxt-link :to="back">Back to gallery</nuxt-link>

        <h4>{{ eventName }}</h4>
        <small>{{ eventInfo }}</small>

        <hr>

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
        <button v-if="image.exif || image.tags" class="button is-tiny" @click="showDetails = !showDetails">
          <span class="icon"><i class="bx bx-info-circle" /></span>
          <span v-if="showDetails">Hide image details</span>
          <span v-else>Show image details</span>
        </button>
        <Exif v-if="showDetails && image.exif" :exif="image.exif" />
        <hr v-if="showDetails && image.exif && image.tags" />
        <Labels v-if="showDetails && image.tags" :labels="image.tags" />

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
  import Labels from '../../../components/image/Labels';
  import Tags from '../../../components/image/Tags';
  import { count, slug } from '../../../utils/text';


  export default {

    async asyncData({ app, params }) {
      const galleryId = parseInt(params.id);
      const imageId   = parseInt(params.image);

      const { data: gallery } = await app.$axios.$get(`galleries/${galleryId}`);
      const { data: image }   = await app.$axios.$get(`galleries/${galleryId}/${imageId}`);

      return { gallery, image };
    },

    components: { CommentList, Exif, Labels, Tags },

    data: () => ({
      isEditing:   false,
      showDetails: false,
    }),

    computed: {
      back() {
        return this.localePath({
          name: 'galleries-id',
          params: { id: `${this.gallery.id}-${slug(this.gallery.name)}`
          }
        });
      },

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

      eventInfo() {
        if (this.gallery.event) {
          return format(this.gallery.event.begins_at, 'MMMM D, YYYY')
            + ' @ ' + this.gallery.event.venue_name + ', ' + this.gallery.event.city_name;
        }
        else {
          return format(this.gallery.event_date, 'MMMM D, YYYY');
        }
      },

      eventName() { return this.gallery.event ? this.gallery.event.name : this.gallery.name; },

      origSize() { return { width: this.image.width, height: this.image.height }; },

      views() { return count(this.image.view_count, 'view', 'views'); },
    },

  };
</script>


<style scoped>

</style>
