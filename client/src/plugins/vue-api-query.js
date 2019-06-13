import { Model } from 'vue-api-query';

export default ({ $axios }) => {
  Model.$http = $axios;
};
