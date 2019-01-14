export const Mutations = {
  SET_IMAGE:  'setImage',
  SET_IMAGES: 'setImages',
};


export const state = () => ({
  images: {},
});


export const mutations = {
  [Mutations.SET_IMAGE](state, image) {
    state.images[image.id] = {
      ...image,
      created_at: new Date(image.created_at),
    };
  },

  [Mutations.SET_IMAGES](state, images) {
    images.forEach(image => mutations[Mutations.SET_IMAGE](state, image));
  }
};
