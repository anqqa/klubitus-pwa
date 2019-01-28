<template>

  <li :class="{
    'has-children': label.children && label.children.length > 1,
    'has-child': label.children && label.children.length === 1,
  }">
    <span :style="`opacity: ${label.confidence / 100}`" :title="`${ label.confidence }% sure`">
      {{ label.name }}
    </span>

    <ul v-if="label.children && label.children.length">
      <LabelTree v-for="child in label.children" :key="child.name" :label="child" />
    </ul>
  </li>

</template>


<script>
  export default {
    name: 'LabelTree',

    props: {
      label: { default: () => {}, type: Object },
    },
  };
</script>


<style scoped>
  ul {
    font-size: 0.9em;
    list-style: none;
    padding-left: 1em;
  }

  li.has-child > ul {
    display: inline;
    padding-left: 0;
  }
  li.has-child > ul > li {
    display: inline;
  }
  li.has-child > ul > li:before {
    content: '🡒';
  }

</style>
