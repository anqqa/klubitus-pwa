// tslint:disable:no-shadowed-variable
import { namespace } from 'nuxt-property-decorator';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import ForumArea from '@/models/ForumArea';
import ForumTopic from '@/models/ForumTopic';

interface ForumState {
  activeTopicId?: number;
  areas: ForumArea[];
  latestTopicIds: number[];
  topics: Record<number, ForumTopic>;
}

export const state = (): ForumState => ({
  areas: [],
  latestTopicIds: [],
  topics: {},
});

export const enum Actions {
  LOAD_AREAS = 'loadAreas',
  LOAD_LATEST_TOPICS = 'loadLatestTopics',
  LOAD_TOPIC = 'loadTopic',
}

export const actions: ActionTree<ForumState, any> = {
  async [Actions.LOAD_AREAS]({ commit, state }, force?: boolean) {
    if (!force && state.areas.length) {
      return;
    }

    const areas = await new ForumArea().getAll();

    commit(
      Mutations.SET_AREAS,
      areas.map(area => area.data())
    );
  },

  async [Actions.LOAD_LATEST_TOPICS]({ commit }, limit: number = 20) {
    const topics = await new ForumTopic()
      .relation('area')
      .relation('author')
      .sort('last_post_at', 'DESC')
      .limit(limit)
      .get();

    commit(
      Mutations.SET_TOPICS,
      topics.map(topic => topic.data())
    );
    commit(
      Mutations.SET_LATEST_TOPICS,
      topics.map(topic => topic.id!)
    );
  },

  async [Actions.LOAD_TOPIC](
    { commit, state },
    payload: { activate?: boolean; force?: boolean; topicId: number }
  ) {
    const { activate, force, topicId } = payload;

    if (force || !(topicId in state.topics)) {
      const topic = await new ForumTopic()
        .relation('area')
        .relation('author')
        .find(topicId);

      commit(Mutations.SET_TOPICS, [topic.data()]);
    }

    if (activate) {
      commit(Mutations.SET_ACTIVE_TOPIC, topicId);
    }
  },
};

export const enum Getters {
  ACTIVE_TOPIC = 'activeTopic',
  GROUPED_AREAS = 'groupedAreas',
  LATEST_TOPICS = 'latestTopics',
}

export const getters: GetterTree<ForumState, any> = {
  [Getters.ACTIVE_TOPIC]: state => state.activeTopicId && state.topics[state.activeTopicId],

  [Getters.GROUPED_AREAS]: state => {
    const groups: any[] = [];
    let areas: any[] = [];

    state.areas.forEach(area => {
      if (!area.nest_depth) {
        // Group
        areas = [];
        groups.push({ id: area.id, name: area.name, areas });
      } else {
        // Area
        areas.push(area);
      }
    });

    return groups;
  },

  [Getters.LATEST_TOPICS]: state => state.latestTopicIds.map(id => state.topics[id]),
};

export const enum Mutations {
  SET_ACTIVE_TOPIC = 'setActiveTopic',
  SET_AREAS = 'setAreas',
  SET_LATEST_TOPICS = 'setLatestTopics',
  SET_TOPICS = 'setTopics',
}

export const mutations: MutationTree<ForumState> = {
  [Mutations.SET_ACTIVE_TOPIC]: (state, id?: number) => (state.activeTopicId = id),
  [Mutations.SET_AREAS]: (state, areas: ForumArea[]) => (state.areas = areas),
  [Mutations.SET_LATEST_TOPICS]: (state, ids: number[]) => (state.latestTopicIds = ids),
  [Mutations.SET_TOPICS]: (state, topics: ForumTopic[]) =>
    topics.forEach(topic => (state.topics[topic.id!] = topic)),
};

export const NAMESPACE = 'forum/';
export const forumNamespace = namespace(NAMESPACE);
