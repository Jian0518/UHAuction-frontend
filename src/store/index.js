import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'

// install Vuex plugin into the Vue instance
Vue.use(Vuex)

// create a new Vuex store instance
const store = new Vuex.Store({
    // split the store into separate modules
    //the user module is included 
    modules: {
        user
    },
    getters
})

export default store