<template>
  <div
    :class="{ 'is-editable': editable }"
    class="tags"
    @mousedown="onStartDrawing"
    @mousemove="onDraw"
    @mouseup="onStopDrawing"
  >
    <slot />
    <Tag
      v-for="tag in tagList"
      :editable="editable"
      :key="tag.id"
      :tag="tag"
      :orig-size="origSize"
      @cancelTag="onCancel"
      @editTag="onEdit"
      @removeTag="onRemove"
      @saveTag="onSave"
    />
    <TagOutline v-if="newTag" :tag="newTag" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import { Tag as Model } from '@/models/Image';
import Tag from './Tag.vue';
import TagOutline from './TagOutline.vue';

const randomId = () =>
  'new-' +
  Math.random()
    .toString(36)
    .substr(2, 9);

interface ExtendedModel extends Model {
  status: string;
}

@Component({
  components: { Tag, TagOutline },
})
export default class Tags extends Vue {
  @Prop({ default: false }) editable!: boolean;
  @Prop({ default: 50 }) minSize!: number;
  @Prop({ default: [] }) tags!: ExtendedModel[];
  @Prop() origSize!: { width: number; height: number };

  isLocked: boolean = false;
  newTag: ExtendedModel | null = null;
  tagList: ExtendedModel[] = this.tags;
  position: ClientRect | null = null;

  onCancel(msg) {
    this.isLocked = false;

    this.tagList.forEach(tag => {
      if (tag.id === msg.id) {
        tag.status = 'ready';
      }
    });
  }

  onDraw(e) {
    // Do nothing if we're not drawing a new tag
    if (!this.editable || !this.newTag) {
      return;
    }

    this.newTag.width = e.clientX - this.newTag.x - this.position!.left;
    this.newTag.height = e.clientY - this.newTag.y - this.position!.top;

    this.newTag.width =
      this.newTag.width > 0
        ? Math.max(this.minSize, this.newTag.width)
        : Math.min(-this.minSize, this.newTag.width);
    this.newTag.height =
      this.newTag.height > 0
        ? Math.max(this.minSize, this.newTag.height)
        : Math.min(-this.minSize, this.newTag.height);
  }

  onEdit(msg) {
    if (!this.editable) {
      return;
    }

    this.tagList.forEach(tag => {
      if (tag.id === msg.id) {
        tag.status = 'editing';
      }
    });
  }

  onRemove(msg) {
    this.isLocked = false;

    this.tagList = this.tagList.filter(tag => tag.id !== msg.id);
  }

  onSave(msg) {
    this.isLocked = false;

    if (!this.editable || !msg) {
      return;
    }

    // Saving empty text = remove
    if (msg.name === '') {
      return this.onRemove(msg);
    }

    this.tagList.forEach(tag => {
      if (tag.id === msg.id) {
        tag.name = msg.name;
        tag.status = 'ready';
      }
    });
  }

  onStartDrawing(e) {
    if (!this.editable || this.isLocked) {
      return;
    }

    this.position = e.currentTarget.getBoundingClientRect() as ClientRect;
    this.newTag = {
      x: e.clientX - this.position.left,
      y: e.clientY - this.position.top,
      width: this.minSize,
      height: this.minSize,
      status: 'new',
      name: '',
      id: randomId(),
    };
  }

  onStopDrawing() {
    if (!this.editable || this.isLocked || !this.newTag) {
      return;
    }

    // Did we left from starting point?
    if (this.newTag.width < 0) {
      this.newTag.x += this.newTag.width;
      this.newTag.width = Math.abs(this.newTag.width);
    }

    // Did we move upwards from starting point?
    if (this.newTag.height < 0) {
      this.newTag.y += this.newTag.height;
      this.newTag.height = Math.abs(this.newTag.height);
    }

    // Match new tag size to the original image size instead of displayed size
    const { clientWidth, clientHeight } = this.$slots.default![0].elm! as Element;

    const correctionX = this.origSize.width / clientWidth;
    const correctionY = this.origSize.height / clientHeight;
    const correctedTag = Object.assign({}, this.newTag, {
      x: Math.max(0, Math.round(this.newTag!.x * correctionX)),
      y: Math.max(0, Math.round(this.newTag!.y * correctionY)),
      width: Math.max(this.minSize, Math.round(this.newTag!.width * correctionX)),
      height: Math.max(this.minSize, Math.round(this.newTag!.height * correctionY)),
    });

    // Make sure the region fits the image
    correctedTag.x = Math.min(correctedTag.x, this.origSize.width - correctedTag.width);
    correctedTag.y = Math.min(correctedTag.y, this.origSize.height - correctedTag.height);

    this.tagList.push(correctedTag);

    this.newTag = null;
    this.isLocked = true;
  }
}
</script>

<style scoped>
.tags {
  display: inline-block;
  position: relative;
}
.tags.is-editable {
  cursor: crosshair;
}
</style>
