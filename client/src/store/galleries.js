import format from 'date-fns/format';
import get from 'lodash/get';
import setWith from 'lodash/setWith';

import { Mutations as ImageMutations } from './images';
import { dateRange } from '../utils/time';
import Gallery from '../models/Gallery';

export const Actions = {
  GET_GALLERIES_BY_DATE: 'getGalleriesByDate',
};

export const Getters = {
  GALLERIES_BY_DATE: 'galleriesByDate',
};

export const Mutations = {
  SET_GALLERIES: 'setGalleries',
  SET_GALLERIES_BY_DATE: 'setGalleriesByDate',
  SET_GALLERY: 'setGallery',
};

const PAGE_SIZE = 20;

export const state = () => ({
  idsByDate: {},
  byId: {},
});

export const actions = {
  /**
   * Get galleries by date.
   *
   * @param  {Function}  commit
   * @param  {Number}    [year]
   * @param  {Number}    [month]
   * @param  {Number}    [day]
   * @param  {Number}    [page]
   * @param  {Number}    [limit]
   * @returns  {Promise<void>}
   */
  async [Actions.GET_GALLERIES_BY_DATE]({ commit }, { year, month, day, page, limit }) {
    let params;

    if (year) {
      const { from, to } = dateRange(year, month, undefined, day);

      params = {
        from: format(from, 'YYYY-MM-DD'),
        to: format(to, 'YYYY-MM-DD'),
      };
    }

    const galleries = await Gallery.params(params)
      .limit(limit || PAGE_SIZE)
      .page(page || 1)
      .get();

    // Set galleries
    commit(Mutations.SET_GALLERIES, galleries);
    commit(Mutations.SET_GALLERIES_BY_DATE, { galleries, date: { year, month, day }, page });

    // Set images
    const images = [];

    galleries.forEach(gallery => gallery.default_image && images.push(gallery.default_image));

    if (images.length) {
      commit(`images/${ImageMutations.SET_IMAGES}`, images, { root: true });
    }
  },
};

export const getters = {
  [Getters.GALLERIES_BY_DATE]: state => (date, page) => {
    const path = [date.year || 'latest'];

    date.month && path.push(date.month);
    date.day && path.push(date.day);
    path.push(`page:${page || 1}`);

    const galleryIds = get(state.idsByDate, path, []);
    const galleries = [];

    galleryIds.forEach(id => galleries.push(state.byId[id]));

    return galleries;
  },
};

export const mutations = {
  [Mutations.SET_GALLERIES](state, galleries) {
    galleries.forEach(gallery => mutations[Mutations.SET_GALLERY](state, gallery));
  },

  [Mutations.SET_GALLERIES_BY_DATE](state, { galleries, date, page }) {
    const path = [date.year || 'latest'];

    date.month && path.push(date.month);
    date.day && path.push(date.day);
    path.push(`page:${page || 1}`);

    const pageful = [];

    galleries.forEach(gallery => pageful.push(gallery.id));

    setWith(state.idsByDate, path, pageful, Object);
  },

  [Mutations.SET_GALLERY](state, gallery) {
    const { event, default_image, ...flatGallery } = gallery; // eslint-disable-line

    if (event) {
      flatGallery.date = event.begins_at;
      flatGallery.name = event.name;
    } else if (flatGallery.event_date) {
      flatGallery.date = flatGallery.event_date;
    } else {
      flatGallery.date = flatGallery.created_at;
    }

    state.byId[flatGallery.id] = flatGallery;
  },
};
