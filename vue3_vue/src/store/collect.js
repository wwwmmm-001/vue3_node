import { getCollect,getCollectSearch } from '@/api';
export default {
    namespaced:true,
    state:{
        download:{}
    },
    actions:{
        GetCollect({commit}){
            getCollect().then((result)=>{
                commit('GETCOLLECT',result.data)
            }).catch((err)=>{
                console.log(err);
            })
        },
        GetCollectSearch({commit},val){
            getCollectSearch(val).then((result)=>{
                commit('GETCOLLECT',result.data)
            }).catch((err)=>{
                console.log(err);
            })
        }
    },
    mutations:{
        GETCOLLECT(state,value){
            state.download=value
        }
        
    }
}