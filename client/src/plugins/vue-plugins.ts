import Vue from 'vue';
import VueAsyncComputed from 'vue-async-computed';

Vue.use(VueAsyncComputed);

import AutoFocus from '../directives/autofocus';

Vue.directive('autofocus', AutoFocus);
