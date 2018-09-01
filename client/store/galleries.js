import format from 'date-fns/format';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

import { dateRange } from '../utils/time';


export const Actions = {
  GET_GALLERIES_BY_DATE: 'galleries/getGalleriesByDate',
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
   * @param  {Object}    getters
   * @param  {Number}    [year]
   * @param  {Number}    [month]
   * @param  {Number}    [day]
   * @param  {Number}    [page]
   * @returns  {Promise<void>}
   */
  async getGalleriesByDate({ commit, getters }, { year, month, day, page }) {
    const params = { limit: PAGE_SIZE };

    if (year) {
      const { from, to } = dateRange(year, month, undefined, day);

      params.from   = format(from, 'YYYY-MM-DD');
      params.to     = format(to, 'YYYY-MM-DD');
      params.offset = (page - 1) * params.limit;
    }

    // Already fetched?
    if (getters['galleriesByDate']({ year, month, day }, page).length) {
      return;
    }

    const { data } = await this.$axios.get('galleries', { params });

    commit('setGalleries', data.data);
  },

};


export const getters = {

  galleriesByDate: state => (date, page) => {
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

  setGalleries(state, galleries) {
    galleries.forEach(gallery => mutations.setGallery(state, gallery));
  },


  setGallery(state, gallery) {
    const { event, default_image, ...flatGallery } = gallery;

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

    if (default_image) {
      mutations.setImage(state, default_image);
    }
  },


  setImage(state, image) {
    state.images[image.id] = {
      ...image,
      created_at: new Date(image.created_at),
    };
  }
};
