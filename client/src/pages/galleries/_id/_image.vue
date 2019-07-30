<template>
  <main class="container">
    <div class="row">
      <figure class="col-8 has-text-center">
        <tags :editable="isEditing" :tags="image.notes" :orig-size="origSize">
          <responsive-image :src="image.url" desktop-size="66vw" tablet-size="100vw" />
        </tags>
        <figcaption>{{ description }}</figcaption>
      </figure>

      <div class="col-4">
        &laquo; <nuxt-link :to="back">Back to gallery</nuxt-link>

        <h4>{{ eventName }}</h4>
        <small>{{ eventInfo }}</small>

        <hr />

        &copy;
        <span v-html="copyright" />,
        <nuxt-link to="/">{{ image.author.username }}</nuxt-link>
        <br />
        <small>{{ comments }}, {{ views }}</small>
        <br />
        <button class="button is-tiny" @click="isEditing = !isEditing">
          <span class="icon"><i class="bx bx-purchase-tag"/></span>
          <span v-if="isEditing">Stop tagging</span>
          <span v-else>Tag people</span>
        </button>
        &nbsp;
        <button
          v-if="image.exif || image.tags"
          class="button is-tiny"
          @click="showDetails = !showDetails"
        >
          <span class="icon"><i class="bx bx-info-circle"/></span>
          <span v-if="showDetails">Hide image details</span>
          <span v-else>Show image details</span>
        </button>
        <exif v-if="showDetails && image.exif" :exif="image.exif" />
        <hr v-if="showDetails && image.exif && image.tags" />
        <labels v-if="showDetails && image.tags" :labels="image.tags" />

        <hr />

        <comment-list :comments="image.comments" />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import format from 'date-fns/format';
import sortBy from 'lodash/sortBy';
import { Component, Vue } from 'nuxt-property-decorator';

import ResponsiveImage from '@/components/ResponsiveImage.vue';
import Gallery from '@/models/Gallery';
import Image from '@/models/Image';
import { count, slug } from '@/utils/text';
import CommentList from '../../../components/CommentList.vue';
import Exif from '../../../components/image/Exif.vue';
import Labels from '../../../components/image/Labels.vue';
import Tags from '../../../components/image/Tags.vue';

@Component({
  components: { CommentList, Exif, Labels, ResponsiveImage, Tags },
})
export default class SingleImage extends Vue {
  gallery: Gallery | null = null;
  image: Image | null = null;
  isEditing = false;
  showDetails = false;

  async asyncData({ params }) {
    const galleryId = parseInt(params.id);
    const imageId = parseInt(params.image);
    const gallery = await new Gallery().find(galleryId);
    const image = await gallery
      .images()
      .relation('author', ['username'])
      .relation('comments')
      .relation('notes')
      .find(imageId);

    return { gallery, image };
  }

  get back() {
    return this.localePath({
      name: 'galleries-id',
      params: { id: `${this.gallery!.id}-${slug(this.gallery!.name)}` },
    });
  }

  get comments() {
    return count(this.image!.comment_count!, 'comment', 'comments');
  }

  get copyright() {
    const createdAt = new Date(this.image!.created_at!);
    const copyright = [createdAt.getFullYear()];

    if (copyright[0] !== new Date().getFullYear()) {
      copyright.push(new Date().getFullYear());
    }

    return copyright.join(' &ndash; ');
  }

  get description() {
    if (!this.image!.notes) {
      return this.image!.description;
    }

    const description: string[] = [];

    sortBy(this.image!.notes, ['x', 'width']).forEach(note => description.push(note.name));

    return description.join(', ');
  }

  get eventInfo() {
    if (this.gallery!.event) {
      return (
        format(this.gallery!.event.begins_at!, 'MMMM D, YYYY') +
        ' @ ' +
        this.gallery!.event.venue_name +
        ', ' +
        this.gallery!.event.city_name
      );
    } else {
      return format(this.gallery!.event_date!, 'MMMM D, YYYY');
    }
  }

  get eventName() {
    return this.gallery!.event ? this.gallery!.event.name : this.gallery!.name;
  }

  get origSize() {
    return { width: this.image!.width, height: this.image!.height };
  }

  get views() {
    return count(this.image!.view_count!, 'view', 'views');
  }
}
</script>
