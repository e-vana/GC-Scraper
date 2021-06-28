import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    keywordsArray: [],
  },
  mutations: {
    SET_KEYWORDS: (state, payload) => {
      state.keywordsArray = payload;
    }
  },
  actions: {
    fetchKeywords: async function ({commit}) {
      try {
        console.log('vuex fetchkeyword fired')
        console.log(process.env.VUE_APP_API_URL)
        let keywords = await axios.get(process.env.VUE_APP_API_URL+'/scrapes', {headers: {"Content-Type": "application/json"}});
        console.log(keywords);
        if(keywords.data){
          keywords.data.forEach(keyword => {
            keyword.results = keyword.data.length;
            if(keyword.lastUpdated){
              let dateOld = keyword.lastUpdated;
              let date = new Date(dateOld);
              keyword.lastUpdated = date.toTimeString();
            }
          });
        }
        commit('SET_KEYWORDS', keywords.data)
      } catch (error) {
        console.log(error);
      }

    }
  },
  getters: {
    getKeywords: (state) => {
      return state.keywordsArray;
    }
  },
  modules: {
  }
})
