<template>
  <p>
    <span v-if="camera">
      <span class="icon"><i class="bx bx-camera" /></span> {{ camera }}<br>
    </span>
    <span v-if="lens">
      <span class="icon"><i class="bx bx-aperture" /></span> {{ lens }}<br>
    </span>
    <span v-if="taken">
      <span class="icon"><i class="bx bx-watch" /></span> {{ taken }}
    </span>
  </p>
</template>


<script>
  import format from 'date-fns/format';

  export default {
    props: {
      exif: { default: () => {}, type: Object },
    },

    computed: {
      camera() { return this.exif.model; },

      lens() {
        const lens = [];

        ['lens', 'focal', 'aperture', 'exposure', 'iso'].forEach(key => {
          if (key in this.exif && this.exif[key]) {
            if (key === 'aperture') {
              lens.push(this.exif[key].replace('f', 'ƒ'));
            }
            else if (key === 'exposure') {
              lens.push(this.exif[key].replace(' sec', 's'));
            }
            else if (key === 'focal') {
              lens.push(this.exif[key].replace(' mm', 'mm'));
            }
            else if (key === 'iso') {
              lens.push(`ISO ${this.exif[key]}`);
            }
            else {
              lens.push(this.exif[key]);
            }
          }
        });

        return lens.join(' / ');
      },

      taken() { return this.exif.taken ? format(new Date(this.exif.taken), 'MMMM D, YYYY HH:mm:ss') : null; },
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
