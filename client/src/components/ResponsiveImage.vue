<template>
  <picture :class="{'is-responsive': isResponsive}">
    <source v-if="isResponsive && !isWebp" :srcset="srcsetWebp" :sizes="sizes" type="image/webp">
    <img :alt="alt" :src="defaultSrc" :srcset="srcset" :sizes="sizes" :title="title">
  </picture>
</template>


<script>
  export default {
    name: 'ResponsiveImage',

    props: {
      alt:   { type: String, default: undefined },
      ratio: { type: Number, default: undefined },
      src:   { type: String, default: undefined, required: true },
      title: { type: String, default: undefined },

      desktopSize: { type: String, default: '100vw', },
      mobileSize:  { type: String, default: undefined, },
      tabletSize:  { type: String, default: undefined, },
      maxWidth:    { type: Number, default: 1600 },
    },

    data: () => ({
      availableWidths: [1920, 1600, 1440, 1024, 768, 640, 320],
      defaultWidth:    1600,
    }),

    computed: {
      defaultSrc() {
        return this.isResponsive ? this.urlWithWidth(Math.min(this.defaultWidth, this.maxWidth)) : this.src;
      },

      isResponsive() {
        return !!(process.env.CDN_HOST && this.src.includes(process.env.CDN_HOST));
      },

      isWebp() {
        return this.src.toLowerCase().endsWith('webp');
      },

      sizes() {
        const sizes = [this.desktopSize];

        if (typeof this.tabletSize !== 'undefined' && this.tabletSize !== this.desktopSize) {
          sizes.unshift('(max-width: 767px) ' + this.tabletSize);
        }

        if (typeof this.mobileSize !== 'undefined' && this.mobileSize !== this.desktopSize) {
          sizes.unshift('(max-width: 479px) ' + this.mobileSize);
        }

        return sizes.join(', ');
      },

      srcset() {
        return this.widths().map(width => this.urlWithWidth(width) + ` ${width}w`).join(', ');
      },

      srcsetWebp() {
        return this.widths().map(width => this.urlWithWidth(width, 'webp') + ` ${width}w`).join(', ');
      },
    },

    methods: {
      urlWithWidth(width, ext) {
        const height = this.ratio ? Math.round(width / this.ratio) : 0;
        const url    = this.src.replace(process.env.CDN_HOST, `${process.env.CDN_HOST}/r/${width}x${height}`);

        return (typeof ext !== 'undefined') ? `${url}.${ext}` : url;
      },

      widths() {
        const widths = this.availableWidths.filter(width => width <= this.maxWidth);

        return (widths.length ? widths : [this.maxWidth]);
      }
    },
  };
</script>
