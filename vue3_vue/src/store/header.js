import { getMusicList } from "@/api"
export default {
    namespaced:true,
    state:{
        musicList:[]
    },
    actions:{
        GetMusicList({commit}){
            getMusicList().then((result)=>{
                commit('GETMUSICLIST',result.data)
            })
        }
    },
    mutations:{
        GETMUSICLIST(state,value){
            state.musicList=value
        }
    }
}