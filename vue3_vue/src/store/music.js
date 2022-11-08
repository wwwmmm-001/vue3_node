import { getAlbumList,getAlbumMsgList,postMusicID } from '@/api'
export default{
    namespaced:true,
    state:{
        albumList:[],
        albumMsg:[]
    },
    actions:{
        GetAlbumList({commit}){
            getAlbumList().then((result)=>{
                commit('GETALBUMLIST',result.data)
            }).catch((err)=>{
                console.log(err);
            })
        },
        GetAlbumMsgList({commit},val){
            getAlbumMsgList(val).then((result)=>{
                commit('GETALBUMMSGLIST',result.data)
            }).catch((err)=>{
                console.log(err);
            })
        },
        PostMusicID(_,data){
            postMusicID(data).then(()=>{}).catch((err)=>console.log(err))
        }
    },
    mutations:{
        GETALBUMLIST(state,value){
            state.albumList=value
        },
        GETALBUMMSGLIST(state,value){
            state.albumMsg=value
        },

    }
}