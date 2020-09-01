const defaultState = {
    activeData: {}
}
export const BUILD_ACTIVEDATA = 'BUILD_ACTIVEDATA'
export const buildModule = {
    namespaced: true,
    name: 'build',
    state: defaultState,
    getters: {
        activeData: state => state.activeData
    },
    actions: {
        [BUILD_ACTIVEDATA] ({ state, commit }, data) {
            commit(BUILD_ACTIVEDATA, data)
        }
    },
    mutations: {
        [BUILD_ACTIVEDATA] (state, data) {
            state.activeData = data
        }
    }
}
