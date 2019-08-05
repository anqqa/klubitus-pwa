<template>
  <picture :class="{ 'is-responsive': isResponsive }">
    <source v-if="isResponsive && !isWebp" :srcset="srcsetWebp" :sizes="sizes" type="image/webp" />
    <img
      v-if="isResponsive"
      :alt="alt"
      :src="defaultSrc"
      :srcset="srcset"
      :sizes="sizes"
      :style="style"
      :title="title"
    />
    <img v-else :alt="alt" :src="defaultSrc" :style="style" :title="title" />
  </picture>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

const availableWidths = [1920, 1600, 1440, 1024, 768, 640, 320];
const defaultWidth = 1600;

@Component({})
export default class ResponsiveImage extends Vue {
  @Prop() alt?: string;
  @Prop() color?: string;
  @Prop() ratio?: number;
  @Prop({ default: '' }) src!: string;
  @Prop() title?: string;

  @Prop({ default: defaultWidth }) desktopSize?: string;
  @Prop() mobileSize?: string;
  @Prop() tabletSize?: string;
  @Prop({ default: 1600 }) maxWidth!: number;

  get defaultSrc() {
    return this.isResponsive ? this.urlWithWidth(Math.min(defaultWidth, this.maxWidth)) : this.src;
  }

  get isResponsive() {
    return !!(process.env.CDN_HOST && this.src.includes(process.env.CDN_HOST));
  }

  get isWebp() {
    return this.src.toLowerCase().endsWith('webp');
  }

  get sizes() {
    const sizes = [this.desktopSize];

    if (typeof this.tabletSize !== 'undefined' && this.tabletSize !== this.desktopSize) {
      sizes.unshift('(max-width: 767px) ' + this.tabletSize);
    }

    if (typeof this.mobileSize !== 'undefined' && this.mobileSize !== this.desktopSize) {
      sizes.unshift('(max-width: 479px) ' + this.mobileSize);
    }

    return sizes.join(', ');
  }

  get srcset() {
    return this.widths()
      .map(width => this.urlWithWidth(width) + ` ${width}w`)
      .join(', ');
  }

  get srcsetWebp() {
    return this.widths()
      .map(width => this.urlWithWidth(width, 'webp') + ` ${width}w`)
      .join(', ');
  }

  get style() {
    return this.color && 'background: ' + this.color;
  }

  urlWithWidth(width: number, ext?: string) {
    const height = this.ratio ? Math.round(width / this.ratio) : 0;
    const url = this.src.replace(
      process.env.CDN_HOST as string,
      `${process.env.CDN_HOST}/r/${width}x${height}`
    );

    return typeof ext !== 'undefined' ? `${url}.${ext}` : url;
  }

  widths() {
    const widths = availableWidths.filter(width => width <= this.maxWidth);

    return widths.length ? widths : [this.maxWidth];
  }
}
</script>
