<template>
    <div class="bc" ref="bc" @mouseup="clear_move" @mouseleave="clear_move">
        <i class="iconfont icon-List-1" @click="showHeaderMusicList"></i>
        <div class="headerMusicList" ref="headerMusicList" data-show="0">
            <p>当前列表</p>
            <i>总{{ header_musicList.length }}首</i>
            <hr>
            <ul @click="del_list">
                <li v-for="(music, index) in header_musicList"
                    :class="{ li_list_active: music_active_index.id == music.id }" :key="music.id" :title="music.name"
                    @dblclick="list_click_play(music.id, index)">
                    <span :style="{ opacity: (music_active_index.id == music.id) ? 1 : 0 }">
                        <el-icon>
                            <Histogram />
                        </el-icon>
                    </span>
                    <span><i>{{ music.name }}</i></span>
                    <span><i>{{ music.singer }}</i></span>
                    <span><i>{{ music.time }}</i></span>
                    <span :data-del="index">
                        <el-icon>
                            <CloseBold />
                        </el-icon>
                    </span>
                </li>
            </ul>
        </div>
        <div class="songList" ref="songList" v-show="!zoomIn">
            <p class="title">推荐歌单 ></p>
            <div class="content" @click="album_index">
                <div class="album" v-for="album in albumList" :key="album.id" :data-index="album.id">
                    <img :src="`/api/music/list/cover?path=${album.album}`" alt="" :data-index="album.id">
                    <p :title="album.album" :data-index="album.id">{{ album.album }}</p>
                </div>
            </div>
            <div class="album_songList" v-if="albumList[0]" v-show="showAlbum_songList" ref="album_songList">
                <div class="cover_album">
                    <img :src="`/api/music/list/cover?path=${albumList[Album_songIndex].album}`" alt="">
                    <p>
                        <strong :title="albumList[Album_songIndex].album">{{ albumList[Album_songIndex].album
                        }}</strong><br>
                        <i>歌手:{{ albumList[Album_songIndex].singer }}</i><br>
                        <i>时间:{{ albumList[Album_songIndex].time }}</i>
                    </p>
                </div>
                <div class="album_musicList">
                    <table cellspacing="0px">
                        <thead>
                            <tr>
                                <th></th>
                                <th>音乐标题</th>
                                <th>歌手</th>
                                <th>专辑</th>
                                <th>时间</th>
                                <th>--</th>
                            </tr>
                        </thead>
                        <tbody @click="add_MusicList" @dblclick="play_AlbumMusic">
                            <tr v-for="(music, index) in album_musicList" :key="music.id" :data-index="index"
                                :data-id="music.id"
                                :class="{ album_musicList_active: album_active_id == music.id, Click_musicList_active: Click_active == music.id }">
                                <td><i :style="{ display: album_active_id == music.id ? 'none' : 'block' }">{{
                                        album_musicListFilter(index + 1)
                                }}</i><i class="iconfont icon-triangle"
                                        :style="{ display: album_active_id == music.id ? 'block' : 'none' }"></i></td>
                                <td>{{ music.name }}</td>
                                <td>{{ music.singer }}</td>
                                <td>{{ music.album }}</td>
                                <td>{{ music.time }}</td>
                                <td :data-add="index">
                                    <i class="iconfont icon-add-bold"></i>
                                </td>
                            </tr>
                        </tbody>
                        <span class="AddMsg" ref="AddMsg">Add</span>
                    </table>
                </div>
            </div>
            <span class="album_songList_close" @click="closeAlbum_songList" v-show="showAlbum_songList">
                <el-icon>
                    <ArrowLeftBold />
                </el-icon>
            </span>
        </div>
        <div class="audio_play" v-show="zoomIn">
            <div class="cover_title">
                <img src="./images/bc.jpg" alt="" ref="audio_play_bc">
                <p>{{ cover_title_name }}<br></p>
                <p>{{ cover_title_singer }}</p>
            </div>
            <div class="audio_part">
                <span class="audio_part_span" @click="last_music">
                    <i class="iconfont icon-shangyishou"></i>
                </span>
                <span class="audio_part_span" @click="play_pause">
                    <i class="iconfont icon-play" ref="play"
                        :style="{ transform: (play_css ? 'translateY(-3.5vw)' : 'translateY(0)') }"></i>
                    <i class="iconfont icon-pause" ref="pause"
                        :style="{ transform: (play_css ? 'translateY(-3.5vw)' : 'translateY(0)') }"></i>
                </span>
                <span class="audio_part_span" @click="next_music">
                    <i class="iconfont icon-xiayishou"></i>
                </span>
                <div class="time" ref="time" @mousedown="setCurrentTime">
                    <p data-id="3">{{ time_start }}</p>
                    <!-- 圆点 -->
                    <span :style="{ left: progressBar, opacity: hover_time ? 1 : '' }" data-id="1"></span>
                    <!-- 进度条 -->
                    <span data-id="2" :style="{ height: hover_time ? '0.22vw' : '' }"></span>
                    <!-- 已经走过的进度条(换颜色) -->
                    <span :style="{ width: progressBar, height: hover_time ? '0.22vw' : '' }" data-id="2"></span>
                    <p data-id="3">{{ time_end }}</p>
                </div>
            </div>

        </div>
        <span class="songListZoom" @click="songListZoom">
            <i class="iconfont icon-fangda"></i>
        </span>
        <img :src="bcImg_path" alt="" class="bcImg" ref="bcImg">
        <audio ref="audio" preload="auto" :src="audio_src" @canplay="setComplete" @ended="audioEnded"
            @timeupdate="watchMusicTime"></audio>

    </div>
</template>

<script>
import { inject, onMounted, onUnmounted, reactive, toRefs, computed, watch, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import '@/assets/icon/iconfont.css'
export default {
    name: "MyMusic",
    setup() {

        const store = useStore()
        let showHeader = inject('showHeader')

        let albumList = computed(() => {
            return store.state.music.albumList
        })

        onBeforeMount(() => {
            window.removeEventListener('mousemove', showHeader)
        })
        // 0 表示未有歌曲播放
        let music_index = 0
        onMounted(() => {
            store.dispatch('music/GetAlbumList')
            refs.audio.volume = 0.3
            document.body.addEventListener('mousemove', setBcImgPosition)
        })
        // 表示 是否添加歌曲 0：no 1：yes
        let musicList_change = 0
        onUnmounted(() => {
            window.addEventListener('mousemove', showHeader)
            document.body.removeEventListener('mousemove', setBcImgPosition)
            clearInterval(setBcImgPosition_Timer)
            setBcImgPosition_Timer = null
            if (musicList_change) {
                let new_musicList = []
                for (let i of header_musicList.value) {
                    new_musicList.push(i.id)
                }
                store.dispatch('music/PostMusicID', new_musicList)
            }

        })

        let music_active_index = computed(() => {
            return store.state.eventbus.music_active
        })

        // 此处配合vuex调用header的(watch)双击播放事件
        function list_click_play(id, index) {
            let data = {
                id,
                play: index
            }
            store.commit('eventbus/changeMusic_Active', data)
        }
        let header_musicList = computed(() => {
            return store.state.header.musicList
        })
        function showHeaderMusicList() {
            // 显示musiclist
            refs.headerMusicList.style.top = '1.2vw'
            refs.headerMusicList.style.opacity = 1
            refs.headerMusicList.setAttribute('data-show', 1)
            // display none避免多次点击绑定事件(显示musiclist的图标)
            refs.bc.children[0].style.display = 'none'
            // 加定时器 避免点击同时绑定事件
            setTimeout(() => {
                refs.bc.addEventListener('click', closeHeaderMusicList)
            }, 100)

        }
        // del_index记录当前播放歌曲 是否 被删除影响class
        function del_list(e) {
            if (header_musicList.value.length == 1) return
            let index = switchTarget(e)
            if (index) store.commit('header/DELMUSICLIST', index)
            musicList_change = 1
        }
        // 判断是否关闭 musicList
        function closeHeaderMusicList(e) {
            // 这里点击element plus图标 contains判断不是子元素 所以添加自定义属性(data-del)判断
            let result = switchTarget(e)
            if (typeof result == 'string') return false
            // 这里点击 album list内添加歌曲时取消隐藏musiclist
            result = switchTarget(e, 'data-add')
            if (typeof result == 'string') return false
            // 判断是否点击在musiclist内 不是隐藏musiclist  
            if (!refs.headerMusicList.contains(e.target)) {
                // 恢复显示musiclist的图标
                refs.bc.children[0].style.display = 'block'
                refs.headerMusicList.style.top = '-150%'
                refs.headerMusicList.style.opacity = 0
                refs.headerMusicList.setAttribute('data-show', 0)
                // 取消点击事件
                refs.bc.removeEventListener('click', closeHeaderMusicList)
            }
        }

        // 事件绑定后 判断点击 element plus图标
        function switchTarget(e, Attribute = 'data-del', return_e = 0) {
            let element = ''
            for (let i = 0; i < 4; i++) {
                switch (i) {
                    case 0: element = e.target; break;
                    case 1: element = e.target.parentNode; break;
                    case 2: element = e.target.parentNode.parentNode; break;
                    case 3: element = e.target.parentNode.parentNode.parentNode; break;
                }
                if (element.getAttribute(Attribute) != undefined) {
                    if (return_e) {
                        return { val: element.getAttribute(Attribute), element }
                    }
                    return element.getAttribute(Attribute)
                }
            }
            return false

        }
        let x = 0
        let y = 0
        // 节流
        let setBcImgPosition_Timer = 0
        function setBcImgPosition(e) {
            if (setBcImgPosition_Timer) return
            setBcImgPosition_Timer = setTimeout(() => {
                x = e.clientX / 10
                y = e.clientY / 10;
                refs.bcImg.style.left = -x + 'px';
                refs.bcImg.style.top = -y + 'px';
                setBcImgPosition_Timer = null
            }, 8)

        }
        // 点击album 更换背景 发出请求
        function album_index(e) {
            let index = (e.target.getAttribute('data-index'))
            if (typeof index == 'string') {
                index = Number(index)
                refs.bcImg_path = `/api/music/list/cover?path=${albumList.value[index - 1].album}`
                refs.showAlbum_songList = true
                refs.Album_songIndex = index - 1
                store.dispatch('music/GetAlbumMsgList', index)
                refs.songList.style.maxHeight = '80vh'
                setTimeout(() => {
                    refs.album_songList.style.opacity = 1
                })

            }

        }
        let album_musicList_computed = computed(() => store.state.music.albumMsg)
        watch(album_musicList_computed, (newV) => {
            // 设置总列表长度
            music_length = album_musicList_computed.value.length

            refs.album_musicList = newV
        })
        // 用来处理index 1 > 01
        function album_musicListFilter(str) {
            if (typeof str == 'number') {
                if (str < 10) {
                    str = '0' + str
                }
            }
            else return false
            return str
        }
        // 关闭唱片歌曲列表页面
        function closeAlbum_songList() {
            refs.album_songList.style.opacity = '.85'
            refs.songList.style.maxHeight = '999vh'
            setTimeout(() => {
                refs.album_musicList = []
                refs.showAlbum_songList = false
            }, 100)
        }
        // 添加musiclist 歌曲 / 给单击tr添加背景 (聚焦) / 控制 Add 的显示
        let timer_add = 0
        function add_MusicList(e) {
            let result = switchTarget(e, 'data-add', 1)
            let active = switchTarget(e, 'data-id')
            if (typeof result == 'object') {

                let album_musicList_id = refs.album_musicList[result.val].id
                refs.Click_active = album_musicList_id

                for (let i of header_musicList.value) {
                    if (i.id == album_musicList_id) {
                        ElMessage({
                            showClose: true,
                            message: 'List已存在',
                            duration: 1000
                        })
                        return false
                    }
                }
                musicList_change = 1
                refs.AddMsg.style.opacity = 0
                clearTimeout(timer_add)
                // table距离 album_list顶部距离
                let table_top = result.element.parentNode.parentNode.parentNode.offsetTop
                let vw = document.body.clientWidth / 100
                refs.AddMsg.style.left = result.element.offsetLeft - vw * 0.6 + 'px'
                refs.AddMsg.style.top = result.element.offsetTop + table_top + 'px'
                refs.AddMsg.style.opacity = 1

                timer_add = setTimeout(() => {
                    refs.AddMsg.style.opacity = 0
                    timer_add = null
                }, 700)
                store.commit('header/ADDMUSICLIST', refs.album_musicList[result.val])
            }
            else if (typeof active == 'string') {
                refs.Click_active = active
            }
        }
        // 双击播放
        function play_AlbumMusic(e) {
            let result = e.target.parentNode.getAttribute('data-index')
            if (typeof result == 'string') {
                // 1表示有歌曲播放
                music_index = 1
                // 设置当前播放歌曲索引
                music_play_index = Number(result)
                next_last(music_play_index)

                // active play_pause css
                refs.play_css = 1
                refs.audio_play_bc.setAttribute('src', `/api/music/list/cover?path=${album_musicList_computed.value[0].album}`)
            }

        }
        function songListZoom() {
            if (!refs.zoomIn) {
                refs.zoomIn = 1
            } else {
                refs.zoomIn = 0
            }

        }

        // canplay src结果返回
        let complete = 0
        function setComplete() {
            store.commit('eventbus/changePlay_Pause', 1)
            complete = 1
            play_index = 1
            play_pause()
        }
        // audioEnded 歌曲播放完毕
        function audioEnded() {
            next_music()
        }
        // 当前播放歌曲索引
        let music_play_index = 0
        // 播放列表的总
        let music_length = 0
        function next_music() {
            if (!music_index) return false
            music_play_index += 1
            if (music_play_index >= music_length) music_play_index = 0
            next_last(music_play_index)

        }
        function last_music() {
            if (!music_index) return false
            music_play_index += -1
            if (music_play_index < 0) music_play_index = music_length - 1
            next_last(music_play_index)
        }
        // 给切换上一首下一首及双击播放使用 接收播放index
        function next_last(index) {
            // 切歌后清0
            refs.progressBar = 0
            let value = album_musicList_computed.value[index]
            refs.time_start = '00:00'
            refs.time_end = value.time
            refs.cover_title_name = value.name
            refs.cover_title_singer = `歌手 : ${value.singer}`
            complete = 0
            refs.audio_src = `/api/home/music?path=${value.album}/${value.name}`
            // active id
            refs.album_active_id = value.id

            play_index = 1
            play_pause()

        }

        // 0 暂停 1播放
        let play_index = 1
        function play_pause() {
            if (!music_index) return false
            if (!complete) return
            if (play_index) {

                store.commit('eventbus/changePlay_Pause', 1)
                let play_promise = refs.audio.play()
                if (play_promise !== undefined) {
                    play_promise.then(_ => { })
                        .catch(error => { });
                }
                play_index = 0
                // 控制play_pause style样式
                refs.play_css = 1
            } else {
                refs.audio.pause()
                play_index = 1
                // 控制play_pause style样式
                refs.play_css = 0
            }
        }
        //监听音乐实时播放的时间,设置interval
        function watchMusicTime(e) {
            let musicDom = e.target;
            let currentTime = musicDom.currentTime
            if (!currentTime) return
            // 计算走过进度条 和 圆点 位置
            // 如果正在拖动即取消
            if (CurrentTime_move_vw == -1) {
                refs.progressBar = Math.floor((currentTime / musicDom.duration) * 100) + '%'
                // 已经播放
                let min = Math.floor(currentTime / 60)
                let se = Math.floor(currentTime - min * 60)
                se < 10 ? se = '0' + se + '' : se
                min < 10 ? min = '0' + min + '' : min
                refs.time_start = `${min}:${se}`;
            }



        }
        // 通过自定义属性dat-id判断  1:圆点 2:进度条 3:文字
        function setCurrentTime(e) {
            if (!complete) return
            if (!music_index) return false
            let result = e.target.getAttribute('data-id')
            if (result == '3') return

            let vw = document.body.clientWidth / 100
            // 进度条宽度
            // bar - time  为 .audio_play 子元素 (left 9.5vw)  time :55% bar 99%
            let bar_width = 90.5 * vw * 0.55 * 0.99
            // 点击位置距离左侧距离
            let ClickX = e.screenX
            // 进度条距离左边距离
            let bar = refs.time.getBoundingClientRect().left + bar_width * 0.005;
            let duration = refs.audio.duration
            let CurrentTime = 0
            // 点击圆点
            if (result == '1') {
                // 启用move拖动
                refs.bc.addEventListener('mousemove', setCurrentTime_Move)
                refs.hover_time = 1
                // 获取vw
                CurrentTime_move_vw = document.body.clientWidth / 100
                // 获取总时长
                CurrentTime_move_Duration = duration
            }
            // 计算点击/bar距离左侧距离 减去后 算出比例 乘以总 
            else {
                CurrentTime = ClickX - bar
                if (CurrentTime < 0) CurrentTime = 0
                else if (CurrentTime > bar_width) CurrentTime = bar_width - 1
                CurrentTime = duration * (CurrentTime / bar_width)
                // 不用设置圆点和进度条 更改currentTIme后会触发 timeupdate 事件 
                refs.audio.currentTime = (CurrentTime).toFixed(3)
            }
            // 播放 currentTime切换后会自动播放,这里手动触发播放事件
            play_index = 1
            play_pause()

        }
        // 鼠标拖动进度条
        let timer_move = 0
        function setCurrentTime_Move(e) {
            if (timer_move) return
            timer_move = setTimeout(() => {
                // 进度条宽度

                // 这里判断-1 因为已经mouseup但是setInterval仍未执行完,且mouseup已给CurrentTime_move_vw赋值等于-1
                if (CurrentTime_move_vw == -1) {
                    timer_move = null
                    return false
                }
                CurrentTime_move_BarWidth = 90.5 * CurrentTime_move_vw * 0.55 * 0.99
                // 进度条距离左边距离 
                CurrentTime_move_BarLeft = refs.time.getBoundingClientRect().left + CurrentTime_move_BarWidth * 0.005;
                CurrentTime_move_ClickX = e.screenX
                let minus = CurrentTime_move_ClickX - CurrentTime_move_BarLeft
                if (minus >= CurrentTime_move_BarWidth) {
                    CurrentTime_move_Percent = 0.999
                }
                else if (minus < 0) CurrentTime_move_Percent = 0
                else {
                    CurrentTime_move_Percent = (minus / CurrentTime_move_BarWidth)
                }
                refs.progressBar = Math.floor(CurrentTime_move_Percent * 100) + '%'
                let start_Time = CurrentTime_move_Percent * CurrentTime_move_Duration
                let min = Math.floor(start_Time / 60)
                let se = Math.floor(start_Time - min * 60)
                se < 10 ? se = '0' + se + '' : se
                min < 10 ? min = '0' + min + '' : min
                refs.time_start = `${min}:${se}`;
                timer_move = null
            }, 6)
        }
        // 给拖动进度条使用
        let CurrentTime_move_vw = -1
        let CurrentTime_move_BarWidth = -1
        let CurrentTime_move_BarLeft = -1
        let CurrentTime_move_ClickX = -1
        let CurrentTime_move_Percent = -1
        let CurrentTime_move_Duration = -1
        let clear_move = () => {
            if (!refs.hover_time) return
            // == -1 表示没有移动
            if (CurrentTime_move_BarLeft == -1) {
                let CurrentTime = refs.audio.currentTime - 0.5
                if (CurrentTime < 0) CurrentTime = 0
                refs.audio.currentTime = CurrentTime
            } else {
                CurrentTime_move_BarLeft = -1
                refs.audio.currentTime = (CurrentTime_move_Percent * CurrentTime_move_Duration).toFixed(3)
            }
            CurrentTime_move_vw = -1
            refs.bc.removeEventListener('mousemove', setCurrentTime_Move)
            refs.hover_time = 0

        }

        let volume = computed(() => {
            return store.state.eventbus.volume
        })
        watch(volume, (newV) => {
            refs.audio.volume = newV
        })

        let eventbus_play_pause = computed(() => store.state.eventbus.play_pause)
        watch(eventbus_play_pause, (newV) => {
            if (!newV) {
                play_index = 0
                play_pause()
            }
        })


        let refs = reactive({
            // 类似当前body
            bc: null,
            // 背景图片
            bcImg: null,
            // 背景图片src
            bcImg_path: require("./images/bc.jpg"),
            // header List列表
            headerMusicList: null,
            music_active_index,
            // 歌单详情显示
            showAlbum_songList: false,
            // 歌单详情的歌手,名称等信息index
            Album_songIndex: 0,
            songList: null,
            album_songList: null,
            // music 播放中间
            audio_play_bc: null,
            album_musicList: [],
            zoomIn: 0,
            cover_title_name: '',
            cover_title_singer: '',
            time_start: '00:00',
            time_end: '00:00',
            time: null,
            audio: null,
            audio_src: '',
            play_css: 0,
            album_active_id: -1,
            // 控制已经走过进度条
            progressBar: 0,
            hover_time: 0,
            Click_active: -1,
            AddMsg: null

        })
        return {
            ...toRefs(refs),
            header_musicList,
            list_click_play,
            showHeaderMusicList,
            del_list,
            albumList,
            album_index,
            album_musicListFilter,
            closeAlbum_songList,
            add_MusicList,
            play_AlbumMusic,
            songListZoom,
            setComplete,
            audioEnded,
            next_music,
            last_music,
            play_pause,
            watchMusicTime,
            setCurrentTime,
            setCurrentTime_Move,
            clear_move,
        }
    }
}
</script>

<style scoped lang="less">
.bc {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    overflow: hidden;

    .bcImg {
        position: fixed;
        left: 0;
        top: 0;
        width: 111%;
        height: 111%;
        object-fit: cover;
        z-index: -1;
        filter: blur(10px);
    }

    // 滚动条宽度
    .headerMusicList::-webkit-scrollbar {
        width: 7px;
    }

    // 滚动条颜色
    .headerMusicList::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: rgba(200, 200, 200, 0.9);
    }

    // 滚动处背景
    .headerMusicList::-webkit-scrollbar-track {
        border-radius: 0;
        background: rgba(245, 241, 241, 0.4);
    }

    .headerMusicList {
        display: block;
        position: absolute;
        top: -150%;
        left: 10.3vw;
        padding: .5vw 0;
        box-sizing: border-box;
        background-color: #fff;
        width: 18vw;
        height: 30vw;
        border-radius: 5px;
        overflow-x: hidden;
        overflow-y: scroll;
        opacity: 0;
        z-index: 2;
        transition: all .5s;
        box-shadow: 0 0 3px 1px rgb(210, 210, 210);

        p {
            padding-left: 1.25vw;
            font-size: .95vw;
            font-weight: 700;
        }

        i {
            font-style: normal;
            padding-left: 1.25vw;
            font-size: .65vw;
            color: gray;
        }

        hr {
            width: 87%;
            background-color: rgb(207, 188, 188);
            border: 0;
            height: 1px;
            margin: .5vw auto .2vw auto;
        }

        ul {
            padding: 0;
            font-size: .75vw;

            li {
                padding: 0 .1vw 0 .1vw;
                height: 1.8vw;
                line-height: 1.8vw;
                overflow: hidden;

                span {
                    display: inline-block;
                    vertical-align: middle;
                    height: 1.8vw;
                    line-height: 1.8vw;

                    i {
                        padding-left: 0;
                    }
                }

                span:nth-child(1) {
                    text-align: center;
                    width: 8%;

                    .el-icon {
                        vertical-align: middle;
                        color: rgb(0, 217, 255);
                        padding: 0;
                        text-align: left;
                        font-size: .6vw;
                    }
                }

                span:nth-child(2) {
                    width: 52%;

                    i {
                        color: rgb(80, 80, 80);
                        font-size: .75vw;
                        box-sizing: border-box;
                        padding-right: .35vw;
                        overflow: hidden;
                        -webkit-line-clamp: 1;
                        word-break: break-all;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                    }

                }

                span:nth-child(3) {
                    text-align: center;
                    width: 20%;

                    i {
                        font-size: .6vw;
                        color: rgb(110, 110, 110);
                        overflow: hidden;
                        -webkit-line-clamp: 1;
                        word-break: break-all;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                    }
                }

                span:nth-child(4) {
                    text-align: center;
                    font-size: .5vw;
                    color: rgb(180, 180, 180);
                    width: 15.5%;

                    i {
                        font-size: .5vw;
                        color: rgb(180, 180, 180);
                    }
                }

                span:nth-child(5) {
                    text-align: left;
                    width: 4.5%;
                    opacity: 0;
                    transition: all .15s;

                    .el-icon {
                        vertical-align: middle;
                        padding: 0;
                        text-align: left;
                        font-size: .65vw;
                    }
                }

                span:nth-child(5):hover {
                    transform: scale(1.5, 1.5) !important;

                    .el-icon {
                        color: rgb(105, 105, 105) !important;
                    }
                }

                cursor: pointer;
            }

            .li_list_active {
                span:nth-child(n+2):nth-child(-n+3) {
                    i {
                        color: rgb(0, 172, 230);
                    }

                }
            }

            li:nth-child(2n) {
                background-color: rgb(245, 245, 245);
            }

            li:hover {
                background-color: rgb(225, 225, 225);

                span:nth-child(4) {
                    color: rgb(110, 110, 110);
                }

                span:nth-child(5) {
                    opacity: 1;

                    .el-icon {
                        color: rgb(170, 170, 170);
                    }

                }
            }
        }
    }

    .headerMusicList::-webkit-scrollbar-thumb:active {
        background: rgb(130, 130, 130);
    }

    .icon-List-1 {
        position: absolute;
        left: 11.5vw;
        top: 1.8vw;
        padding: .1vw;
        font-size: 2.7vw;
        color: #fff !important;
        cursor: pointer;
        transition: all .2s;
        background-color: rgba(77, 75, 75, .7);
        border-radius: 6px;
        z-index: 2;
    }

    .icon-List-1:hover {
        transform: scale(1.15, 1.15);
    }

    .songList {
        margin: 6vw 0 3vw 11.5vw;
        padding: 1.3vw 3vw;
        width: 85vw;
        min-height: 80vh;
        text-align: left;
        border-radius: 6px;
        overflow: hidden;
        max-height: 999vh;
        box-sizing: border-box;
        background-color: rgba(245, 245, 245, .75);
        box-shadow: 0 0 3px 1px rgb(117, 120, 121);
        transition-timing-function: ease-in-out;
        transition: all .5s;

        p {
            font-size: 2vw;
            font-weight: 700;
            color: rgb(39, 37, 37);
        }

        .content {
            display: flex;
            padding-top: 1vw;
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;

            .album {
                width: 18%;
                height: 17vw;
                margin: 0 0 2vw 0;
                transition: all .2s;
                cursor: pointer;

                p {
                    font-weight: normal;
                    display: block;
                    font-size: .85vw;
                    width: 100%;
                    overflow: hidden;
                    -webkit-line-clamp: 3;
                    word-break: break-all;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                }

                img {
                    object-fit: cover;
                    width: 100%;
                    height: 85%;
                    border-radius: 6px;
                    box-shadow: 0 0 3px 1px rgb(210, 210, 210);
                }
            }

            .album:hover {
                transform: scale(1.1, 1.1);
            }
        }

    }

    // 滚动条宽度
    .album_songList::-webkit-scrollbar {
        width: 7px;
    }

    // 滚动条颜色
    .album_songList::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: rgba(200, 200, 200, 0.9);
    }

    // 滚动处背景
    .album_songList::-webkit-scrollbar-track {
        border-radius: 0;
        background: rgba(245, 241, 241, 0.4);
    }

    .album_songList {
        position: absolute;
        padding: 2.5vw 3vw;
        overflow-x: hidden;
        overflow-y: scroll;
        box-sizing: border-box;
        border-radius: 6px;
        left: 11.5vw;
        top: 6vw;
        width: 85vw;
        height: 80vh;
        opacity: .85;
        background-color: rgb(235, 235, 235);
        transition-timing-function: linear;
        transition: all .4s;

        .cover_album {
            display: flex;
            margin: 0 auto;
            height: 12vw;
            padding-left: 2vw;

            img {
                margin: 0 auto;
                flex: 1;
                height: 100%;
                margin-left: 1vw;
                object-fit: cover;
                border-radius: 6px;
            }

            p {
                flex: 5;
                box-sizing: border-box;
                padding-top: 1vw;
                padding-left: 1.5vw;
                font-size: 1.1vw;

                strong {
                    display: inline-block;
                    width: 70%;
                    overflow: hidden;
                    -webkit-line-clamp: 1;
                    word-break: break-all;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;

                }
            }

            i {
                font-style: normal;
                font-size: .9vw;
                color: rgb(68, 73, 75);

            }
        }

        .album_musicList {
            margin-top: .5vw;
            overflow: hidden;

            table {
                width: 100%;
                table-layout: fixed;

                thead {
                    tr {
                        th {
                            font-size: .8vw;
                            font-weight: normal;
                            color: rgb(49, 46, 46);
                            height: 1.8vw;
                        }

                        th:nth-child(1) {
                            width: 3%;
                            font-size: .7vw;
                        }

                        th:nth-child(2) {
                            width: 44%;
                        }

                        th:nth-child(3) {
                            width: 14%;
                        }

                        th:nth-child(4) {
                            width: 27%;
                        }

                        th:nth-child(5) {
                            width: 9%;
                        }

                        th:nth-child(6) {
                            width: 2.5%;
                            text-align: left;
                        }
                    }
                }

                tbody {
                    tr {
                        height: 1.55vw;
                        font-size: .74vw;
                        border-radius: 1px;

                        td {
                            padding-right: 1vw;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;

                            .icon-triangle {
                                color: #08c5ff !important;
                            }

                            i {
                                font-style: normal;
                                font-size: .7vw;

                            }
                        }

                        td:nth-child(1) {
                            text-align: center;
                            color: rgb(172, 172, 172);
                        }

                        td:nth-child(n+3):nth-child(-n+4) {
                            color: rgb(90, 90, 90);
                        }

                        td:nth-child(5) {
                            color: rgb(160, 160, 160);
                        }

                        td:nth-child(6) {
                            color: rgb(150, 150, 150);
                            cursor: pointer;
                            text-align: left;
                            padding-right: 0;

                            i {
                                transition: all .2s;
                            }
                        }

                        td:nth-child(6):hover {
                            i {
                                font-weight: 700;
                                font-size: .8vw;
                                color: rgb(120, 120, 120);
                            }
                        }



                    }

                    tr:nth-child(2n-1) {
                        background-color: rgb(230, 230, 230)
                    }

                    tr:hover {
                        background-color: rgb(220, 220, 220);
                    }

                    .Click_musicList_active {
                        background-color: rgb(215, 215, 215) !important;
                    }
                }

            }

            .album_musicList_active {
                color: #00a4d6;
            }
        }
    }

    .album_songList_close {
        display: block;
        position: fixed;
        border-radius: 25%;
        // z-index: 1;
        top: 6.9vw;
        left: 12.4vw;
        width: 1.8vw;
        height: 1.8vw;
        background-color: rgba(80, 80, 80, .1);
        cursor: pointer;
        transition: all .2s;

        .el-icon {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.15vw;
            transition: all .2s;
        }
    }

    .album_songList_close:hover {
        background-color: rgba(90, 83, 83, .6);
        transform: scale(1.1, 1.1);

        .el-icon {
            transform: translate(-50%, -50%);
            color: #fff;
        }
    }

    .songListZoom {
        position: absolute;
        width: 2vw;
        height: 2vw;
        left: 93.5vw;
        top: 6.5vw;
        font-size: 2.8vw;
        z-index: 2;
        cursor: pointer;

        .iconfont {
            position: absolute;
            top: 50%;
            left: 50%;
            color: rgb(180, 180, 180);
            box-shadow: 0 0 3px 1px rgb(210, 210, 210);
            transform: translate(-50%, -50%);
            font-size: 2vw;
            transition: all .2s;
        }
    }

    .songListZoom:hover {
        .iconfont {
            color: rgb(130, 130, 130);
            transform: scale(1.1, 1.1) translate(-45%, -45%);
        }
    }

    .audio_play {
        position: absolute;
        z-index: 1;
        margin-left: 9.5vw;
        width: 90.5vw;
        height: 100vh;

        .cover_title {
            position: absolute;
            left: 50%;
            top: 43%;
            transform: translate(-50%, -50%);
            height: 24vw;
            text-align: center;
            width: 100%;
            overflow: hidden;

            img {
                box-shadow: 0 0 3px 1px rgb(220, 220, 220);
                width: 16vw;
                height: 16vw;
                border-radius: 50%;
                object-fit: cover;
            }

            p {
                text-shadow: -1px 1px 0 rgb(125, 125, 125), 1px 1px 0 rgb(125, 125, 125), 1px -1px 0 rgb(125, 125, 125), -1px -1px 0 rgb(125, 125, 125);
                color: aliceblue;
            }

            p:nth-child(2) {
                padding-top: 1.8vw;
                font-size: 2.1vw;
            }

            p:nth-child(3) {
                padding-top: 0.8vw;
                font-size: 1.05vw;
            }
        }

        .audio_part {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 10vw;
            background-color: rgba(80, 80, 80, .25);
            text-align: center;
            overflow: hidden;

            .audio_part_span {
                display: inline-block;
                width: 3vw;
                height: 3vw;
                line-height: 3vw;
                text-align: center;
                transition: all .2s;
                overflow: hidden;
                cursor: pointer;

                .iconfont {
                    transition: all .1s;
                    font-size: 2vw;
                    color: rgb(235, 235, 235);
                }
            }

            .audio_part_span:hover {
                transform: scale(1.2, 1.2);
            }

            .audio_part_span:nth-child(2) {
                overflow: hidden;
                background-color: rgba(160, 160, 160, .4);
                border-radius: 50%;
                width: 3.5vw;
                height: 3.5vw;
                line-height: 3.5vw;
                margin: 1.8vw 3vw 0 3vw;

                .iconfont {
                    display: block;
                    font-size: 3vw;
                    transition: all .15s;

                }
            }

            .time {
                position: absolute;
                // background-color: pink;
                margin-top: 1vw;
                height: 1.5vw;
                left: 50%;
                transform: translateX(-50%);
                width: 55%;
                text-align: center;

                p {
                    position: absolute;
                    top: 50%;
                    font-size: .8vw;
                    color: rgb(70, 70, 70);
                }

                p:nth-child(1) {
                    transform: translate(-120%, -55%);
                }

                span:nth-child(2) {
                    position: absolute;
                    opacity: 0;
                    top: 50%;
                    transform: translate(-15%, -50%);
                    width: .65vw;
                    height: .65vw;
                    border: 2px solid transparent;
                    background-color: rgb(0, 123, 206);
                    border-radius: 50%;
                    z-index: 3;
                }

                span:nth-child(3) {
                    position: absolute;
                    width: 99%;
                    height: .15vw;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: rgb(141, 141, 141);
                    border-radius: 1px;
                }

                span:nth-child(4) {
                    position: absolute;
                    width: 0;
                    height: .15vw;
                    left: 0.5%;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: rgb(16, 128, 202);
                    z-index: 2;
                    border-radius: 1px;
                }

                p:nth-child(5) {
                    right: 0;
                    transform: translate(120%, -55%);
                }
            }

            .time:hover {
                span:nth-child(2) {
                    opacity: 1;
                }

                span:nth-child(3) {
                    height: .22vw;
                }

                span:nth-child(4) {
                    height: .22vw;
                }
            }


        }
    }

    .AddMsg {
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(245, 245, 245, .6);
        box-shadow: 0 0 3px 1px rgb(205, 205, 205);
        color: rgb(100, 100, 100);
        border-radius: 6px;
        text-align: center;
        font-size: .6vw;
        line-height: 1.55vw;
        width: 2.8vw;
        height: 1.55vw;
        opacity: 0;
        transition: opacity .15s;
    }

}
</style>