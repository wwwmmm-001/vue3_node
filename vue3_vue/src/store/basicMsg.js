import { getBasicMsg,getHeadImg,getWeather,getWeibo } from '@/api';
export default {
    namespaced:true,
    state:{
        BasicMsg:{},
        weather:{},
        weibo:[]
    },
    actions:{
        // 获取用户基本信息
        async GetBasicMsg({commit},value){
            let result=await getBasicMsg()
            commit('GETBASICMSG',result.data)
        },
        // 获取头像,wx,tim图片
        GetHeadImg(context,value){
            getHeadImg(value)
        },
        // 和风天气api
        async GetWeather({commit},value){
            // value 城市编码
            // 宜宾:101271101
            let result=await getWeather(value)
            commit('GETWEATHER',result.data.now)
        },
        // 微博热点api
        async GetWeibo({commit},value){
            let result=await getWeibo()
            commit('GETWEIBO',result.data.list)
        }
    },
    mutations:{
        // 添加BasicMsg
        GETBASICMSG(state,value){
            state.BasicMsg=value
        },
        // 添加weather
        GETWEATHER(state,value){
            state.weather=value
        },
        // 添加热搜数据
        GETWEIBO(state,value){
            state.weibo=value
        }
    }
}