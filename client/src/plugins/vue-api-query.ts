import { Model } from 'vue-api-query';

import { BaseModel } from '@/models/BaseModel';

export default ({ $axios }) => {
  Model.$http = $axios;
  BaseModel.$http = $axios;
};
