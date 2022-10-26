import { getBlogsInit,getBlogs } from '@/api';
export default {
    namespaced:true,
    state:{
        blogsInit:[],
        isNull:0
    },
    actions:{
        // blogs init
        async GetBlogsInit({commit}){
            let result=await getBlogsInit()
            commit('GETBLOGSINIT',result.data)
        },
        // blogs 后续请求
        async GetBlogs({commit},value){
            let result=await getBlogs(value)
            if(result.data.status==0){
                commit('GETBLOGS',0)
            }
            else{
                commit('GETBLOGS',result.data)
            }            
        },
        // 删除不需要数据
        clear(context,value){
            context.dispatch=null
            context.commit('CLEAR',context.commit)
        }
    },
    mutations:{
        GETBLOGSINIT(state,value){
            state.blogsInit=value
        },
        GETBLOGS(state,value){
            if(value==0){
                state.isNull=1
            }
            else{
                state.blogsInit.page=value[0]
                state.blogsInit.left.push(value[1])
                if(value[2]){state.blogsInit.right.push(value[2])}
            }
        },
        CLEAR(state,value){
            value=null
            state.blogsInit.page=null
            state.isNull=null
        }
        
    }
}