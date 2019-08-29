import { MutationTree } from 'vuex';

import Image from '@/models/Image';

interface ImagesState {
  images: Record<number, Image>;
}

export const Mutations = {
  SET_IMAGE: 'setImage',
  SET_IMAGES: 'setImages',
};

export const state = (): ImagesState => ({
  images: {},
});

export const mutations: MutationTree<ImagesState> = {
  [Mutations.SET_IMAGE](store: ImagesState, image: Image) {
    store.images[image.id!] = image;
  },

  [Mutations.SET_IMAGES](store: ImagesState, images: Image[]) {
    images.forEach(image => mutations[Mutations.SET_IMAGE](store, image));
  },
};
