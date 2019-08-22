import format from 'date-fns/format';
import get from 'lodash/get';
import setWith from 'lodash/setWith';
import { namespace } from 'nuxt-property-decorator';
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';

import Gallery from '@/models/Gallery';
import Image from '@/models/Image';
import { dateRange } from '@/utils/time';
import { Mutations as ImageMutations } from './images';

const PAGE_SIZE = 20;

interface FlatGallery extends Gallery {
  date?: string;
}

export interface GalleriesState {
  byId: Record<number, FlatGallery>;
  idsByDate: Record<string, number[]>;
}

export const state = (): GalleriesState => ({
  idsByDate: {},
  byId: {},
});

interface GalleriesActionContext extends ActionContext<GalleriesState, any> {}

export const Actions = {
  GET_GALLERIES_BY_DATE: 'getGalleriesByDate',
};

export const actions: ActionTree<GalleriesState, any> = {
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
  async [Actions.GET_GALLERIES_BY_DATE](
    { commit }: GalleriesActionContext,
    {
      year,
      month,
      day,
      page,
      limit,
    }: Partial<Record<'day' | 'month' | 'year' | 'page' | 'limit', number>>
  ) {
    const query = new Gallery()
      .relation('default_image')
      .relation('event')
      .sort('updated_at', 'DESC')
      .limit(limit || PAGE_SIZE)
      .page(page || 1);

    if (year) {
      const { from, to } = dateRange(year, month, undefined, day);

      query.filter('event_date', 'between', [format(from, 'YYYY-MM-DD'), format(to, 'YYYY-MM-DD')]);
    }

    const galleries = await query.get();

    // Set galleries
    commit(Mutations.SET_GALLERIES, galleries);
    commit(Mutations.SET_GALLERIES_BY_DATE, { galleries, date: { year, month, day }, page });

    // Set images
    const images: Image[] = [];

    galleries.forEach(gallery => gallery.default_image && images.push(gallery.default_image));

    if (images.length) {
      commit(`images/${ImageMutations.SET_IMAGES}`, images, { root: true });
    }
  },
};

export type DatePayload = Partial<Record<'day' | 'month' | 'year', number>>;

export const Getters = {
  GALLERIES_BY_DATE: 'getGalleriesByDate',
};

export const getters: GetterTree<GalleriesState, any> = {
  getGalleriesByDate: (store: GalleriesState) => (
    date: DatePayload,
    page?: number
  ): FlatGallery[] => {
    const path = [date.year || 'latest'];

    date.month && path.push(date.month);
    date.day && path.push(date.day);
    path.push(`page:${page || 1}`);

    const galleryIds = get(store.idsByDate, path, []);
    const galleries: FlatGallery[] = [];

    galleryIds.forEach(id => galleries.push(store.byId[id]));

    return galleries;
  },
};

export const Mutations = {
  SET_GALLERIES: 'setGalleries',
  SET_GALLERIES_BY_DATE: 'setGalleriesByDate',
  SET_GALLERY: 'setGallery',
};

export const mutations: MutationTree<GalleriesState> = {
  [Mutations.SET_GALLERIES](store: GalleriesState, galleries: Gallery[]) {
    galleries.forEach(gallery => mutations[Mutations.SET_GALLERY](store, gallery));
  },

  [Mutations.SET_GALLERIES_BY_DATE](store: GalleriesState, { galleries, date, page }) {
    const path = [date.year || 'latest'];

    date.month && path.push(date.month);
    date.day && path.push(date.day);
    path.push(`page:${page || 1}`);

    const pageful: number[] = [];

    galleries.forEach(gallery => pageful.push(gallery.id));

    setWith(store.idsByDate, path, pageful, Object);
  },

  [Mutations.SET_GALLERY](store: GalleriesState, gallery: Gallery) {
    const { event, default_image, ...flatGallery } = gallery;

    if (event) {
      (flatGallery as FlatGallery).date = event.begins_at!;
      (flatGallery as FlatGallery).name = event.name!;
    } else if (flatGallery.event_date) {
      (flatGallery as FlatGallery).date = flatGallery.event_date;
    } else {
      (flatGallery as FlatGallery).date = flatGallery.created_at!;
    }

    store.byId[flatGallery.id!] = flatGallery;
  },
};

export const galleriesStore = namespace('galleries/');
