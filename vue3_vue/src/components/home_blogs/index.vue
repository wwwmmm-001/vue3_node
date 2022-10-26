<template>
    <div>
        <div class="headline" @mousemove="head_slide" @mouseleave="stop_slide">
            <div class="left" @click="changeHead('minus')"></div>
            <div class="right" @click="changeHead('add')"></div>
            <div class="paging" @click="paging_click">
                <span data-index="0">
                    <p data-index="0" :class="{active:paging_active==0}"></p>
                </span>
                <span data-index="1">
                    <p data-index="1" :class="{active:paging_active==1}"></p>
                </span>
                <span data-index="2">
                    <p data-index="2" :class="{active:paging_active==2}"></p>
                </span>
            </div>
            <div ref="head_img_ref" @click="goArticle">
                <div v-for="(img,index) in head_init" :key="index" class="head_part" style="display: none;"
                    :data-index="index" :data-id="img.id">
                    <p> {{img.title}} </p>
                    <a style="display:none">{{img.detail}}</a>
                    <img :src="`/api/blogs/Image?path=${img.path}.png`">
                    <span style="display:none">
                        <el-icon>
                            <Calendar />
                        </el-icon>{{img.CreateTime}}
                    </span>
                </div>

            </div>
            <div class="smallImg" @mousemove="smallImg_move">
                <span v-for="(img,index) in head_init" :key="index" :data-index="index">
                    <img :src="`/api/blogs/Image?path=${img.path}.png`" :class="{smallImg_active:paging_active==index}">
                </span>
            </div>

        </div>
        <div class="notes" @click="goArticle">
            <div class="one">
                <!-- left -->
                <div v-if="blogs_init" v-for="left in blogs_init.left" :key="blogs_init.left.id" :data-id="left.id">
                    <p>{{left.title}}</p>
                    <a>{{left.detail}}</a>
                    <img :src="`/api/blogs/Image?path=${left.path}.png`" class="Textbg">
                    <span>
                        <el-icon>
                            <Calendar />
                        </el-icon>{{left.CreateTime}}
                    </span>
                </div>
            </div>
            <div class="two">
                <!-- right -->
                <div v-if="blogs_init" v-for="right in blogs_init.right" :key="blogs_init.right.id" :data-id="right.id">
                    <p>{{right.title}}</p>
                    <a>{{right.detail}}</a>
                    <img :src="`/api/blogs/Image?path=${right.path}.png`" alt="" class="Textbg">
                    <span>
                        <el-icon>
                            <Calendar />
                        </el-icon>{{right.CreateTime}}
                    </span>
                </div>
            </div>
        </div>
        <span class="loading-finish" ref="loading">--- 加载中 ---</span>
        <span class="loading-finish" ref="finish">--- 没有更多了哦 ---</span>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted, onUnmounted, computed, inject, watch, ref, reactive, toRefs, nextTick } from 'vue'
import { useRouter } from 'vue-router'


export default {
    name: 'MyHomeBlogs',
    setup() {
        let refs = reactive({
            loading: null, // 加载
            finish: null, // 没有数据存在
            head_img_ref: null, // 公告处图片父div
        })

        const store = useStore()
        let pageY = inject('pageY')
        const blogs_init = computed(() => {
            return store.state.blogs.blogsInit
        })
        const head_init = computed(() => {
            return store.state.blogs.blogsInit.head
        })
        const head_init_display = watch(head_init, () => {
            nextTick(() => {
                refs.head_img_ref.children[0].style.display = 'block'
                head_children = refs.head_img_ref.children
            })
            head_init_display()
        })

        let timer_head_slide = 0
        onMounted(() => {
            // blogs初始化
            store.dispatch('blogs/GetBlogsInit')
            refs.loading.style.display = 'block'

            timer_head_slide = setInterval(() => {
                changeHead('add')
            }, 4500)

        })
        onUnmounted(() => {
            clearInterval(timer_head_slide)
            timer_head_slide = null
        })

        let timer_slide_in_out = 0
        function head_slide() {
            if (timer_slide_in_out) return
            timer_slide_in_out = 1
            clearInterval(timer_head_slide)
            timer_head_slide = null
        }
        function stop_slide() {
            timer_slide_in_out = 0
            clearInterval(timer_head_slide)
            timer_head_slide = setInterval(() => {
                changeHead('add')
            }, 4500)
        }


        // 节流 防止watch 重复发出请求
        let timer = 0
        // 停止监视 
        const stopWatchgetBlogs = watch(pageY, async (newValue) => {
            // "body高度-浏览器高度:"+(document.body.clientHeight-window.innerHeight)
            // "当前窗口的高度:"+newValue
            if (document.body.clientHeight - window.innerHeight - newValue < 200 && timer == 0) {
                timer = 1
                if (!blogs_init.value.page) { timer = 0 }
                else {
                    refs.loading.style.display = 'block'
                    await store.dispatch('blogs/GetBlogs', blogs_init.value.page)
                    refs.loading.style.display = 'none'
                    timer = 0
                    if (store.state.blogs.isNull == 1) {
                        refs.finish.style.display = 'block'
                        store.dispatch('blogs/clear')
                        stopWatchgetBlogs()
                        timer = null
                    }
                }

            }
        })
        const router = useRouter()
        function goArticle(e) {
            if (e.target.parentNode.children[0].nodeName == 'P') {
                let newUrl = router.resolve({
                    path: `/article`,
                    query: {
                        id: e.target.parentNode.getAttribute('data-id'),
                        title: e.target.parentNode.children[0].innerText,
                        detail: e.target.parentNode.children[1].innerText,
                        time: e.target.parentNode.children[3].innerText
                    },
                })
                window.open(newUrl.href, "_blank");
            }
        }

        let head_children = 0
        function changeHead(go_index) {
            let go = 0
            if (go_index == 'add') go = 1
            else if (go_index == 'minus') go = -1

            for (let i = 0; i < head_children.length; i++) {
                if (head_children[i].style.display == 'block') {
                    go == 0 ? go = go_index - i : go
                    if (go == 0) return
                    head_children[i].style.display = 'none'
                    let index = Number(head_children[i].getAttribute('data-index'))
                    index = index + go
                    if (index > 2) index = 0
                    else if (index < 0) index = 2
                    paging_active.value = index
                    head_children[index].style.display = 'block'
                    break
                }
            }
        }
        let paging_active = ref(0)
        function paging_click(e) {

            let index = Number(e.target.getAttribute('data-index'))
            if (index != null) {
                paging_active.value = index
                changeHead(index)
            }



        }
        let timer_move = 0
        function smallImg_move(e) {
            if (timer_move) return
            let index = e.target.parentNode.getAttribute('data-index')
            if (index == null) return
            index = Number(index)
            timer_move = setTimeout(() => {
                paging_active.value = index
                changeHead(index)
                timer_move = null
            }, 80)

        }


        return {
            // 博客文章初始化
            blogs_init,
            // 顶部公告部分
            head_init,
            goArticle,
            // 更换顶部轮播图
            changeHead,
            paging_click,
            paging_active,
            smallImg_move,
            ...toRefs(refs),
            head_slide,
            stop_slide
        }
    }
}
</script>

<style lang="less" scoped>
.headline {
    position: relative;
    border-radius: 10px;
    width: 100%;
    height: 20vw;
    overflow: hidden;

    .head_part {
        transition: all .2s;
        animation: part_init .8s;
        height: 20vw;
        p {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
            font-size: 2vw;
            color: #dde8e9;
            text-shadow: -0.5px 0.5px 0.5px #000, 0.5px 0.5px 0.5px #000, 0.5px -0.5px 0.5px #000, -0.5px -0.5px 0.5px #000;

        }

        img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: all .5s;
        }

    }

    .smallImg {
        display: flex;
        justify-content: space-between;
        position: absolute;
        width: 30%;
        height: 15%;
        z-index: 5;
        bottom: 2%;
        right: 2%;

        span {
            display: inline-block;
            width: 30%;
            height: 100%;
        }

        img {
            box-shadow: 0 0 1px 1px rgb(151, 131, 131);
            border-radius: 8px;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .smallImg_active {
        transform: scale(1.1, 1.1);
        animation: smallImg_animetion .1s;
    }

    @keyframes smallImg_animetion {
        from {
            transform: scale(1, 1);
        }

        to {
            transform: scale(1.1, 1.1);
        }
    }

    @keyframes part_init {
        from {
            transform: scale(1.2, 1.2);
        }

        to {
            transform: scale(1, 1);
        }

    }

    .left {
        opacity: 0;
        position: absolute;
        left: 0;
        top: 37.2%;
        width: 4vw;
        height: 4vw;
        background-color: #fff;
        cursor: pointer;
        transform: rotate(45deg);
        transform-origin: left top;
        z-index: 9;
        transition: all .15s;
    }

    .right {
        opacity: 0;
        position: absolute;
        width: 4vw;
        height: 4vw;
        top: 45.5%;
        right: 0;
        background-color: #fff;
        cursor: pointer;
        transform: rotate(45deg);
        transform-origin: right bottom;
        z-index: 9;
        transition: all .15s;
    }

    .paging {
        display: flex;
        justify-content: space-around;
        position: absolute;
        width: 8vw;
        height: 1.35vw;
        bottom: 2%;
        left: 50%;
        z-index: 2;
        transform: translateX(-50%);        
        span {
            box-sizing: border-box;
            padding: .9vw 0;        
        }
        span:hover{
            cursor: pointer;
        }
        p {
            width: 2.2vw;
            height: .15vw;
            background-color: rgb(170, 155, 155);
        }

        .active {
            background-color: white;
        }
    }

    .left:hover {
        background-color: rgb(133, 137, 137);
    }

    .right:hover {
        background-color: rgb(133, 137, 137);
    }
}

.headline:hover .left {
    opacity: .8;
}

.headline:hover .right {
    opacity: .8;
}


.notes {
    margin-top: 1vw;
    width: 100%;
    display: flex;
    justify-content: center;

    .one,
    .two {
        flex: 1;
        text-align: center;

        div {
            position: relative;
            overflow: hidden;
            // transition: all .5s;
            animation: TestStart .89s;

            span {
                position: absolute;
                left: 50%;
                bottom: 0vw;
                transform: translateX(-50%);
                width: 102%;
                font-size: .8vw;
                border-radius: 0 0 10px 10px;
                background-color: #dde8e9;
                // vertical-align: middle;
            }

            .el-icon {
                font-size: .8vw;
                padding-right: .18vw;
                vertical-align: -10%;
            }

            p {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.5vw;
                color: white;
                transition: all .4s;
                text-shadow: -0.5px 0.5px 1.2px #000, 0.5px 0.5px 1.2px #000, 0.5px -0.5px 1.2px #000, -0.5px -0.5px 1.2px #000;
            }

            a {
                position: absolute;
                width: 70%;
                opacity: 0;
                left: 50%;
                top: 30%;
                font-size: .9vw;
                text-shadow: -.8px .8px 1px #fff, .8px .8px 1px #fff, .8px -.8px 1px #fff, -.8px -.8px 1px #fff;
                transform: translate(-50%, -50%);
                transition: all .4s;
            }
        }

        div:hover p {
            top: 70%;
            opacity: 0;
        }

        div:hover a {
            top: 50%;
            opacity: 1;
        }

        .Textbg {
            border-radius: 8px;
            width: 100%;
            background-size: cover;
            background-repeat: no-repeat;
        }

        .Textbg:hover {
            cursor: pointer;
        }
    }

    .one {
        div {
            margin-bottom: .8vw;
            margin-right: .45vw;
            box-shadow: 0 0 1px 1px rgb(95, 95, 95);
            border-radius: 9px;
        }
    }

    .two {
        div {
            margin-bottom: .8vw;
            margin-left: .45vw;
            box-shadow: 0 0 1px 1px rgb(95, 95, 95);
            border-radius: 9px;
        }
    }

    @keyframes TestStart {
        from {
            opacity: .5;
            transform: scale(.2, .2);
        }

        to {
            opacity: 1;
            transform: scale(1, 1);
        }
    }
}

.loading-finish {
    display: none;
    margin-top: 3vw;
    font-size: .72vw;
    color: darkslategray;
    text-align: center;
}
</style>