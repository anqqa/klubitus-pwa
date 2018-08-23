import Vue from 'vue';
import VueAsyncComputed from 'vue-async-computed';
import Vuelidate from 'vuelidate';

Vue.use(VueAsyncComputed);
Vue.use(Vuelidate);


import AutoFocus from '../directives/autofocus';

Vue.directive('autofocus', AutoFocus);

