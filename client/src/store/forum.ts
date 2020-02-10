// tslint:disable:no-shadowed-variable
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import ForumTopic from '@/models/ForumTopic';
import { namespace } from 'nuxt-property-decorator';

interface ForumState {
  activeTopicId?: number;
  topics: Record<number, ForumTopic>;
}

export const state = (): ForumState => ({
  topics: {},
});

export const enum Actions {
  LOAD_TOPIC = 'loadTopic',
}

export const actions: ActionTree<ForumState, any> = {
  // tslint:disable-next-line:no-shadowed-variable
  async [Actions.LOAD_TOPIC](
    { commit, state },
    payload: { activate?: boolean; force?: boolean; topicId: number }
  ) {
    const { activate, force, topicId } = payload;

    if (force || !(topicId in state.topics)) {
      const topic = await new ForumTopic().find(topicId);

      commit(Mutations.SET_TOPIC, topic.data());
    }

    if (activate) {
      commit(Mutations.SET_ACTIVE_TOPIC, topicId);
    }
  },
};

export const enum Getters {
  ACTIVE_TOPIC = 'activeTopic',
}

export const getters: GetterTree<ForumState, any> = {
  [Getters.ACTIVE_TOPIC]: state => state.activeTopicId && state.topics[state.activeTopicId],
};

export const enum Mutations {
  SET_ACTIVE_TOPIC = 'setActiveTopic',
  SET_TOPIC = 'setTopic',
}

export const mutations: MutationTree<ForumState> = {
  [Mutations.SET_ACTIVE_TOPIC]: (state, id?: number) => (state.activeTopicId = id),
  [Mutations.SET_TOPIC]: (state, topic: ForumTopic) => (state.topics[topic.id!] = topic),
};

export const NAMESPACE = 'forum/';
export const forumNamespace = namespace(NAMESPACE);
