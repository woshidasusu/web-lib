import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import dlog from '@static/lib/dlog';

Vue.use(Vuex);

const options = {
  modules
};
dlog.log('[Vuex]', options);

export default new Vuex.Store(options);
