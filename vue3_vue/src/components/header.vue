<template>
    <div class="head">
        <div class="Time">
            <span>{{ nowTime }}</span>
        </div>
        <div class="all">
            <router-link class="home" to="/home" :class="{ active: router_path == '/home' }">
                <div class="top">主页</div>
                <div class="middle">
                    <el-icon>
                        <HomeFilled />
                    </el-icon>
                </div>
                <div class="bottom">.</div>
            </router-link>

            <router-link class="Img" to="/lookImg" :class="{ active: router_path == '/lookImg' }">
                <div class="top">图片</div>
                <div class="middle">
                    <el-icon>
                        <PictureFilled />
                    </el-icon>
                </div>
                <div class="bottom">.</div>
            </router-link>

            <router-link class="Look" to="/look" :class="{ active: router_path == '/look' }">
                <div class="top">放映</div>
                <div class="middle">
                    <el-icon>
                        <VideoCameraFilled />
                    </el-icon>
                </div>
                <div class="bottom">.</div>
            </router-link>

            <router-link class="collect" to="/collect" :class="{ active: router_path == '/collect' }">
                <div class="top">收藏</div>
                <div class="middle">
                    <el-icon>
                        <Opportunity />
                    </el-icon>
                </div>
                <div class="bottom">.</div>
            </router-link>

            <a class="About" :class="{ active: router_path == '/about' ||  router_path == '/leavemsg'}">
                <div class="top">其它</div>
                <div class="middle">
                    <el-icon>
                        <UserFilled />
                    </el-icon>
                </div>
                <div class="bottom">.</div>
                <div class="other">
                    <router-link to="/about">关于</router-link>
                    <router-link to="/leavemsg">给我留盐</router-link>
                </div>
            </a>

        </div>
        <div class="music">
            <div>
                <audio ref="music" @canplay="setComplete" @ended="audioEnded"></audio>
                <div class="name" @click="showName">
                    <p ref="moveName">{{ musicName }}</p>
                </div>

                <div class="btn">
                    <span class="left" @click="ClickLeft">
                        <el-icon>
                            <ArrowLeft />
                        </el-icon>
                    </span>
                    <div class="play_pause">
                        <span class="play" @click="ClickPlay" ref="play">
                            <el-icon class="etet">
                                <VideoPlay />
                            </el-icon>
                        </span>
                        <span class="pause" @click="ClickPause" ref="pause">
                            <el-icon>
                                <VideoPause />
                            </el-icon>
                        </span>
                    </div>
                    <span class="right" @click="ClickRight">
                        <el-icon>
                            <ArrowRight />
                        </el-icon>
                    </span>
                </div>
                <div class="volume" @mousemove="setVolume">
                    <img src="@/assets/oto.png">
                    <div class="slider-demo-block">
                        <span class="demonstration"></span>
                        <el-slider v-model="value1" />
                    </div>
                </div>
                <div class="music_floor">
                    <span class="playMode" @click="playMode">
                        <span ref="changeMode">
                            <i class="iconfont icon-bofang-xunhuanbofang" data-mode="loop"></i>
                            <i class="iconfont icon-suijibofang" style="font-size:1vw" data-mode="random"></i>
                        </span>

                    </span>
                    <span class="musicList">
                        <el-icon @click="showMusicList(1)">
                            <Expand />
                        </el-icon>
                        <div class="List" ref="music_list">
                            <span class="musicList_close">
                                <el-icon @click="showMusicList(0)">
                                    <Close />
                                </el-icon>
                            </span>
                            <ul>
                                <li v-for="(music, index) in musicList" :key="index" :title="music"
                                    :class="{ musci_active_li: music_index == index }" @dblclick="list_play(index)">
                                    <i
                                        :class="{ musci_active_placeholder: true, musci_active: music_index == index }"></i>
                                    <p>{{ music }}</p>
                                </li>

                            </ul>
                        </div>
                    </span>

                </div>
            </div>

        </div>

    </div>
</template>

<script>
import { ref, onMounted, computed, watch, inject, shallowReactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import '@/assets/icon/iconfont.css'
export default {
    name: 'MyHeader',
    setup() {
        const store = useStore()
        const router = useRouter()
        let nowTime = ref('00:00')
        onMounted(() => {
            // 时间
            setInterval(() => {
                let date = new Date()
                let h = date.getHours()
                let m = date.getMinutes()
                h < 10 ? h = '0' + h : h
                m < 10 ? m = '0' + m : m
                nowTime.value = h + ':' + m
            }, 1000)

            // 请求音乐列表
            store.dispatch('header/GetMusicList')
            setVolume()
        })

        let router_path = computed(() => router.currentRoute.value.path)
        watch(router_path, () => {
            homeShowHeader('-105%')
        })

        let homeShowHeader = inject('homeShowHeader')

        // 判断music src请求是否返回
        let complete = 0
        function setComplete() {
            complete = 1
            if (!init_play) ClickPlay()
        }

        // 切换下一首上一首及播放暂停
        //#region 
        let init_play = 1
        function ClickPlay() {
            if (!complete) return
            init_play = 0
            Refs.music.play()
            Refs.play.style.transform = 'translateY(-2.7vw)'
            Refs.pause.style.transform = 'translateY(-2.7vw)'
        }
        function ClickPause() {
            if (!complete) return
            Refs.music.pause()
            Refs.play.style.transform = 'translateY(0)'
            Refs.pause.style.transform = 'translateY(0)'
        }
        function ClickLeft() {
            play_index(-1)
        }
        function ClickRight(_, l_index = 0) {
            // 判断是否式 li_list内点击
            if (!l_index) play_index(1)
            Refs.musicName = musicList.value[Refs.music_index]
            complete = 0
            let music = musicList.value[Refs.music_index]
            music = music.replace('+', "%2B")
            Refs.music.src = `/api/home/music?path=${music}`
        }
        //#endregion
        // 是否播放完毕,切换下一首
        function audioEnded() {
            ClickRight()
        }
        let last_index = []
        function play_index(go) {
            Refs.music.pause()
            if (!playMode_index) {
                Refs.music_index += go
                if (Refs.music_index < 0) {
                    Refs.music_index = musicList.value.length - 1
                }
                else if (Refs.music_index > musicList.value.length - 1) {
                    Refs.music_index = 0
                }
            }
            else {
                if (go == -1 && last_index.length > 1) {
                    Refs.music_index = last_index[last_index.length - 2]
                    last_index = []
                } else {
                    let len = musicList.value.length
                    let nowIndex = Refs.music_index
                    Refs.music_index = Math.floor(Math.random() * len)
                    while (nowIndex == Refs.music_index) {
                        Refs.music_index = Math.floor(Math.random() * len)
                    }
                    last_index.push(Refs.music_index)
                }
            }
            Refs.musicName = musicList.value[Refs.music_index]
            complete = 0
            let music = musicList.value[Refs.music_index]
            music = music.replace('+', "%2B")
            Refs.music.src = `/api/home/music?path=${music}`

        }


        // music列表
        let musicList = computed(() => {
            return store.state.header.musicList
        })

        // 初始化 设置interval如果music信息返回 给audio绑定src
        let timer_http_rank = 0
        timer_http_rank = watch(musicList, (newV) => {
            if (newV) {
                Refs.music.src = `/api/home/music?path=${musicList.value[Refs.music_index]}`
                Refs.musicName = musicList.value[0]
                timer_http_rank()
            }
        })


        // 如果名称过长 点击移动p标签 显示
        let timer_move = 0
        function showName(e) {
            if (timer_move) return
            // 遮挡p标签距离
            let width = e.target.scrollWidth;
            // 包裹div标签宽度一半
            let max = (e.target.offsetWidth) / 2
            // 每次移动
            let move = 2
            timer_move = setInterval(() => {
                if (width - move <= max) {
                    clearInterval(timer_move)
                    timer_move = null
                    setTimeout(() => {
                        Refs.moveName.style.transform = 'translateX(0px)'
                    }, 1000)
                    return
                }
                Refs.moveName.style.transform = `translateX(-${move}px)`
                move += 2
            }, 60)
        }

        // 修改音量通过move实现 节流
        let timer_volume = 0
        function setVolume() {
            if (timer_volume) { return }
            timer_volume = setTimeout(() => {
                Refs.music.volume = (Refs.value1) / 100
                timer_volume = 0
            }, 12)
        }

        // 修改播放模式
        let playMode_index = 0  // 0 循环播放 1 随机播放
        function playMode(e) {
            let mode = e.target.getAttribute('data-mode')
            let modeIn = ['loop', 'random']
            if (modeIn.indexOf(mode) == -1) return false
            let children = Refs.changeMode.children
            if (mode == 'loop') {
                children[0].style.transform = 'translateY(-1.95vw)'
                children[1].style.transform = 'translateY(-1.95vw)'
                playMode_index = 1
            }
            else {
                children[0].style.transform = 'translateY(0vw)'
                children[1].style.transform = 'translateY(0)'
                playMode_index = 0
                last_index = []
            }
        }

        // 显示/关闭 music_list列表
        function showMusicList(val) {
            if (!val) {
                Refs.music_list.style.transform = 'translateX(-100%)'
                Refs.music_list.style.opacity = 0
            }
            else {
                Refs.music_list.style.transform = 'translateX(0)'
                Refs.music_list.style.opacity = 1
            }
        }
        // music_list 双击切换歌曲
        function list_play(index) {
            Refs.music_index = index
            ClickRight(0, 1)
        }

        // 整合ref
        let Refs = shallowReactive({
            value1: 50, // 音量
            musicName: 'loading', // music Name
            // 当前播放music 索引
            music_index: 0,
            // 获取元素
            moveName: null, //音乐名称点击移动 Name元素
            music: null, // audio 标签
            play: null, // 播放
            pause: null, // 暂停
            changeMode: null, //播放模式
            music_list: null //音乐列表
        })

        return {
            nowTime,
            ClickPlay,
            ClickPause,
            ClickLeft,
            ClickRight,
            setVolume,
            showName,
            musicList,
            router_path,
            setComplete,
            audioEnded,
            playMode,
            showMusicList,
            list_play,
            ...toRefs(Refs)
        }
    }
}
</script>

<style lang="less" scoped>
.head {
    position: fixed;
    text-align: center;
    top: 0;
    left: 0;
    background-color: rgb(228, 228, 228);
    width: 9.5vw;
    height: 100vh;
    transform: translateX(-105%);
    transition: all .4s;

    a {
        color: black;
    }

    .all {
        height: 57%;
    }

    .Time {
        position: relative;
        height: 20%;
        font-size: 1.8vw;
        color: rgb(228, 225, 211);

        span {
            box-sizing: border-box;
            padding: .2vw .6vw;
            background-color: rgb(33, 56, 70);
            border-radius: 10px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .music {
        height: 23%;
        position: relative;
        width: 100%;

        .music_floor {
            margin-top: .22vw;
            padding: 0 .2vw;
            display: flex;
            justify-content: space-around;

            span {
                width: 1.5vw;
                height: 1.5vw;

                i {
                    line-height: 1.5vw;
                    transition: all .2s;
                    padding: .2vw;
                }
            }

            .playMode {
                color: rgb(210, 210, 210);

                span {
                    display: inline-block;
                    overflow-y: hidden;

                    i {
                        display: block;
                        font-size: 1.1vw;
                    }

                    i:nth-child(1) {
                        transform: translateY(-0.1vw);
                    }
                }
            }

            .musicList {
                i {
                    font-size: 1.2vw;
                    color: rgb(185, 185, 185);
                }

                .musicList_close {
                    position: absolute;
                    right: 5px;
                    top: 0;
                    background-color: rgba(43, 38, 38, 0.5);
                    border-radius: 0 0 0 2px;
                    width: 0.9vw;
                    height: 0.9vw;
                    transition: all .2s;
                    overflow: hidden;
                    cursor: pointer;

                    .el-icon {
                        font-size: .65vw;
                        position: absolute;
                        padding: .2vw;
                        line-height: 0;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        transition: all .2s;
                    }
                }

                .musicList_close:hover {
                    background-color: rgba(43, 38, 38, 0.8);
                    transform: scale(1.15, 1.15);
                }

                .musicList_close:hover .el-icon {
                    color: white;
                }

                .List {
                    transition: .35s;
                    transform: translateX(-100%);
                    width: 100%;
                    height: 100%;
                    background-color: rgb(235, 235, 235);
                    border-radius: 0 1px 0 0;
                    right: 0;
                    bottom: 0;
                    position: absolute;
                    box-shadow: 0 0 3px 1px rgb(120, 120, 120);

                    // 滚动条宽度
                    ul::-webkit-scrollbar {
                        width: 5px;
                    }

                    // 滚动条颜色
                    ul::-webkit-scrollbar-thumb {
                        border-radius: 2px;
                        background: rgba(112, 105, 105, 0.9);
                    }

                    // 滚动处背景
                    ul::-webkit-scrollbar-track {
                        border-radius: 0;
                        background: rgba(245, 241, 241, 0.4);
                    }

                    ul {
                        list-style: none;
                        height: 100%;
                        padding: 0;
                        margin: 0;
                        font-size: .65vw;
                        color: rgb(18, 10, 10);
                        overflow-y: scroll;
                        overflow-x: hidden;


                        li {
                            height: 20%;
                            display: flex;
                            width: 100%;
                            box-sizing: border-box;
                            align-items: center;
                            text-align: left;

                            i {
                                color: black;
                                font-style: normal;
                                font-size: .8vw;
                            }

                            p {
                                overflow: hidden;
                                width: 85%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }

                        .musci_active_placeholder::before {
                            content: '>';
                            color: rgba(0, 0, 0, 0);
                            font-weight: 700;
                        }

                        .musci_active::before {
                            content: '>';
                            color: rgb(0, 138, 252);
                            font-weight: 700;
                        }

                        .musci_active_li {
                            color: rgb(0, 138, 252);
                            font-weight: 700;
                        }

                        li:nth-child(2n-1) {
                            border-radius: 4px;
                            background-color: rgb(200, 213, 218);
                        }

                        li:hover {
                            background-color: rgb(195, 205, 210);
                        }

                        li:focus {
                            background-color: rgb(185, 200, 200);
                        }

                    }
                }


            }
        }

        .el-icon {
            color: rgb(95, 67, 67);
        }

        div:nth-child(1) {
            position: absolute;
            width: 100%;
            height: 80%;
            top: 20%;
            box-sizing: border-box;
            padding: 1vw .3vw;
            border-radius: 0 7px 0 0;
            background-color: rgba(36, 36, 36, 0.6);

            .name {
                width: 100%;
                height: 1.4vw;
                font-weight: 700;
                font-size: 1vw;
                text-align: center;
                overflow: hidden;
                color: rgb(238, 247, 239);
            }

            p {
                white-space: nowrap;
            }

            .btn {
                padding-top: .68vw;
                font-size: 2vw;

                .play_pause {
                    vertical-align: top;
                    display: inline-block;
                    width: 2.2vw;
                    height: 2.2vw;
                    overflow: hidden;
                    transition: all .2s;
                    padding: 0;

                    .el-icon {
                        color: rgb(170, 170, 170);
                    }

                    .play,
                    .pause {
                        display: block;
                        transition: all .15s;
                    }
                }

                .play_pause:hover {
                    transform: scale(1.2, 1.2) translateY(-8%);
                }

                .play_pause:hover .el-icon {
                    color: rgb(200, 200, 200);
                }

                .play_pause:active {
                    background-color: rgb(179, 179, 179);
                    border-radius: 7px;
                }

                .play_pause:active .el-icon {
                    color: rgb(80, 80, 80);
                }

                .left,
                .right {
                    display: inline-block;
                    position: relative;
                    font-weight: 700;
                    margin: .2vw;
                    width: 1.8vw;
                    height: 1.65vw;
                    font-size: 1.35vw;
                    transition: all .2s;

                    .el-icon {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        color: rgb(70, 70, 70);

                    }
                }

                .left:hover {
                    transform: scale(1.2, 1.2) translateX(-5%);
                }

                .left:hover .el-icon {
                    color: rgb(220, 220, 220);
                }

                .left:active {
                    background-color: rgba(245, 245, 245, 0.45);
                    border-radius: 30%;
                }

                .left:active .el-icon {
                    color: rgb(82, 76, 76);
                }

                .right:hover {
                    transform: scale(1.2, 1.2) translateX(5%);
                }

                .right:hover .el-icon {
                    color: rgb(220, 220, 220);
                }

                .right:active {
                    background-color: rgba(245, 245, 245, 0.45);
                    border-radius: 30%;
                }

                .right:active .el-icon {
                    color: rgb(82, 76, 76);
                }

            }
        }

        .volume {
            width: 94%;
            height: 1vw;
            padding-left: .15vw;
            display: flex;
            align-items: center;

            img {
                width: 1vw;
                height: 1vw;
                float: left;
            }

            .slider-demo-block {
                opacity: .3;
                margin-left: .38vw;
                transition: all .2s;
            }

            .el-slider {
                width: 5.7vw;
                --el-slider-button-size: 16px;
                --el-slider-main-bg-color: rgb(58, 56, 56) !important;
            }
        }

        .volume:hover .slider-demo-block {
            opacity: 1;
        }
    }

    .home {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
        font-size: 1vw;
        font-weight: 600;
        height: 20%;
    }

    .home:hover .top {
        transform: rotateX(0) translateY(95%);
    }

    .home:hover .bottom {
        transform: rotateX(0) translateY(-48%);
    }

    .home:hover .middle {
        opacity: 0;
    }

    .Img {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
        font-size: 1vw;
        font-weight: 600;
        height: 20%;

    }

    .Img:hover .top {
        transform: rotateX(0) translateY(95%);
    }

    .Img:hover .bottom {
        transform: rotateX(0) translateY(-48%);
    }

    .Img:hover .middle {
        opacity: 0;
    }

    .Look {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
        font-size: 1vw;
        font-weight: 600;
        height: 20%;

    }

    .Look:hover .top {
        transform: rotateX(0) translateY(95%);
    }

    .Look:hover .bottom {
        transform: rotateX(0) translateY(-48%);
    }

    .Look:hover .middle {
        opacity: 0;
    }

    .collect {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
        font-size: 1vw;
        font-weight: 600;
        height: 20%;

    }

    .collect:hover .top {
        transform: rotateX(0) translateY(95%);
    }

    .collect:hover .bottom {
        transform: rotateX(0) translateY(-48%);
    }

    .collect:hover .middle {
        opacity: 0;
    }

    .About {
        width: 100%;
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
        font-size: .9vw;
        font-weight: 600;
        height: 20%;

        .other {
            display: block;
            position: absolute;
            right: -2.75vw;
            width: 5.5vw;
            padding: .6vw 0;
            height: 4.88125vw;
            box-sizing: border-box;
            font-size: .8vw;
            border-radius: 4px;
            background-color: rgb(234, 234, 234);
            box-shadow: 0 0 5px 1px #999;
            transform: translateX(-50%) scale(0.35, 0.1);
            opacity: 0;
            transition: all .3s;
            z-index: 10;

            a {
                display: inline-block;
                font-weight: normal;
                box-sizing: border-box;
                padding: .4vw .6vw;
                width: 100%;
                color: rgb(150, 76, 23);
                text-align: left;
                transition: all .25s;
            }

            a:hover {
                background-color: rgba(189, 182, 182, .8);
                transform: scale(1.04, 1.04) translateX(-0.05vw);
                color: black;
                animation-delay: .1s;
            }
        }
    }

    .About:hover .top {
        transform: rotateX(0) translateY(100%);
    }

    .About:hover .bottom {
        transform: rotateX(0) translateY(-50%);
    }

    .About:hover .middle {
        opacity: 0;
    }

    .About:hover .other {
        width: 5.5vw;
        transform: translateX(18%);
        opacity: 1;
    }
}

.active {
    box-sizing: border-box;
    border-radius: 2.3px;
    border-right: 4px solid rgb(34, 34, 34);
}

.top {
    width: 100%;
    height: 1vw;
    transform: rotateX(90deg);
    transition: all .25s;
    transition-timing-function: ease-in-out;
}

.middle {
    line-height: 0;
    font-size: 1.5vw;
    transition: all .2s;
    color: rgb(71, 66, 66);
    transition-timing-function: ease-in;
}

.bottom {
    font-weight: 700;
    font-size: 1.8vw;
    height: 1vw;
    line-height: 0;
    transform: rotateX(90deg);
    transition: all .25s;
    transition-timing-function: ease-in-out;
}

.el-icon {
    color: rgb(90, 90, 90);
}
</style>