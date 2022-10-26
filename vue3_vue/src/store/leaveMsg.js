import { postLeaveMsg } from '@/api';
export default {
    namespaced:true,
    actions:{
        async PostLeaveMsg(_,value){
            let result = await postLeaveMsg(value)
            return result.data
        }
    },

}