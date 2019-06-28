import Vue from 'vue';
import VueAsyncComputed from 'vue-async-computed';
import VueAutosuggest from 'vue-autosuggest';

Vue.use(VueAsyncComputed);
Vue.use(VueAutosuggest);

import AutoFocus from '../directives/autofocus';

Vue.directive('autofocus', AutoFocus);
