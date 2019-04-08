import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

const state = {
  isAuthenicated: false,
  user: null,
  chapters:[],//章节
  sourceId:''//小说id
};
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
