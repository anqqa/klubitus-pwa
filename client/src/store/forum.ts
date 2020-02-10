// tslint:disable:no-shadowed-variable
import { namespace } from 'nuxt-property-decorator';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import ForumArea from '@/models/ForumArea';
import ForumPost from '@/models/ForumPost';
import ForumTopic from '@/models/ForumTopic';

interface ForumState {
  areas: ForumArea[];
  latestTopicIds?: number[];
  postPages: Record<number, Record<number, number[]>>;
  posts: Record<number, ForumPost>;
  topics: Record<number, ForumTopic>;
}

export const state = (): ForumState => ({
  areas: [],
  postPages: {},
  posts: {},
  topics: {},
});

export const enum Actions {
  LOAD_AREAS = 'loadAreas',
  LOAD_LATEST_TOPICS = 'loadLatestTopics',
  LOAD_POSTS = 'loadPosts',
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

  async [Actions.LOAD_POSTS]({ commit, state }, payload: { page: number; topicId: number }) {
    const { page, topicId } = payload;

    if (topicId in state.postPages && page in state.postPages[topicId]) {
      return;
    }

    const limit = 20;
    const posts = await new ForumTopic({ id: topicId })
      .posts()
      .relation('author')
      .limit(limit)
      .page(page)
      .get();
    const postIds = posts.map(post => post.id!);

    commit(
      Mutations.SET_POSTS,
      posts.map(post => post.data())
    );
    commit(Mutations.SET_POST_PAGES, { page, postIds, topicId });
  },

  async [Actions.LOAD_TOPIC]({ commit, state }, payload: { force?: boolean; topicId: number }) {
    const { force, topicId } = payload;

    if (force || !(topicId in state.topics)) {
      const topic = await new ForumTopic()
        .relation('area')
        .relation('author')
        .find(topicId);

      commit(Mutations.SET_TOPICS, [topic.data()]);
    }
  },
};

export const enum Getters {
  GROUPED_AREAS = 'groupedAreas',
  LATEST_TOPICS = 'latestTopics',
  POSTS_FOR_PAGE = 'postsForPage',
  TOPIC_BY_ID = 'topicById',
}

export const getters: GetterTree<ForumState, any> = {
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

  [Getters.LATEST_TOPICS]: state => state.latestTopicIds?.map(id => state.topics[id]),

  [Getters.POSTS_FOR_PAGE]: state => (payload: { page: number; topicId: number }) => {
    const { page, topicId } = payload;
    const posts: ForumPost[] = [];
    const postIds = (state.postPages[topicId] || {})[page] || [];

    postIds.forEach(id => id in state.posts && posts.push(state.posts[id]));

    return posts;
  },

  [Getters.TOPIC_BY_ID]: state => (id: number) => state.topics[id],
};

export const enum Mutations {
  SET_AREAS = 'setAreas',
  SET_LATEST_TOPICS = 'setLatestTopics',
  SET_POST_PAGES = 'setPostPages',
  SET_POSTS = 'setPosts',
  SET_TOPICS = 'setTopics',
}

export const mutations: MutationTree<ForumState> = {
  [Mutations.SET_AREAS]: (state, areas: ForumArea[]) => (state.areas = areas),

  [Mutations.SET_LATEST_TOPICS]: (state, ids: number[]) => (state.latestTopicIds = ids),

  [Mutations.SET_POST_PAGES]: (
    state,
    payload: { page: number; postIds: number[]; topicId: number }
  ) => {
    const { page, postIds, topicId } = payload;

    state.postPages[topicId] = { ...(state.postPages[topicId] || {}), [page]: postIds };
  },

  [Mutations.SET_POSTS]: (state, posts: ForumPost[]) =>
    posts.forEach(post => (state.posts[post.id!] = post)),

  [Mutations.SET_TOPICS]: (state, topics: ForumTopic[]) =>
    topics.forEach(topic => (state.topics[topic.id!] = topic)),
};

export const NAMESPACE = 'forum/';
export const forumNamespace = namespace(NAMESPACE);
