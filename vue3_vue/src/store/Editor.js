import { getEditorId ,postEditor } from "@/api"
export default {
    namespaced:true,
    state:{
        editor_Id:0
    },
    actions:{
        GetEditorId({commit}){
            getEditorId().then((result)=>{
                commit('GETEDITORID',result.data)
            })
        },
        async PostEditor(_,val){
            let result=await postEditor(val)
            return result.data
        }
    },
    mutations:{
        GETEDITORID(state,value){
            state.editor_Id=value
        }
    }
}