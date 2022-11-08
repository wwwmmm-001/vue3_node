<template>
    <div class="home">
        <div class="first">
            <a class="one" @click="goDown">
                <span>主页</span>
            </a>
            <router-link class="two" to="/music" target="_blank">
                <span>音乐</span>
            </router-link>
            <router-link class="three" to="/look" target="_blank">
                <span>放映</span>
            </router-link>
        </div>
        <div class="second">
            <router-link class="four" to='/about' target="_blank">
                <span>关于</span>
            </router-link>
            <router-link class="five" to="/collect" target="_blank">
                <span>收藏</span>
            </router-link>
            <a class="six" @click="showMessage($event,1)">
                <span>联系</span>
            </a>
        </div>
        <span class="movedown" ref="blinkDown" @click="goDown">
            <el-icon :size="30" color="white">
                <ArrowDownBold />
            </el-icon>
        </span>
    </div>


    <div class="body">
        <div class="content">
            <!-- 预先占位 -->
            <div class="details">
                <blogs />
            </div>
            <div class="personal" ref="personal">
                <div class="basicMsg">
                    <div class="photo">
                        <img v-if="photo" :src='photo' alt="">
                    </div>
                    <div class="About">
                        <span class="rank">年度大会员</span>
                        <p v-if="Msg" class="userName">{{Msg.Name}}</p>
                        <p class="note">Hello World</p>
                    </div>
                    <div class="count">
                        <table>
                            <tr class="setSize">
                                <td>文章</td>
                                <td>点赞</td>
                                <td>收藏</td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>7</td>
                                <td>4</td>
                            </tr>
                        </table>
                    </div>
                    <div class="contact_icon" @click="showMessage($event)">
                        <span class="wx"><img src="./images/wx_icon.png" title="微信"></span>
                        <span class="tim"><img src="./images/Tim_icon.png" title="Tim"></span>
                        <span class="email"><img src="./images/email.png" title="邮箱"></span>
                        <span class="phone"><img src="./images/phone_icon.png" title="手机"></span>

                    </div>
                    <img class="cat" src="./images/Cat.gif" alt="">
                </div>
                <div class="weather">
                    <span>{{weather.obsTime}}&nbsp;&nbsp;<i :class="weather.icon"></i>
                        {{weather.text}}&nbsp;&nbsp;{{weather.temp}}℃</span>
                    <p>{{nowDate.time}}</p>
                    <span>
                        <el-icon color="gray">
                            <Promotion />
                        </el-icon>{{weather.winDir}} {{weather.winScale}}級<strong class="setPadding">宜宾</strong>
                    </span>
                </div>
                <div class="weiboHot">
                    <p class="title">微博热点</p>
                    <h5 v-if="!weiboHot[0]">加载中...</h5>
                    <h5 v-if="!weiboHot[0]">超过20s,可以尝试刷新页面</h5>
                    <ul v-if="weiboHot[0]">
                        <li v-for="(data,index) in weiboHot" :key="index">
                            <i class="i_left">{{index+1}}.&nbsp;</i><a :href="data.url" target="_blank">
                                <p :title="data.name">{{data.name}}</p><i class="i_right">{{hot_parse(data.hot)}}</i>
                            </a>
                            <br>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <button class="write" title="发布一篇自己的文章" ref="goWrite">
            <router-link to="/editor">发布</router-link>
        </button>

        <button class="goSearch" ref="goSearch">
            <el-icon>
                <Search />
            </el-icon>
            <input type="text" v-model.lazy="inputText" ref='search' @keydown.enter="SearchBing"
                placeholder="bing ~    Enter 搜索">
        </button>

        <goTop />

        <div class="floor">
            <h4>this is floor</h4>
        </div>


    </div>

    <div class="showMessage" ref="showMsg" @click="closeShow">
        <img src="">
        <p></p>
    </div>
</template>

<script>
import 'qweather-icons/font/qweather-icons.css'
import { onMounted, onUnmounted, ref, computed, watch, inject, shallowRef, nextTick } from 'vue';
import { useStore } from 'vuex';
import { Move,stopMove } from '@/assets/js/Move_stop'
import goUp_Down from '@/assets/js/goUp_Down'
import blogs from '@/components/home_blogs/index.vue'
import goTop from '@/components/goTop.vue'

export default {
    name: 'MyPersonal',
    components: {
        blogs,
        goTop
    },
    setup() {       

        //#region 
        const store = useStore()

        // app中挂载scroll  发出de当前页面位置
        let pageY = inject('pageY')

        // 当前页面所处位置百分比
        let top_all = computed(() => {
            let point = ((pageY.value) / (document.body.clientHeight - window.innerHeight)) * 100
            return Math.ceil(point)
        })

        // 返回存储state的微博热点数据
        //#region 
        let weiboHot = shallowRef({})
        if ((store.state.basicMsg.weibo).length) {
            nextTick(() => {
                watch_weibo()
                weibo_conputed = null
            })
            weiboHot.value = store.state.basicMsg.weibo
        }
        let weibo_conputed = computed(() => {
            return store.state.basicMsg.weibo
        })
        let watch_weibo = watch(weibo_conputed, (newV) => {
            if (newV.length) {
                weiboHot.value = newV
                watch_weibo()
                weibo_conputed = null
            }
        })
        // 处理有时热度出现 '音乐 12345' 等 去除音乐字符
        function hot_parse(value) {
            let val = value
            if (value) {
                if (typeof value == 'string') {
                    let reg = /[1-9][0-9]*/g
                    val = value.match(reg)[0]
                }
            }
            return val
        }
        //#endregion 


        // =======返回state获取的路径,img的src发请求=====
        let photo = computed(() => {
            let path = 0
            if (store.state.basicMsg.BasicMsg.avatar) {
                path = '/api/head/Image/?path=' + store.state.basicMsg.BasicMsg.avatar
            }
            return path
        })
        let Msg = computed(() => {
            return store.state.basicMsg.BasicMsg.message
        })


        // =======时间=======
        // 左下角时间
        // 天气块时间
        let nowDate = shallowRef({ time: '' })
        function getTime() {
            setInterval(() => {
                let date = new Date()
                let h = date.getHours()
                let m = date.getMinutes()
                let s = date.getSeconds()
                h < 10 ? h = '0' + h : h
                m < 10 ? m = '0' + m : m
                s < 10 ? s = '0' + s : s
                nowDate.value = { time: h + ':' + m + ':' + s }
            }, 1000)
        }


        // weather
        //#region
        let text = computed(() => store.state.basicMsg.weather.text)
        let weather = shallowRef({})
        // 切换至其它切回home时判断
        if (store.state.basicMsg.weather.obsTime) {
            nextTick(() => {
                watch_weather()
                text = null
            })
            weather.value = {
                obsTime: store.state.basicMsg.weather.obsTime.split('+')[0],
                text: store.state.basicMsg.weather.text,
                icon: 'qi-' + store.state.basicMsg.weather.icon,
                temp: store.state.basicMsg.weather.temp,
                winDir: store.state.basicMsg.weather.windDir,
                winScale: store.state.basicMsg.weather.windScale,
            }
        }
        let watch_weather = watch(text, (newValue) => {
            if (newValue) {
                weather.value = {
                    obsTime: store.state.basicMsg.weather.obsTime.split('+')[0],
                    text: store.state.basicMsg.weather.text,
                    icon: 'qi-' + store.state.basicMsg.weather.icon,
                    temp: store.state.basicMsg.weather.temp,
                    winDir: store.state.basicMsg.weather.windDir,
                    winScale: store.state.basicMsg.weather.windScale,
                }
                watch_weather()
                text = null
            }
        })
        //#endregion

        //#region 
        // ======向下移动======
        // goDown ref
        let blinkDown = ref(null)
        // 上下移动使用
        let Timer = 0
        // 动画使用
        let bottom = 1.9
        let opacity = 1

        // 点击窗口向下移动100vh

        const goDown = () => goUp_Down(window.innerHeight)

        // ======返回顶部======


        // 输入框 bing跳转
        let goSearch = ref(null)
        let inputText = ref('')
        // 获取ref 手动触发blur 配合v-model.lazy
        let search = ref(null)
        function SearchBing() {
            search.value.blur()
            window.open(`https://cn.bing.com/search?q=${inputText.value}`);
            inputText.value = ''
        }

        // 发布文章
        let goWrite = ref(null)

        // ===向上移动隐藏 personal板块，向下移动显示===
        // 节流        
        let Timerinterval = 0
        let Timertimeout = 0
        let personal = ref(null)
        watch(pageY, (newValue) => {
            let vw = window.innerWidth / 100
            let flex_opacity_minus = 1
            let flex_opacity_plus = 0
            let translateX = 0
            // 节流
            if (Timertimeout) { return false }
            else {
                // 判断Timerinterval 动画是否存在 存在返回false
                if (Timerinterval) { return false }
                Timertimeout = setTimeout(() => {
                    if (newValue - window.innerHeight > -5 * vw) {
                        window.removeEventListener('mousemove', showHeader)
                        showHead_add = 0
                        homeShowHeader('0')
                        goSearch.value.style.display = 'block'
                        goWrite.value.style.display = ' block '
                    }
                    else if (newValue - window.innerHeight < -10 * vw) {
                        homeShowHeader('-105%')                        
                        window.addEventListener('mousemove', showHeader)
                        showHead_add = 1
                        goSearch.value.style.display = 'none'
                        goWrite.value.style.display = ' none '
                    }
                    // 用户向下移动触发动画1
                    if (newValue - window.innerHeight > vw * 15) {

                        // 判断是否已经触发 1 动画 / 用户是否手动点击隐藏
                        if (personal.value.style.opacity == 0) {
                            Timertimeout = null
                            return false
                        }

                        Timerinterval = setInterval(() => {
                            flex_opacity_minus -= 0.02
                            translateX += 9
                            personal.value.style.flex = flex_opacity_minus
                            personal.value.style.opacity = flex_opacity_minus
                            personal.value.style.transform = `translateX(${translateX}px)`
                            if (flex_opacity_minus <= 0) {
                                personal.value.style.flex = 0
                                personal.value.style.opacity = 0
                                clearInterval(Timerinterval)
                                Timerinterval = null
                            }
                        }, 8)
                    }
                    // 用户向下移动触发动画2
                    else if (newValue - window.innerHeight < -3 * vw) {

                        // 判断是否已经触发 2 动画,触发即返回 即.personal板块 显示
                        if (personal.value.style.opacity == 1) {
                            Timertimeout = null
                            return false
                        }
                        personal.value.style.position = ''
                        personal.value.style.transform = ''
                        Timerinterval = setInterval(() => {
                            flex_opacity_plus += 0.02
                            personal.value.style.flex = flex_opacity_plus
                            personal.value.style.opacity = flex_opacity_plus
                            personal.value.style.transform = `translateX(${translateX}px)`
                            if (flex_opacity_plus >= 1) {
                                clearInterval(Timerinterval)
                                Timerinterval = null
                            }
                        }, 8)
                    }
                    Timertimeout = null
                }, 120)
            }
        })
        // window.addEventListener('mousemove', showHeader) app初识化绑定的header鼠标移入显示事件
        let showHeader = inject('showHeader')
        // 手动控制header的显示与否 0% -105%
        let homeShowHeader = inject('homeShowHeader')

        //#endregion
        let timerGodownIcon = null
        onMounted(() => {
            // opacity初始化
            personal.value.style.opacity = 1
            // goDown闪烁移动
            timerGodownIcon = setInterval(() => {
                if (Timer == 0) { bottom -= 0.02; opacity -= 0.01 }
                else { bottom += 0.02; opacity += 0.01 }

                if (bottom < .5) {
                    Timer = 1
                } else if (bottom > 2) {
                    Timer = 0
                }
                blinkDown.value.style.bottom = bottom + 'vw'
                blinkDown.value.style.opacity = opacity
            }, 12)
            // 显示时间
            getTime()
            // 获取基本信息
            store.dispatch('basicMsg/GetBasicMsg')

        })
        // 判断是否存在showhead mousemove事件
        let showHead_add = 1
        onUnmounted(() => {
            if (!showHead_add) window.addEventListener('mousemove', showHeader)
            clearInterval(timerGodownIcon)
            timerGodownIcon = null
            clearInterval(Timerinterval)
            Timerinterval = null
        })
        //#endregion

        // 显示wx tim信息
        let showMsg = ref(null)
        function showMessage(e, wx) {
            if (wx) {
                showMsg.value.children[0].src = '/api/head/Image?path=weixin.jpg'
                showMsg.value.style.display = 'flex'
                stopMove()
                return
            }
            let name = e.target.parentNode.getAttribute('class')
            if (name == 'wx') {
                showMsg.value.children[0].src = '/api/head/Image?path=weixin.jpg'
                showMsg.value.style.display = 'flex'
                stopMove()
            }
            else if (name == 'tim') {
                showMsg.value.children[0].src = '/api/head/Image?path=tim.jpg'
                showMsg.value.style.display = 'flex'
                stopMove()
            }
            else if (name == 'email') {
                showMsg.value.style.display = 'flex'
                showMsg.value.children[1].innerText = Msg.value.email
                stopMove()
            }
            else if (name == 'phone') {
                showMsg.value.style.display = 'flex'
                showMsg.value.children[1].innerText = Msg.value.phone
                stopMove()
            }

        }

        // 关闭showMessage
        function closeShow() {
            showMsg.value.children[0].src = ''
            showMsg.value.children[1].innerText = ''
            showMsg.value.style.display = 'none'
            Move()
        }

        return {
            blinkDown, // goDown  ref
            goDown, // 向下滚动 100vh 函数

            photo,  // 头像 computed
            Msg,   // 个人信息 computed   

            weather, // 天气信息

            personal, // personal ref

            top_all, // 返回顶部 computed
            nowDate, // 时:分 
            inputText, // Search keywords
            search, // Search ref
            goSearch, // 包裹Search的span ref
            SearchBing, // bing Search
            weiboHot, // 微博热点信息
            hot_parse,

            goWrite,
            showMessage,
            showMsg,
            closeShow,            
        }
    }
}
</script>

<style scoped lang="less">
.home {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #6299e0;
    position: relative;

    .first {
        width: 100%;
        height: 50vh;
        display: flex;

        a {
            position: relative;
            display: block;
            color: black;
        }

        a:hover span {
            opacity: 1;
            transform: scale(1.1, 1.1) translate(-50%, -50%);
        }

        span {
            position: absolute;
            font-size: 2vw;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            opacity: .3;
            transition: all 0.4s;
        }

        .one {
            width: 33.33334%;
            height: 100%;
            background-color: #638a66;
            animation: showFirstOne .5s;
            animation-timing-function: ease-out;
            border-radius: 100px 0 0 0;
        }

        .two {
            width: 33.33334%;
            height: 100%;
            background-color: #a2bda2;
            animation: showFirst .8s;
            animation-timing-function: ease-out;
        }

        .three {
            width: 33.33334%;
            height: 100%;
            background-color: #c0e1d9;
            animation: showFirst 1.05s;
            animation-timing-function: ease-out;
            // border-radius: 0 100px 0 0;
        }
    }

    .second {
        width: 100%;
        height: 50vh;
        display: flex;

        a {
            display: block;
            position: relative;
            color: black;
        }

        a:hover span {
            opacity: 1;
            transform: scale(1.1, 1.1) translate(-50%, -50%);
        }

        span {
            position: absolute;
            font-size: 2vw;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            opacity: .3;
            transition: all 0.4s;
        }

        .four {
            width: 33.33334%;
            height: 100%;
            background-color: #f0ebd6;
            animation: showFirst 1.35s;
            animation-timing-function: ease-out;
            // border-radius: 0 0 0 100px;
        }

        .five {
            width: 33.33334%;
            height: 100%;
            background-color: pink;
            animation: showFirst 1.65s;
            animation-timing-function: ease-out;
        }

        .six {
            width: 33.33334%;
            height: 100%;
            background-color: #d2977c;
            animation: showFirst 1.95s;
            animation-timing-function: ease-out;
            border-radius: 0 0 100px 0;
        }
    }

    @keyframes showFirst {
        from {
            opacity: 0;
            transform: translateY(150%);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes showFirstOne {
        from {
            opacity: 0;
            transform: translateY(80%);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .movedown {
        position: absolute;
        text-align: center;
        bottom: 1.9vw;
        width: 5vw;
        left: 50%;
        transform: translateX(-50%);
        padding-top: .5vw;

        .el-icon {
            color: rgb(49, 49, 45);
        }
    }
}

.body {
    width: 100%;
    background-attachment: fixed;
    overflow: hidden;
    background-image: url(@/assets/bc3.png);

    .content {
        display: flex;
        box-sizing: border-box;
        width: 70%;
        margin: 0 auto;
        margin-top: 2vw;

        .details {
            width: 100%;
            flex: 4;
            padding-right: 1vw;
        }

        .personal {
            position: relative;
            flex: 1;

            .switch {
                position: absolute;
                color: cornflowerblue;
                font-size: 1.2vw;
                right: .4vw;
                top: .4vw;
                z-index: 999;
            }

            .basicMsg {
                position: relative;
                border-radius: 10px;
                height: 20vw;
                background-color: rgb(223, 223, 223);
                box-shadow: 0 0 2px 1px rgb(35, 213, 219);
                overflow: hidden;
                margin-bottom: .7vw;

                .photo {
                    width: 5.5vw;
                    height: 5.5vw;
                    border-radius: 100px;
                    background-color: pink;
                    margin: 0 auto;
                    margin-top: 1vw;
                    overflow: hidden;

                    img {
                        margin-left: .1vw;
                        width: auto;
                        height: auto;
                        max-width: 110%;
                        max-height: 110%;
                        transition: .5s;
                    }

                    img:hover {
                        transform: rotateZ(40deg);
                    }
                }

                .About {
                    margin-top: .1vw;
                    text-align: center;

                    .userName {
                        font-size: 1.6vw;
                        color: #444040;
                        font-weight: 540;
                    }

                    .note {
                        font-size: .75vw;
                        color: #606060;
                    }

                    .rank {
                        font-size: .5vw;
                        padding: .1vw;
                        border-radius: 5px;
                        background: rgb(251, 114, 153);
                        color: rgb(255, 255, 255)
                    }
                }

                .count {
                    margin-top: 1vw;
                    font-size: 1vw;

                    table {
                        width: 100%;
                        margin: 0 auto;

                        .setSize {
                            font-size: .8vw;
                            font-weight: 520;
                            color: darkslategray;
                        }

                        // border-spacing: .8vw;
                        td {
                            text-align: center;
                            vertical-align: middle;
                            // padding: 0 .5vw;
                        }
                    }
                }

                .contact_icon {
                    margin-top: 1vw;
                    display: flex;
                    width: 100%;
                    height: 1.1vw;
                    justify-content: space-around;

                    img {
                        width: 100%;
                        vertical-align: middle;
                        transition: all .5s;

                    }

                    img:hover {
                        transform: scale(1.4, 1.4);
                    }

                    span {
                        text-align: center;
                        height: 1.1vw;
                        width: 1.5vw;
                    }
                }

                .cat {
                    width: 25%;
                    position: absolute;
                    bottom: -.5vw;
                    right: 0;
                }

            }
        }

    }

    .showPerson {
        position: fixed;
        display: none;
        right: .3vw;
        top: 30vh;
        color: #085785;
        font-size: 1.9vw;
    }

    .weather {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 6vw;
        padding: .4vw;
        margin-bottom: .7vw;
        box-sizing: border-box;
        border-radius: 5px;
        background-color: rgba(185, 196, 201, 0.95);
        box-shadow: 0 0 3px 1px rgb(150, 150, 150);

        span {
            flex: 1;
            font-size: .7vw;
            font-weight: 550;

            i {
                font-size: .9vw;
            }

            .setPadding {
                padding-right: .5vw;
                float: right;
            }

            .el-icon {
                padding-left: .5vw;
                vertical-align: bottom;
            }
        }

        span:nth-child(1) {
            text-align: center;
        }

        p {
            flex: 2;
            text-align: center;
            margin: auto 0;
            line-height: 3vw;
            font-size: 1.4vw;
            font-weight: 600;
        }
    }

    .weiboHot {
        // width: 13.59vw;
        height: 10vw;
        padding: .4vw;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: scroll;
        scrollbar-width: none;
        /* firefox */
        -ms-overflow-style: none;

        /* IE 10+ */
        &::-webkit-scrollbar {
            // chrome safari
            display: none;
        }

        border-radius: 5px;
        background-color: rgba(185, 201, 196, 0.95);
        box-shadow: 0 0 3px 1px rgb(150, 150, 150);

        // text-align: center;
        .title {
            width: 90%;
            font-size: 1vw;
            margin: 0 auto;
            padding-bottom: .1vw;
        }

        ul {
            margin: 0 auto;
            width: 96%;
            padding: 0;
            display: block;

            li {
                padding: 0.22vw 0;
            }

            i {
                font-size: 0.9vw;

            }

            .i_left {
                float: left;
            }

            .i_right {
                float: right;
                font-style: normal;
                font-size: 0.8vw;
                color: #606060;
            }

            a:visited {
                color: #0978ff;
            }

            a:hover {
                color: #0978ff;
            }

            a:link {
                color: rgb(100, 100, 100);
            }

            a:active {
                color: green;
            }

            p {
                float: left;
                overflow: hidden;
                width: 58%;
                -webkit-line-clamp: 1;
                font-size: .8vw;
                word-break: break-all;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                font-weight: 700;
            }

            p:hover {
                transform: scale(1.05, 1.05);
                color: #4a4acf;
            }
        }
    }


}

.goSearch {
    position: relative;
    display: none;
    border: none;
    position: fixed;
    font-size: .8vw;
    color: white;
    text-align: center;

    font-size: 1vw;
    width: 2.6vw;
    height: 2.6vw;
    right: 2.5vw;
    bottom: 5.85vw;
    padding: .34vw;
    border-radius: 8px;
    background-color: rgba(19, 121, 168, 0.85);

    .el-icon {
        color: white;
        vertical-align: middle;
    }

    input {
        position: absolute;
        border: none;
        outline: none;
        height: 2.6vw;
        width: 2.6vw;
        opacity: 0;
        top: 0;
        right: 0;
        font-size: 1vw;
        background-color: rgb(174, 225, 248);
        border-radius: 8px;
        transition: all .5s;
    }

    input:focus {
        opacity: 1;
        width: 18vw;
    }
}

.goSearch:hover input {
    opacity: 1;
    width: 18vw;
}

.write {
    position: fixed;
    display: none;
    border: none;
    font-size: .8vw;
    text-align: center;
    right: 2.5vw;
    width: 2.6vw;
    height: 5vw;
    bottom: 8.7vw;
    font-size: 1.2vw;
    padding: .34vw;
    border-radius: 8px;
    background-color: rgba(19, 121, 168, 0.9);

    a {
        color: white;
    }
}

.write:hover {
    cursor: pointer;
}

.time {
    display: none;
    position: fixed;
    font-size: .8vw;
    border: none;
    color: white;
    left: .1vw;
    bottom: 1.5vw;
    padding: .3vw;
    border-radius: 8px;
    background-color: rgba(6, 73, 104, 0.9);
}

.floor {
    text-align: center;
    background-color: rgba(25, 25, 25, .5);
    margin-top: 4vw;
    font-size: 1vw;
}


.showMessage {
    // display: flex;
    display: none;
    justify-content: center;
    align-items: center;
    position: fixed;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: rgba(25, 25, 25, .65);

    img {
        max-height: 90%;
    }

    p {
        font-size: 1.4vw;
        color: white;
    }
}
</style>