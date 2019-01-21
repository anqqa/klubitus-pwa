<template>
  <p>
    <span v-if="camera">
      <span class="icon"><i class="bx bx-camera" /></span> {{ camera }}<br>
    </span>
    <span v-if="lens">
      <span class="icon"><i class="bx bx-aperture" /></span> {{ lens }}<br>
    </span>
    <span v-if="settings">
      <span class="icon"><i class="bx bx-slider" /></span> {{ settings }}<br>
    </span>
    <span v-if="taken">
      <span class="icon"><i class="bx bx-watch" /></span> {{ taken }}
    </span>
  </p>
</template>


<script>
  import format from 'date-fns/format';


  const renderers = {
    focal:    val => `${val}mm`,
    aperture: val => `ƒ${val}`,
    exposure: val => `${val}s`,
    iso:      val => `ISO ${val}`,
  };


  export default {
    props: {
      exif: { default: () => {}, type: Object },
    },

    computed: {
      camera() { return (this.exif.make || '') + ' ' + (this.exif.model || ''); },

      lens() { return (this.exif.lens_make || '') + ' ' + (this.exif.lens_model || ''); },

      settings() {
        const settings = [];

        for (const field in renderers) {
          if (this.exif[field]) {
            settings.push(renderers[field](this.exif[field]));
          }
        }

        return settings.join(' · ');
      },

      taken() { return this.exif.created_at ? format(new Date(this.exif.created_at), 'MMMM D, YYYY HH:mm:ss') : null; },
    }
  };
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
