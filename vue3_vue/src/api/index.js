import {requests,requestsJSON,requestsForeign} from './requests'
export const postLogin=(data)=>{
    return requestsJSON.post('/login',data)
}
// 获取用户基本信息
export const getBasicMsg=()=>{
    return requests('/BasicMsg')
}
// 获取头像 及 之下的wx tim等图片
export const getHeadImg=(path)=>{
    return requests(`/head/Image/?path=${path}`)
}
// 和风天气api
export const getWeather=(address)=>{
    return requestsForeign(`https://devapi.qweather.com/v7/weather/now?location=${address}&key=2a130ce8e05d4721b2d83a4c11287a16`)
}
// 微博热点
export const getWeibo=()=>{
    return requestsForeign('https://tenapi.cn/resou/')
}

//  blogs的初始化
export const getBlogsInit=()=>{
    return requests('/blogs/init')
}
//  后续 blogs 的请求
export const getBlogs=(page)=>{
    return requests(`/blogs?page=${page}`)
}

// LookImg 随机图片 请求
export const getLookImg=()=>{
    return requests('/LookImg')
}

// Look  head信息请求
export const getLookHead=()=>{
    return requests('/Look/head')
}

// Look anime信息请求
export const getLookAnime=(filter)=>{
    return requests(`/Look/anime?filter=${filter}`)
}
// Look anime detail请求
export const getLookAnimeDetail=(id)=>{
    return requests(`/Look/anime/detail?id=${id}`)
}
// Look video信息请求
export const getLookVideo=()=>{
    return requests('/Look/video')
}
// Look eiga信息请求
export const getLookEiga=()=>{
    return requests('/Look/eiga')
}
// 请求音乐列表
export const getMusicList=()=>{
    return requests('/home/musicList')
}
// 请求music 唱片
export const getAlbumList=()=>{
    return requests('/music/list')
}
// 点击album,获取唱片内歌曲
export const getAlbumMsgList=(val)=>{
    return requests(`/music/album?album=${val}`)
}
// 获取blogs编写时 编号(用于提交)
export const getEditorId=()=>{
    return requests('/getEditorId')
}
// 提交数据
export const postEditor=(data)=>{
    return requests.post('/upload/cover',data)
}
// 点击文章 获取数据 
export const getArticle=(id)=>{
    return requests.get(`/getArticle?id=${id}`)
}
// 提交留言
// 未在vuex
export const postLeaveMsg=(data)=>{
    return requests.post('/leaveMessage',data)
}
// 获取collect资源信息
export const getCollect=()=>{
    return requests.get('/collect/download')
}
// collect检索请求
export const getCollectSearch=(val)=>{
    return requests.get(`/collect/search?search=${val}`)
}
// 添加/删除 歌曲后,将ID传给服务器
export const postMusicID=(data)=>{
    return requests.post(`/Music/change`,data)
}