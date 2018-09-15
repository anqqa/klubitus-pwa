import format from 'date-fns/format';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

import { Mutations as ImageMutations } from './images';
import { dateRange } from '../utils/time';


export const Actions = {
  GET_GALLERIES_BY_DATE: 'getGalleriesByDate',
};


export const Getters = {
  GALLERIES_BY_DATE: 'galleriesByDate',
};


export const Mutations = {
  SET_GALLERIES: 'setGalleries',
  SET_GALLERY:   'setGallery',
};


const PAGE_SIZE = 20;


export const state = () => ({
  byId:    {},
  fetched: {},
  images:  {},
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
   * @returns  {Promise<void>}
   */
  async [Actions.GET_GALLERIES_BY_DATE]({ commit }, { year, month, day, page }) {
    const params = { limit: PAGE_SIZE };

    if (year) {
      const { from, to } = dateRange(year, month, undefined, day);

      params.from   = format(from, 'YYYY-MM-DD');
      params.to     = format(to, 'YYYY-MM-DD');
      params.offset = (page - 1) * params.limit;
    }

    const { data } = await this.$axios.get('galleries', { params });

    // Set galleries
    commit(Mutations.SET_GALLERIES, data.data);


    // Set images
    const images = [];

    data.data.forEach(gallery => gallery.default_image && images.push(gallery.default_image));

    if (images.length) {
      commit(`images/${ImageMutations.SET_IMAGES}`, images, { root: true });
    }
  },

};


export const getters = {

  [Getters.GALLERIES_BY_DATE]: state => (date, page) => {
    const galleriesByDate = filter(state.byId, gallery => {
      const galleryDate = new Date(gallery.date);

      if (date.year && galleryDate.getFullYear() !== date.year) {
        return false;
      }

      if (date.month && (galleryDate.getMonth() + 1) !== date.month) {
        return false;
      }

      if (date.day && galleryDate.getDate() !== date.day) {
        return false;
      }

      return true;
    });

    const orderedByDate = orderBy(galleriesByDate, ['date', 'desc']);

    if (page) {
      return orderedByDate.slice((page - 1) * PAGE_SIZE, PAGE_SIZE);
    }

    return orderedByDate;
  },

};


export const mutations = {

  [Mutations.SET_GALLERIES](state, galleries) {
    galleries.forEach(gallery => mutations[Mutations.SET_GALLERY](state, gallery));
  },


  [Mutations.SET_GALLERY](state, gallery) {
    const { event, default_image, ...flatGallery } = gallery; // eslint-disable-line

    if (event) {
      flatGallery.date = event.begins_at;
      flatGallery.name = event.name;
    }
    else if (flatGallery.event_date) {
      flatGallery.date = flatGallery.event_date;
    }
    else {
      flatGallery.date = flatGallery.created_at;
    }

    state.byId[flatGallery.id] = flatGallery;
  },

};
