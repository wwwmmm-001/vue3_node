import { getLookHead, getLookAnime, getLookVideo, getLookEiga, getLookAnimeDetail } from '@/api'
export default {
    namespaced: true,
    state: {
        head: [],
        anime: [],
        video: [],
        eiga: [],
        detail: {}
    },
    actions: {
        // 请求头部
        async GetLookHead({ commit }) {
            await getLookHead().then((result) => {
                commit('GETLOOKHEAD', result.data)
            })

        },
        // anime板块
        async GetLookAnime({ commit }, val) {
            await getLookAnime(val).then((result) => {
                commit('GETLOOKANIME', result.data)
            })
        },
        async GetLookAnimeDetail({ commit }, val) {
            await getLookAnimeDetail(val).then((result) => {
                commit('GETLOOKANIMEDETAIL', result.data)
            })
        },
        // video板块
        async GetLookVideo({ commit }) {
            await getLookVideo().then((result) => {
                commit('GETLOOKVIDEO', result.data)
            })
        },
        // Eiga板块
        async GetLookEiga({ commit }) {
            await getLookEiga().then((result) => {
                commit('GETLOOKEIGA', result.data)
            })
        }
    },
    mutations: {
        GETLOOKHEAD(state, value) {
            state.head = value
        },
        GETLOOKANIME(state, value) {
            state.anime = value
        },
        GETLOOKVIDEO(state, value) {
            state.video = value
        },
        GETLOOKEIGA(state, value) {
            state.eiga = value
        },
        GETLOOKANIMEDETAIL(state,value){
            state.detail=value
        }

    }
}