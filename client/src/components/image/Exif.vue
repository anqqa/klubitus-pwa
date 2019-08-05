<template>
  <p>
    <span v-if="camera">
      <span class="icon"><i class="bx bx-camera"/></span> {{ camera }}<br />
    </span>
    <span v-if="lens">
      <span class="icon"><i class="bx bx-aperture"/></span> {{ lens }}<br />
    </span>
    <span v-if="settings">
      <span class="icon"><i class="bx bx-slider"/></span> {{ settings }}<br />
    </span>
    <span v-if="taken">
      <span class="icon"><i class="bx bx-watch"/></span> {{ taken }}
    </span>
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

<style scoped>
dt {
  display: inline-block;
  vertical-align: top;
  width: 50%;
}

dd {
  display: inline-block;
  margin: 0;
  width: 50%;
}
</style>
