<template>
    <div class="anime">
        <span class="title">{{props.show}}
            <hr>
        </span>
        <div class="classify_time_type" v-if="props.show == 'Anime'"><strong>类型&nbsp;</strong>
            <el-icon>
                <ArrowRight />
            </el-icon>
            <div class="time_type">
                <table>
                    <tr @click="filter_time_type">
                        <th style="color: #00a1d6;">全部</th>
                        <th>TV</th>

                    </tr>
                    <tr @click="filter_time_type">
                        <th>OVA</th>
                        <th>剧场版</th>
                    </tr>
                </table>
            </div>
        </div>
        <!-- 类型借用time筛选样式方法 -->
        <div class="classify_time_type" v-if="props.show == 'Anime'"><strong>时间&nbsp;</strong>
            <el-icon>
                <ArrowRight />
            </el-icon>
            <div class="time_type">
                <table>
                    <tr @click="filter_time_type">
                        <th style="color: #00a1d6;">全部</th>
                        <th>2022</th>
                        <th>2021</th>
                        <th>2020</th>
                        <th>2019</th>
                    </tr>
                    <tr @click="filter_time_type">
                        <th>2018</th>
                        <th>2017</th>
                        <th>2016</th>
                        <th>2015</th>
                        <th>2014-2009</th>
                    </tr>
                </table>
            </div>
        </div>
        <div class="banner" v-if="anime_data">
            <span class="left" @click="anime_left">
                <el-icon>
                    <ArrowLeft />
                </el-icon>
            </span>
            <span class="right" @click="anime_right">
                <el-icon>
                    <ArrowRight />
                </el-icon>
            </span>
            <div class="loading_none" ref="load_none"></div>
            <div ref="contents" v-if="display_template == 2">
                <div class="content" v-for="(anime,index) in anime_data" :key="index" data-show="false">
                    <a class="animation" v-for="(data) in anime" :key="data.id" :href="data.url" target="_blank">
                        <div class="img">
                            <img v-lazy="`${img_path}${data.path}.jpg`">
                        </div>
                        <div class="detail">
                            <i>{{data.id}}</i>
                            <span>
                                <p>{{data.name}}</p>
                            </span>
                        </div>
                    </a>
                </div>
            </div>

            <div ref="contents" v-if="display_template == 1">
                <div class="content" v-for="(anime,index) in anime_data" :key="index">
                    <a class="animation" v-for="(data) in anime" :key="data.id" @click="show_detail(data.id)"
                        target="_blank">
                        <div class="img">
                            <img v-lazy="`/api/Look/animeImg?path=${data.path}.jpg`">
                        </div>
                        <div class="detail">
                            <i>{{data.id}}</i>
                            <span>
                                <p>{{data.name[0]}}</p>
                                <p>{{data.name[1]}}</p>
                            </span>
                        </div>
                        <div class="label">
                            <span>{{data.label[0]}}</span>
                            <span>{{data.label[1]}}</span>
                            <span>{{data.label[2]}}</span>
                        </div>
                    </a>

                </div>
                <div class="searchAll"><span @click="showAll">查看全部></span></div>
            </div>

        </div>
    </div>
    <div class="show_detail" v-show="d_show" ref="show_detailref">
        <div class="animation">
            <el-icon class="close" @click="close_show_detail">
                <Close />
            </el-icon>
            <div class="head">
                <div class="d_img"><img v-lazy="d_src" alt=""></div>
                <div class="introduce">
                    <ul>
                        <li class="title">{{d_name}}</li>
                        <li class="time">
                            <span>发行日期</span>
                            <p>{{d_fullTime}}</p>
                        </li>
                        <li class="label" v-show="d_label[0].length>1">
                            <span>{{d_label[0]}}</span><span>{{d_label[1]}}</span><span>{{d_label[2]}}</span>
                        </li>
                        <li class="detail">{{d_detail}}</li>
                        <li class="look"><a :href="d_url" target="_blank">Look</a></li>
                    </ul>
                </div>
            </div>
            <div class="people">
                <div class="left">
                    <div v-for="(i,index) in d_img.left" :key="index">
                        <img v-lazy='i' alt="">
                    </div>
                </div>
                <div class=middle>
                    <div v-for="(i,index) in d_img.middle" :key="index+3">
                        <img v-lazy='i' alt="">
                    </div>
                </div>
                <div class="right">
                    <div v-for="(i,index) in d_img.right" :key="index+6">
                        <img v-lazy='i' alt="">
                    </div>
                </div>


            </div>
        </div>

    </div>
</template>

<script>
import { onMounted, onUnmounted, computed, nextTick, props, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import {Move,stopMove} from '@/assets/js/Move_stop'
import goUp from '@/assets/js/goUp_Down'
export default {
    name: 'MyAnime',
    props: ['show'],
    setup(props) {
        const store = useStore()

        onMounted(() => {
            setLoadNone(1)
            if (props.show == 'Anime') {
                getlook(filterArr).then(() => {
                    setLoadNone(0, 1)
                })
            } else {
                getlook().then(() => {
                    setLoadNone(0, 1)
                })
            }


        })

        // 用于anime提示信息, 加载中 or 无数据
        function setLoadNone(decision, close = 0) {
            if (decision) {
                refs.load_none.innerText = '加载中...'
            } else {
                if (close) return refs.load_none.style.display = 'none'
                refs.load_none.innerText = '暂时没有此方面相关的数据哦'
            }
            refs.load_none.style.display = 'block'
        }

        let img_path = null
        // if判断 anime video eiga
        // 发出 getLook请求
        // 点击时间 进行筛选
        let getlook = null
        let filterArr = ['*', '*']
        let filter_time_type = null
        if (props.show == 'Anime') {
            getlook = async (val) => {
                await store.dispatch('look/GetLookAnime', val)
            }
            filter_time_type = (e) => {
                // 遍历去除 style.color='#524f4f'
                let tr_children = e.target.parentNode.parentNode.children
                for (let i = 0; i < tr_children.length; i++) {
                    let th_children = tr_children[i].children
                    for (let j = 0; j < th_children.length; j++) {
                        th_children[j].style.color = '#524f4f'
                    }
                }
                // 上色
                e.target.style.color = '#00a1d6'
                // left right图标 none
                refs.contents.parentNode.children[1].style.display = 'none'
                refs.contents.parentNode.children[0].style.display = 'none'

                // anime内容显示区 none
                refs.contents.style.display = 'none'

                setLoadNone(1)

                let search = e.target.innerText;
                search == '全部' ? search = '*' : search
                search == '剧场版' ? search = 'movie' : search

                tr_children[0].children.length > 2 ? filterArr[1] = search : filterArr[0] = search
                getlook(filterArr).then(() => {
                    setLoadNone(0, 1)
                    refs.contents.style.display = 'block'
                    // 判断是否处于查看全部
                    if (isShowAll) {
                        isShowAll = 0
                        showAll()
                    }
                    if (store.state.look.anime.length == 0) {
                        setLoadNone(0)
                    }
                })
            }
        } else if (props.show == 'Video') {
            img_path = '/api/Look/videoImg?path='
            getlook = async () => {
                await store.dispatch(`look/GetLookVideo`)
            }
        } else {
            img_path = '/api/Look/eigaImg?path='
            getlook = async () => {
                await store.dispatch(`look/GetLookEiga`)
            }
        }

        let anime_data = null

        function init_data(val) {
            anime_data = computed(() => {
                nextTick(() => {
                    // content元素长度
                    contents_len = refs.contents.children.length
                    props.show == 'Anime' ? contents_len -= 1 : contents_len
                    content_c = refs.contents.children // content 元素
                    // left right 图标 
                    left_right = refs.contents.parentNode.children
                })
                return data_split(store.state.look[`${val}`])
            })

        }
        let display_template = 1
        switch (props.show) {
            case 'Anime': init_data('anime'); break;
            case 'Video': init_data('video'); display_template = 2; break;
            case '映画': init_data('eiga'); display_template = 2; break;
        }

        // 分割anime_data 6个为一块
        function data_split(data) {
            let num = 0
            let anime_temp = []
            let anime = []
            data.forEach((val) => {
                anime_temp.push(val)
                num++
                if (num == 6) {
                    num = 0
                    anime.push(anime_temp)
                    anime_temp = []
                }
            })
            // 判断并删除上一次存在时占位元素div
            nextTick(() => {
                //  第一个if 判断anime是否存在内容并显示right图标
                if (contents_len > 1) {                    
                    left_right[1].style.display = 'block'
                    content_c[0].style.display = 'flex'
                }
                else if(contents_len == 1){
                    content_c[0].style.display = 'flex'
                }
                
                remove_flexTemp()
            })
            if (anime_temp.length != 0) {
                nextTick(() => {
                    content_c[contents_len - 1].appendChild(el)
                })
                let flex = 6 - anime_temp.length;
                let el = document.createElement('div')
                let left = flex > 1 ? flex + 1 : flex
                el.setAttribute('style', `display:flex;flex:${flex};margin-left:${left * 0.7}vw`)
                anime.push(anime_temp)
            }
            if (anime.length <= 1) {
                nextTick(() => {
                    left_right[0].style.display = 'none'
                    left_right[1].style.display = 'none'
                })
            }
            return anime
        }

        function remove_flexTemp() {
            for (let i = 0; i < contents_len; i++) {
                if (content_c[i].lastElementChild.nodeName == 'DIV') {
                    content_c[i].removeChild(content_c[i].lastElementChild)
                }
            }

        }
        let contents_len = 0  // 展示anime元素总长度
        let content_c // anime content元素

        // 左右图标
        let left_right = 0
        // 点击left切换
        // 根据foreach遍历 data-show判断 展示元素
        function anime_left() {
            for (let i = 0; i < contents_len; i++) {
                if (content_c[i].style.display == 'flex') {
                    if (i != 0) {
                        // right图标
                        left_right[1].style.display = 'block'
                        // 当前content none 上一个flex
                        content_c[i].style.display = 'none'
                        content_c[i - 1].style.display = 'flex'
                        // 判断下一页是否是最后 right图标,(i当前页+1 下一页 contents_len长度-1表下标)
                        if (i - 1 == 0) {
                            left_right[0].style.display = 'none'
                        }
                        break
                    }
                }
            }
        }
        // 点击right切换
        // 根据foreach遍历 data-show判断 展示元素
        function anime_right() {
            for (let i = 0; i < contents_len; i++) {
                if (content_c[i].style.display == 'flex') {
                    if (i + 1 != contents_len) {
                        // left图标
                        left_right[0].style.display = 'block'
                        // 当前content none 下一个flex
                        content_c[i].style.display = 'none'
                        content_c[i + 1].style.display = 'flex'
                        // 判断下一页是否是最后 right图标,(i当前页+1 下一页 contents_len长度-1表下标)
                        if (i + 2 == contents_len) {
                            left_right[1].style.display = 'none'
                        }
                        break
                    }
                }
            }
        }

        let isShowAll = 0 // 记录是否查看全部 0 no 1 yes
        function showAll() {
            if (!isShowAll) {
                for (let i = 0; i < contents_len; i++) {
                    content_c[i].setAttribute('data-show', 'false')
                    content_c[i].style.display = 'flex'
                }

                left_right[0].style.display = 'none'
                left_right[1].style.display = 'none'

                isShowAll = 1
                goUp((window.innerHeight / 100) * 85)
                content_c[contents_len].children[0].innerText = '<收回'

            } else {
                for (let i = 1; i < contents_len; i++) {
                    content_c[i].style.display = 'none'
                }
                contents_len > 1 ? left_right[1].style.display = 'block' : false
                isShowAll = 0
                goUp((window.innerHeight / 100) * 85)
                content_c[contents_len].children[0].innerText = '查看全部>'
            }


        }

        let refs = reactive({
            load_none: null,
            contents: null,
            // show detail
            show_detailref: null,
        })


        let detail = reactive({
            d_name: '',
            d_fullTime: '',
            d_label: ['', '', ''],
            d_detail: "",
            d_src: '',
            d_id: '',
            d_url: '',
            d_img: { left: [], middle: [], right: [] },
            d_show: 0
        })

        async function show_detail(id) {
            detail.d_show = 1
            stopMove()
            await store.dispatch('look/GetLookAnimeDetail', id)
            let data = store.state.look.detail.content
            let img_path_temp = store.state.look.detail.img_path
            let push_index = 1
            if(!img_path_temp.length) return
            for (let i = 0; i < img_path_temp.length; i++) {
                if (push_index == 1) detail.d_img.left.push(`/api/Look/animeImg?path=/${data.id}/${img_path_temp[i]}`)
                else if (push_index == 2) detail.d_img.middle.push(`/api/Look/animeImg?path=/${data.id}/${img_path_temp[i]}`)
                else detail.d_img.right.push(`/api/Look/animeImg?path=/${data.id}/${img_path_temp[i]}`)
                push_index == 3 ? push_index = 1 : push_index++
            }

            detail.d_name = data.name.split('-=')
            detail.d_name = `${detail.d_name[0]}(${detail.d_name[1]})`
            detail.d_label = data.label.split('-=')

            detail.d_url = data.url
            detail.d_fullTime = data.fullTime
            detail.d_detail = data.detail

            refs.show_detailref.style.display = 'block'
            detail.d_src = `/api/Look/animeImg?path=img${id}.jpg`
        }
        function close_show_detail() {
            detail.d_show = 0
            Move()
            detail.d_name = ''
            detail.d_label = ['', '', '']
            detail.d_img = { left: [], middle: [], right: [] }

            detail.d_fullTime = ''
            detail.d_detail = ''

            refs.show_detailref.style.display = 'none'
            detail.d_src = ``
        }
        onUnmounted(()=>{
            Move()
        })

        return {
            anime_left,
            anime_right,
            filter_time_type,
            anime_data,

            props,
            display_template,
            img_path,
            showAll,
            show_detail,
            close_show_detail,
            ...toRefs(detail),
            ...toRefs(refs)
        }
    }
}
</script>

<style lang="less" >
.anime {
    margin-top: 3vw;
    padding: 2vw 9vw;
    height: 110%;
    min-height: 20vw;
    background-color: rgba(238, 225, 225, .5);
    border-radius: 20px;

    .banner {
        position: relative;

        .loading_none {
            display: none;
            color: cadetblue;
            box-sizing: border-box;
            padding-top: 1.5vw;
            padding-left: 1.5vw;
            font-size: .9vw;
            height: 21.2vw;
        }
    }

    .left,
    .right {
        position: absolute;
        background-color: rgba(224, 209, 209, 0.9);
        border-radius: 50%;
        width: 1.4vw;
        height: 1.4vw;
        padding: .55vw;
        font-size: 1vw;
        top: 45%;
        transform: translateY(-50%);
        transition: all .3s;
    }

    .left {
        display: none;
        left: -1.7vw;

    }

    .right {

        right: -1.7vw;

    }

    .left,
    .right {
        z-index: 9;

        .el-icon {
            position: absolute;
            font-weight: 600;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .left:hover {
        transform: translateY(-50%) scale(1.2, 1.2);
    }

    .right:hover {
        transform: translateY(-50%) scale(1.2, 1.2);
    }

    .title {
        font-size: 2.2vw;
        color: rgb(0, 44, 44);
    }

    .classify_time_type {
        margin-top: 1vw;
        border-radius: 10px;
        margin-right: 2vw;
        min-width: 22%;
        display: inline-block;
        padding: .65vw;
        color: rgb(63, 65, 66);

        strong {
            font-size: 1.08vw;
            vertical-align: middle;
        }

        .el-icon {
            vertical-align: middle;
        }

        .time_type {
            margin-top: .45vw;
            font-size: .81vw;
            color: rgb(82, 79, 79);

            th {
                font-weight: normal;
                text-align: left;
                padding: .33vw 0;
                padding-right: .88vw;
            }

            th:hover {
                color: rgb(102, 102, 216);
                cursor: pointer
            }
        }
    }

    .classify_time_type:nth-child(2) {
        background-color: rgb(187, 231, 229);
    }

    .classify_time_type:nth-child(3) {
        background-color: rgb(185, 210, 224);
    }

    .content {
        display: none;
        margin-top: 1.2vw;
        margin-bottom: 1.5vw;
        height: 20vw;
        animation: content_move .5s;
        justify-content: space-between;

        a:nth-child(n+2):nth-child(-n+5) {
            margin: 0 .7vw;
        }

        a:first-child {
            margin-right: .7vw;
        }

        a:last-child {
            margin-left: .7vw;
        }

        a {
            display: block;
            flex: 1;
            background-color: rgba(231, 214, 217, .7);
            border-radius: 15px;
            box-sizing: border-box;
            overflow: hidden;


            .img {
                margin: 0 0;
                height: 81%;
                display: flex;
                justify-content: center;

                img {
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                }
            }

            .detail {
                margin: 0 0;
                display: flex;
                align-items: center;

                i {
                    float: left;
                    font-size: 2.8vw;
                    color: cadetblue;
                    vertical-align: middle;
                }

                span {
                    padding-left: .3vw;
                    vertical-align: middle;
                    float: left;
                    overflow: hidden;

                    p {
                        display: block;
                        font-size: .85vw;
                        width: 100%;
                        overflow: hidden;
                        -webkit-line-clamp: 1;
                        word-break: break-all;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                    }

                    p:nth-child(2) {
                        color: cadetblue;
                    }
                }
            }
        }
    }

    @keyframes content_move {
        from {
            opacity: 0.7;
        }

        to {
            opacity: 1;
        }

    }

    .content:first-child {
        display: flex;
    }

    .animation {
        color: rgb(58, 51, 51);
        transition: all .3s;
        position: relative;
    }

    .animation:hover {
        flex: 2;
        transition-delay: .65s;
    }

    .animation:hover .label {
        opacity: 1;
        transition-delay: .65s;
    }

    .label {
        opacity: 0;
        height: 1.2vw;
        position: absolute;
        font-size: .7vw;
        bottom: 20%;

        span {
            padding: 0 .45vw;
            margin: 0 .5vw;
            color: rgb(248, 244, 244);
            background-color: rgba(82, 77, 77, 0.6);
            border-radius: 6px;
        }
    }

    .searchAll {
        width: 100%;
        padding-top: 1vw;
        text-align: right;
        box-sizing: border-box;
        margin-right: auto;
        display: block !important;

        span {
            cursor: pointer;
            font-size: .8vw;
            transition: all .1s;
        }

        span:hover {
            color: rgb(107, 168, 221);
        }
    }
}



.show_detail {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.44);
    z-index: 200;
    overflow-y: scroll;
    overflow-x: hidden;

    .animation {
        width: 100%;
        height: 100%;
        animation: detail_init .4s;
    }

    .close {
        position: fixed;
        top: 6vw;
        right: 2vw;
        font-size: 2vw;
        background-color: rgba(255, 255, 255, 0);
        padding: .5vw;
        border-radius: 50px;
        color: rgb(235, 235, 235);
        transition: all .3s;
        z-index: 99;
    }

    .close:hover {
        cursor: pointer;
        background-color: rgba(255, 255, 255, .45);
        transform: rotateZ(90deg) scale(1.18, 1.18);
        color: rgb(59, 59, 59);
        padding: .4vw;
    }

    .head {
        position: absolute;
        width: 88vw;
        height: 22vw;
        left: 50%;
        top: 5vw;
        transform: translateX(-50%);
        border-radius: 6px;
        display: flex;
        align-items: center;
        color: white;
        background-color: rgba(95, 90, 90, 0.9);

        .d_img {
            flex: 2;
            text-align: right;
        }

        img {
            object-fit: cover;
            width: 11.5vw;
            height: 16.4vw;
            border-radius: 10px;
            border: 2px solid white;
        }

        .introduce {
            flex: 4;
            height: 18.4vw;
            overflow: hidden;

            .title {
                display: inline-block;
                font-size: 1.25vw;
                line-height: 3vw;
                height: 3vw;
                margin-bottom: .4vw;
            }

            .time {
                width: 5vw;
                box-sizing: border-box;
                font-size: .65vw;
                overflow: hidden;
                border-right: 1px solid white;
                line-height: 1vw;
                margin-bottom: .5vw;

                span {
                    display: inline-block;
                    padding-bottom: .15vw;
                }

                p {
                    font-weight: 700;
                }
            }

            .label {
                height: 2.5vw;

                span {
                    padding: .05vw .2vw;
                    border-radius: 3px;
                    border: 1px solid white;
                    margin-right: .4vw;
                    font-size: .65vw;
                }
            }

            .detail {
                width: 80%;
                font-size: .8vw;
                min-height: 5.5vw;
                max-height: 6vw;
                line-height: 1.2vw;
                margin-bottom: 1vw;
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
            }

            .look {
                width: 12%;
                height: 2.1vw;
                line-height: 2.1vw;
                background-color: rgb(56, 207, 207);
                text-align: center;
                vertical-align: middle;
                border-radius: 8px;
                overflow: hidden;
                a {
                    padding: .5vw 2.1vw;
                    color: aliceblue;
                }
            }
        }

    }

    .people {
        position: absolute;
        width: 88vw;
        left: 50%;
        top: 31vw;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;

        .left,
        .middle,
        .right {
            display: block;
            padding: 0 .7vw;
            width: 20%;

            div {
                margin-bottom: 1vw;
            }

            img {
                border-radius: 10px;
                object-fit: cover;
                width: 100%;
                height: 100%;
            }
        }
    }
}

// 滚动条宽度
.show_detail::-webkit-scrollbar {
    width: 10px;
}

// 滚动条颜色
.show_detail::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(235, 235, 235, 0.85);
}
// 滚动处背景
.show_detail::-webkit-scrollbar-track {
    border-radius: 0;
    background: rgba(0, 0, 0, 0.4);
}
@keyframes detail_init {
    from {
        opacity: 0;
        transform: translateY(10%);
    }

    to {
        transform: translateY(0);
        // background-color: rgba(0, 0, 0, 0.44);
        opacity: 1;
    }
}
</style>