import { getLookImg } from '@/api';
export default {
    namespaced:true,
    state:{
        Images:{}
    },
    actions:{
        async GetLookImg({commit}){
            await getLookImg().then((result)=>{
                commit('GETLOOKIMG',result.data)
            })
        },
    },
    mutations:{
        GETLOOKIMG(state,value){
            if(state.Images.left){
                value.left.forEach((val)=>{
                    state.Images.left.push(val)
                })
                value.middle.forEach((val)=>{
                    state.Images.middle.push(val)
                })
                value.right.forEach((val)=>{
                    state.Images.right.push(val)
                })
            }
            else state.Images=value         
        },
        REMOVEELEMENT(state,value){
            // 出现不平衡时 删除最长的元素
            state.Images[`${value}`].splice((state.Images[`${value}`]).length-1,1)
        }

    }
}