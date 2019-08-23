<template>
  <v-container fluid>
    <v-row>
      <v-col md="8" class="text-center">
        <v-card>
          <tags :editable="isEditing" :tags="image.notes" :orig-size="origSize">
            <responsive-image :src="image.url" desktop-size="66vw" tablet-size="100vw" />
          </tags>
          <p class="caption">{{ description }}</p>
        </v-card>
      </v-col>

      <v-col md="4">
        <v-card>
          <v-list nav dense>
            <v-list-item :to="back" nuxt exact>
              <v-list-item-content>
                <v-list-item-title>&laquo; Back to gallery</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1 text-wrap" v-text="eventName" /><br />
                <v-list-item-subtitle v-text="eventInfo" />
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="mb-2">
                  &copy; <span v-html="copyright" />,
                  <nuxt-link to="/">{{ image.author.username }}</nuxt-link>
                </v-list-item-title>
                <v-list-item-subtitle> {{ comments }}, {{ views }} </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-card-actions>
              <v-btn small @click="isEditing = !isEditing">
                <v-icon left small>mdi-tag-faces</v-icon>
                <span v-text="isEditing ? 'Stop tagging' : 'Tag people'" />
              </v-btn>
              &nbsp;
              <v-btn small v-if="image.exif || image.tags" @click="showDetails = !showDetails">
                <v-icon left small>mdi-information-outline</v-icon>
                <span>Details</span>
              </v-btn>
            </v-card-actions>

            <exif v-if="showDetails && image.exif" :exif="image.exif" />
            <v-divider v-if="showDetails && image.exif && image.tags" />
            <template v-if="showDetails && image.tags">
              <v-chip
                v-for="{ confidence, name } in labels"
                class="ma-1"
                :key="name"
                small
                :style="`opacity: ${confidence / 100}`"
                :title="`${confidence}%`"
                v-text="name"
              />
            </template>
          </v-list>
        </v-card>

        <v-card v-if="image.comments" class="mt-4">
          <v-card-title>Comments</v-card-title>

          <comment-list :comments="image.comments" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import format from 'date-fns/format';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import { Component, Vue } from 'nuxt-property-decorator';

import CommentList from '@/components/CommentList.vue';
import Exif from '@/components/image/Exif.vue';
import Tags from '@/components/image/Tags.vue';
import ResponsiveImage from '@/components/ResponsiveImage.vue';
import Gallery from '@/models/Gallery';
import Image from '@/models/Image';
import { count, slug } from '@/utils/text';

@Component({
  components: { CommentList, Exif, ResponsiveImage, Tags },
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
      .relation('author')
      .relation('comments')
      .relation('comments.author')
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

  get labels(): Array<{ confidence: number; name: string }> {
    if (!this.image!.tags) {
      return [];
    }

    const flatten = data => {
      return data.reduce((r, { children, ...rest }) => {
        r.push(rest);

        children && r.push(...flatten(children));

        return r;
      }, []);
    };

    return sortBy(uniqBy(flatten(this.image!.tags), 'name'), 'confidence').reverse() as any;
  }

  get origSize() {
    return { width: this.image!.width, height: this.image!.height };
  }

  get views() {
    return count(this.image!.view_count!, 'view', 'views');
  }
}
</script>

<style scoped>
.text-wrap {
  line-height: inherit !important;
}
</style>
