import { namespace } from 'nuxt-property-decorator';
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';

import Favorite from '@/models/Favorite';

interface EventsState {
  favoriteIds: number[] | null;
}

export const state = (): EventsState => ({
  favoriteIds: null,
});

interface EventsActionContext extends ActionContext<EventsState, any> {}

export const actions: ActionTree<EventsState, any> = {
  async addFavorite({ commit }: EventsActionContext, eventId: number) {
    await new Favorite({ event_id: eventId }).save();

    commit('addFavorite', eventId);
  },

  async loadFavorites(
    { commit, getters: { favoritesLoaded } }: EventsActionContext,
    userId: number
  ) {
    if (favoritesLoaded) {
      return;
    }

    const data = await new Favorite()
      .select(['event_id'])
      .filter('user_id', 'eq', userId)
      .get();
    const eventIds = data.map(favorite => favorite.event_id);

    commit('setFavorites', eventIds);
  },

  async removeFavorite({ commit }: EventsActionContext, eventId: number) {
    await new Favorite({ event_id: eventId }).delete();

    commit('removeFavorite', eventId);
  },
};

export const getters: GetterTree<EventsState, any> = {
  favoritesLoaded: store => store.favoriteIds !== null,
  isFavorite: (store: EventsState) => (eventId: number): boolean => {
    return store.favoriteIds !== null && store.favoriteIds.includes(eventId);
  },
};

export const mutations: MutationTree<EventsState> = {
  addFavorite(store: EventsState, eventId: number) {
    if (store.favoriteIds === null) {
      store.favoriteIds = [];
    }

    if (!store.favoriteIds.includes(eventId)) {
      store.favoriteIds.push(eventId);
    }
  },

  removeFavorite(store: EventsState, eventId: number) {
    if (store.favoriteIds === null) {
      return;
    }

    const index = store.favoriteIds.indexOf(eventId);

    if (index >= 0) {
      store.favoriteIds.splice(index, 1);
    }
  },

  setFavorites(store: EventsState, eventIds: number[]) {
    if (store.favoriteIds === null) {
      store.favoriteIds = eventIds;
    } else {
      store.favoriteIds.length = 0;
      store.favoriteIds.push(...eventIds);
    }
  },
};

export const eventsStore = namespace('events/');
