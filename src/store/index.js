import Vue from 'vue'
import Vuex from 'vuex'
import { commonModule } from './modules/common'
import { buildModule } from './modules/build'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        [commonModule.name]: commonModule,
        [buildModule.name]: buildModule
    }
})
