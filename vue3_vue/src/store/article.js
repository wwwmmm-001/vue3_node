import { getArticle } from '@/api'
export default {
    namespaced:true,
    state:{
        content:''
    },
    actions:{
        GetArticle({commit},val){
            getArticle(val).then((result)=>{
                commit("GETARTICLE",result.data)
            }).catch((err)=>{
                console.log(err);
            })
        }
    },
    mutations:{
        GETARTICLE(state,val){
            
            state.content=val
        }
    }

}