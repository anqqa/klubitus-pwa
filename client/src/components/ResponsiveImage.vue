<template>
  <v-img
    v-bind="$attrs"
    :aspect-ratio="aspectRatio"
    :src="defaultSrc"
    :srcset="srcset"
    :sizes="sizes"
    :style="style"
  >
    <slot></slot>
  </v-img>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

const availableWidths = [1920, 1600, 1440, 1024, 768, 640, 320];
const defaultWidth = 1600;

@Component({})
export default class ResponsiveImage extends Vue {
  @Prop() aspectRatio?: string | number;
  @Prop() color?: string;
  @Prop({ default: '' }) src!: string;

  @Prop({ default: defaultWidth }) desktopSize?: string;
  @Prop() mobileSize?: string;
  @Prop() tabletSize?: string;
  @Prop({ default: 1600 }) maxWidth!: number;

  isWebpSupported = false;

  async mounted() {
    const module = await import('@/utils/image');

    this.isWebpSupported = module.isWebpSupported;
  }

  get defaultSrc(): string {
    return this.isResponsive ? this.urlWithWidth(Math.min(defaultWidth, this.maxWidth)) : this.src;
  }

  get isResponsive(): boolean {
    return !!(process.env.CDN_HOST && this.src.includes(process.env.CDN_HOST));
  }

  get isWebp(): boolean {
    return this.src.toLowerCase().endsWith('webp');
  }

  get sizes(): string {
    const sizes = [this.desktopSize];

    if (typeof this.tabletSize !== 'undefined' && this.tabletSize !== this.desktopSize) {
      sizes.unshift('(max-width: 767px) ' + this.tabletSize);
    }

    if (typeof this.mobileSize !== 'undefined' && this.mobileSize !== this.desktopSize) {
      sizes.unshift('(max-width: 479px) ' + this.mobileSize);
    }

    return sizes.join(', ');
  }

  get srcset(): string {
    const ext = this.isWebpSupported && !this.isWebp ? 'webp' : undefined;

    return this.widths.map(width => this.urlWithWidth(width, ext) + ` ${width}w`).join(', ');
  }

  get style(): string | undefined {
    return this.color && 'background-color: ' + this.color;
  }

  urlWithWidth(width: number, ext?: string): string {
    const height = this.aspectRatio ? Math.round(width / Number(this.aspectRatio)) : 0;
    const url = this.src.replace(
      process.env.CDN_HOST as string,
      `${process.env.CDN_HOST}/r/${width}x${height}`
    );

    return typeof ext !== 'undefined' ? `${url}.${ext}` : url;
  }

  get widths(): number[] {
    const widths = availableWidths.filter(width => width <= this.maxWidth);

    return widths.length ? widths : [this.maxWidth];
  }
}
</script>
