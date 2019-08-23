<template>
  <p class="caption mx-2">
    <span v-if="camera"> <v-icon left small>mdi-camera</v-icon> {{ camera }}<br /> </span>
    <span v-if="lens"> <v-icon left small>mdi-telescope</v-icon> {{ lens }}<br /> </span>
    <span v-if="settings"> <v-icon left small>mdi-camera-iris</v-icon> {{ settings }}<br /> </span>
    <span v-if="taken"> <v-icon left small>mdi-calendar-clock</v-icon> {{ taken }} </span>
  </p>
</template>

<script lang="ts">
import format from 'date-fns/format';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

const renderers = {
  focal: val => `${val}mm`,
  aperture: val => `ƒ${val}`,
  exposure: val => `${val}s`,
  iso: val => `ISO ${val}`,
};

@Component({})
export default class Exif extends Vue {
  @Prop() exif!: Record<string, string | number>;

  get camera() {
    return (this.exif.make || '') + ' ' + (this.exif.model || '');
  }

  get lens() {
    return (this.exif.lens_make || '') + ' ' + (this.exif.lens_model || '');
  }

  get settings() {
    const settings: Array<Record<string, string | number>> = [];

    for (const field in renderers) {
      if (this.exif[field]) {
        settings.push(renderers[field](this.exif[field]));
      }
    }

    return settings.join(' · ');
  }

  get taken() {
    return this.exif.created_at
      ? format(new Date(this.exif.created_at), 'MMMM D, YYYY HH:mm:ss')
      : null;
  }
}
</script>
