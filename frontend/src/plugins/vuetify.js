import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import pt from 'vuetify/es5/locale/pt'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { pt },
    current: 'pt',
  },
  theme: {
      themes: {
        light: {
          //primary: colors.lightBlue.darken3, // #E53935
          //secondary: colors.red.lighten4, // #FFCDD2
          accent: colors.indigo.base, // #3F51B5
          cinza: colors.grey.lighten3,
        },
      },
    },
});
