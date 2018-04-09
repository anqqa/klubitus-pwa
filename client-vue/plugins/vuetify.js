import Vue from 'vue';
import {
  Vuetify,
  VApp,
  VBtn,
  VCard,
  VDivider,
  VFooter,
  VGrid,
  VIcon,
  VList,
  VNavigationDrawer,
  VTextField,
  VToolbar
} from 'vuetify';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VCard,
    VDivider,
    VFooter,
    VGrid,
    VIcon,
    VList,
    VNavigationDrawer,
    VTextField,
    VToolbar,
  },
  theme: {
    primary: colors.pink.base,
  },
});
