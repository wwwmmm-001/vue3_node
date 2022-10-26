<template>
    <div class="body">
        <div class="bc" :style="{ 'background': 'url(' + require(`${bc}`) + ')' }">
        </div>
        <div class="content copy">
            <p class="title">{{ title }}<b>{{ detail }}</b></p>
            <p class="time">于 {{ time }} 发布</p>
            <div class="ql-container ql-snow">
                <div class="ql-editor" v-html="content">
                </div>
            </div>
        </div>
        <div class="changeBc">
            <button @click="change">更换背景</button>
        </div>
    </div>

</template>

<script>
import { reactive, toRefs, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import 'quill/dist/quill.snow.css'

export default {
    name: 'MyArticle',
    props: ['id'],
    setup() {
        const store = useStore()
        let msg = reactive({
            title: '',
            detail: '',
            time: ''
        })
        let content = computed(() => {
            return store.state.article.content.content
        })
        const router = useRouter()
        document.title = router.currentRoute.value.query.title
        if (router.currentRoute.value.query.id) {
            store.dispatch('article/GetArticle', router.currentRoute.value.query.id)
            msg.title = router.currentRoute.value.query.title
            msg.detail = router.currentRoute.value.query.detail
            msg.time = router.currentRoute.value.query.time
        }

        let bc = ref('./images/img1.jpg')
        let img_index = 2
        // change bc 通过img_index 控制背景图
        function change() {
            bc.value = `./images/img${img_index}.jpg`
            img_index++
            img_index > 4 ? img_index = 1 : img_index
        }

        return { ...toRefs(msg), content, bc, change }
    }

}
</script>
<style lang="less" scoped>
.body {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    padding-top: 1vw;
    .bc {
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-size: cover !important;
        z-index: -1;
    }

    .changeBc {
        position: fixed;
        bottom: 5%;
        right: 3%;

        button {
            outline: 0;
            border: none;
            padding: .25vw .55vw;
            border-radius: 5px;
            background-color: rgba(219, 204, 204, .4);
        }

        button:hover {
            cursor: pointer;
        }
    }

    .content {
        margin: 0 auto;
        padding: 1vw;
        box-sizing: border-box;
        background-color: rgba(245, 243, 243, .9);
        border-radius: 5px;
        width: 70%;
        margin-bottom: 2vw;
        user-select: text;
        -moz-user-select: text;
        -webkit-user-select: text;
        user-select: text;

        .ql-container {
            border: 0;
        }

        .ql-editor {
            min-height: 50vh;
            border: .5px solid rgb(126, 126, 124);
            border-radius: 2px;
        }

        .title {
            font-size: 2.1vw;
            font-weight: 600;

            b {
                font-size: .8vw;
                margin-left: .5vw;
                color: rgb(90, 146, 148);
            }
        }

        .time {
            font-size: .8vw;
            color: cadetblue;
            padding: .4vw 0;
        }
    }
}
</style>