import { postLogin } from '@/api';
export default {
    namespaced:true,
    state:{
        
    },
    actions:{
        async PostLogin(context,value){
            let result=await postLogin(value)
            if(result.data.status!=200){
                ElMessage({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: result.data.msg,
                    duration:3500
                })
                return 0
            }
            else{
                return 1
            }
        },
    },
    mutations:{

    }
}