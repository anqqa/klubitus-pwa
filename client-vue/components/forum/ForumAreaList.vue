<template>

  <section>
    <table class="table is-hoverable if-fullwidth is-transparent">
      <template v-for="group in groupList">

        <thead :key="`${group.id}_head`">
          <tr>
            <th><h3>{{ group.name }}</h3></th>
            <th v-if="!mini" class="has-text-right">
              <span class="icon is-small"><i class="far fa-comments" /></span>
            </th>
          </tr>
        </thead>

        <tbody :key="group.id">
          <template v-for="area in group.areas">
            <tr v-if="area.url" :key="area.id">
              <td>
                <nuxt-link :to="area.url">{{ area.name }}</nuxt-link>
                <p v-if="!mini" v-html="area.description" />
              </td>
              <td v-if="!mini" class="has-text-right">
                {{ area.topicCount }}<br>
                {{ area.ago }}
              </td>
            </tr>

            <tr v-else :key="area.id">
              <td>
                {{ area.name }}
                <p v-if="!mini" v-html="area.description" />
              </td>
              <td v-if="!mini" class="has-text-right">
                <span class="icon"><i class="fas fa-lock" /></span>
              </td>
            </tr>
          </template>
        </tbody>

      </template>
    </table>
  </section>

</template>


<script>
  import { fuzzyTimeDistance, slug } from '../../utils/text';


  const formatter = new Intl.NumberFormat();

  export default {

    props: {
      areas: { default: () => [], type: Array },
      mini:  { default: false, type: Boolean },
    },

    computed: {
      groupList() {
        const groups = [];
        let   areas  = [];

        this.areas.slice(0).forEach(area => {
          if (!area.nest_depth) {

            // Group
            areas = [];
            groups.push({ id: area.id, name: area.name, areas })

          }
          else {

            // Area
            areas.push({
              ...area,
              ago:        area.last_topic ? fuzzyTimeDistance(new Date(area.last_topic.last_post_at)) : null,
              topicCount: formatter.format(area.topic_count),
              url:        this.$auth.loggedIn || !area.is_private
                            ? this.localePath({ name: 'forum-area', params: { area: `${area.id}-${slug(area.name)}` }})
                            : null,
            });

          }
        });

        return groups;
      }
    }

  };
</script>


<style scoped>
  h3 {
    text-transform: uppercase;
  }
</style>
