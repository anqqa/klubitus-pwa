import { namespace } from 'nuxt-property-decorator';
import Vue from 'vue';
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';

import Favorite from '@/models/Favorite';

interface EventsState {
  favorites: Record<number, number>;
  favoritesLoaded: boolean;
}

export const state = (): EventsState => ({
  favorites: {},
  favoritesLoaded: false,
});

interface EventsActionContext extends ActionContext<EventsState, any> {}

export const actions: ActionTree<EventsState, any> = {
  async addFavorite({ commit }: EventsActionContext, { eventId, userId }: Record<string, number>) {
    const { id } = await new Favorite({ event_id: eventId, user_id: userId }).save();

    commit('addFavorite', { eventId, id });
  },

  async loadFavorites(
    { commit, getters: { favoritesLoaded } }: EventsActionContext,
    userId: number
  ) {
    if (favoritesLoaded) {
      return;
    }

    const eventIds = {};
    const data = await new Favorite()
      .filter('user_id', 'eq', userId)
      .select(['event_id'])
      .get();
    data.map(favorite => (eventIds[favorite.event_id!] = favorite.id));

    commit('setFavorites', eventIds);
  },

  async removeFavorite({ commit, state: store }: EventsActionContext, eventId: number) {
    const id = store.favorites[eventId];

    if (id) {
      await new Favorite({ id }).delete();

      commit('removeFavorite', eventId);
    }
  },
};

export const getters: GetterTree<EventsState, any> = {
  favoriteIdByEventId: (store: EventsState) => (eventId: number): number | undefined =>
    store.favorites[eventId],
  favoritesLoaded: store => store.favoritesLoaded,
  isFavorite: (store: EventsState) => (eventId: number): boolean => eventId in store.favorites,
};

export const mutations: MutationTree<EventsState> = {
  addFavorite(store: EventsState, { eventId, id }: Record<string, number>) {
    Vue.set(store.favorites, eventId, id);
  },

  removeFavorite(store: EventsState, eventId: number) {
    Vue.delete(store.favorites, eventId);
  },

  setFavorites(store: EventsState, eventIds: Record<number, number>) {
    store.favorites = eventIds;
    store.favoritesLoaded = true;
  },
};

export const eventsStore = namespace('events/');
