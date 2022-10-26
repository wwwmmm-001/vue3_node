<template>
    <div>
        <div class="lookImgBody" v-if="images">
            <div class="one" @click="showMagnifier">
                <div v-for="(Img,index) in images.left" :key="index" :style="{height:test(Img.size)}" :ref="AddleftRef">
                    <img v-lazy="`/api/lookImg/Image?path=${Img.img}`" :data-index="index">
                </div>
            </div>
            <div class="two" @click="showMagnifier">
                <div v-for="(Img,index) in images.middle" :key="index" :style="{height:test(Img.size) }"
                    :ref="AddmiddleRef">
                    <img v-lazy="`/api/lookImg/Image?path=${Img.img}`" :data-index="index">
                </div>

            </div>
            <div class="three" @click="showMagnifier">
                <div v-for="(Img,index) in images.right" :key="index" :style="{height:test(Img.size)}"
                    :ref="AddrightRef">
                    <img v-lazy="`/api/lookImg/Image?path=${Img.img}`" :data-index="index">
                </div>

            </div>
            <goTop />
        </div>
        <div class="magnifier" ref="magnifier">
            <div class="body">
                <img src="./images/load.gif" ref="load_body" class="load">
                <img src="" ref="magnifier_body">
            </div>

            <div @click="ClickTool">
                <span class="left" data-tool="left">
                    <el-icon data-tool="left">
                        <ArrowLeftBold data-tool="left" />
                    </el-icon>
                </span>
                <span class="right" data-tool="right">
                    <el-icon data-tool="right">
                        <ArrowRightBold data-tool="right" />
                    </el-icon>
                </span>
                <span class="close" data-tool="close">
                    <el-icon data-tool="close">
                        <Close data-tool="close" />
                    </el-icon>
                </span>

            </div>

            <div class="tool" @click="ClickToolBar">
                <el-icon data-tool="zoomIn">
                    <ZoomIn data-tool="zoomIn" />
                </el-icon>
                <el-icon data-tool="zoomOut">
                    <ZoomOut data-tool="zoomOut" />
                </el-icon>
                <el-icon data-tool="left">
                    <ArrowLeft data-tool="left" />
                </el-icon>
                <el-icon data-tool="home">
                    <MostlyCloudy data-tool="home" />
                </el-icon>
                <el-icon data-tool="right">
                    <ArrowRight data-tool="right" />
                </el-icon>
                <el-icon data-tool="rotateRight">
                    <RefreshRight data-tool="rotateRight" />
                </el-icon>
                <el-icon data-tool="rotateLeft">
                    <RefreshLeft data-tool="rotateLeft" />
                </el-icon>
            </div>

            <div class="location">
                {{location}}/{{location_all}}
            </div>
        </div>
    </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import { useStore } from 'vuex';
import { computed, inject, watch, ref,onUnmounted } from 'vue'
import goTop from '@/components/goTop.vue'
import {Move,stopMove} from '@/assets/js/Move_stop'
export default {
    name: 'MyLookImg',
    setup() {
        let images = computed(() => store.state.lookimg.Images)
        let store = useStore()


        // 获取所有img父div节点
        //#region        
        let LeftRef = ref([])
        let AddleftRef = (el) => {
            LeftRef.value.push(el)
        }
        let MiddleRef = ref([])
        let AddmiddleRef = (el) => {
            MiddleRef.value.push(el)
        }
        let RightRef = ref([])
        let AddrightRef = (el) => {
            RightRef.value.push(el)
        }
        //#endregion


        // 监视 computed images  即图片信息
        // 变化后删除最长 的一张图片
        //#region 
        watch(images, () => {
            if (!LeftRef.value[LeftRef.value.length - 1]) { }
            else {
                // 此数组书写为 left - right 最底div 距离浏览器顶部距离
                let arrEl = [LeftRef.value[LeftRef.value.length - 1].offsetTop, MiddleRef.value[MiddleRef.value.length - 1].offsetTop, RightRef.value[RightRef.value.length - 1].offsetTop]

                let max = (Math.max(...arrEl))
                let min = (Math.min(...arrEl))

                if (max - min > 200) {
                    clearImg(max, arrEl)
                }
            }
        }, { deep: true })
        // 封装给 watch(images) 使用
        function clearImg(max, arr) {
            let res = ['left', 'middle', 'right']
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == max) {
                    LeftRef = ref([])
                    MiddleRef = ref([])
                    RightRef = ref([])
                    store.commit('lookimg/REMOVEELEMENT', res[i])
                    return false
                }
            }
        }
        // #endregion


        let pageY = inject('pageY')
        // 监视pageY 发起图片请求
        watch(pageY, (newValue) => {
            if (document.body.clientHeight - window.innerHeight - newValue < 200) {
                store.dispatch('lookimg/GetLookImg')
            }
        }, { immediate: true })

        onUnmounted(()=>Move())

        // 设置于img父 div，设置占位图 height 
        function test(size) {
            let height_point = 599.8 / size.width
            let height = ((size.height * height_point) / 19.2)
            return height + 'vw'
        }


        let location_all = ref(0) // 放大图显示总页数
        let location = ref(0) // 放大图 显示当前页数

        let magnifier = ref(null) // 整个放大图 ref       
        let magnifier_body = ref(null) // 放大图中图片 ref    
        let magnifierTimer = 0  //放大图动画 interval
        // 显示放大图
        function showMagnifier(e) {
            stopMove()
            // 图片间空白也能触发点击,判断是否点击空白
            if (e.target.src == undefined) { return false }
            location_all.value = 0
            let i = null
            for (i in images.value) {
                location_all.value += images.value[`${i}`].length
            }

            // 获取下标 0开始
            let img_index = e.target.getAttribute('data-index');
            // 获取是 one  two  three 其中一个
            let img_index_name = e.target.parentNode.parentNode.getAttribute('class');

            location.value = setLocation(Number(img_index), img_index_name)

            //#region 

            // 判断是否在图片仍在加载中就点击,是赋予 data-src
            if (e.target.src != 'http://localhost:8081/img/dog.d05e16c4.gif') {
                magnifier_body.value.src = e.target.src
            }
            else {
                magnifier_body.value.src = e.target.getAttribute('data-src')
            }

            // 定时器判断图片请求加载是否完成,加载完成隐藏loading
            Img_load()

            // 出现时动画效果
            magnifier_body.value.parentNode.parentNode.style.opacity = 0
            magnifier_body.value.parentNode.parentNode.style.display = 'block'

            let opacity = 0
            magnifierTimer = setInterval(() => {
                opacity += 0.1
                magnifier_body.value.parentNode.parentNode.style.opacity = opacity
                if (opacity >= 1) {
                    clearInterval(magnifierTimer)
                    magnifierTimer = null
                }
            }, 12)
            //#endregion
        }
        // 设置 magnifire 图片坐标
        function setLocation(index, index_name) {
            let init_index = 0
            if (index_name == 'one') {
                init_index = 1
            }
            else if (index_name == 'two') {
                init_index = images.value[`left`].length + 1
            }
            else {
                init_index = images.value[`left`].length + images.value[`middle`].length + 1
            }
            return init_index + index
        }

        // left right切换图片,close关闭 触发函数 
        function ClickTool(e, tool) {
            // 基于自定义,判断用户点击是谁
            let toolName = ''
            if (tool == undefined) {
                toolName = e.target.parentNode.getAttribute('data-tool')
            }
            else {
                toolName = tool
            }


            if (toolName == 'close') {
                let opacity = 1
                magnifierTimer = setInterval(() => {
                    Move()
                    opacity -= 0.1
                    magnifier_body.value.parentNode.parentNode.style.opacity = opacity
                    if (opacity <= 0) {
                        clearInterval(magnifierTimer)
                        magnifierTimer = null
                        magnifier_body.value.parentNode.parentNode.style.display = 'none'
                        magnifier_body.value.src = ''
                    }
                }, 12)
            }
            else if (toolName == 'left') {
                let goIndex = 0
                let goIndexName = ''
                // 判断是否是第一张或最后一张
                let isSuccess = 1
                if (location.value < images.value[`left`].length) {
                    goIndex = location.value - 2
                    goIndexName = 'left'
                    if (goIndex < 0) {
                        isSuccess = 0
                        ElMessage({
                            showClose: true,
                            message: '已经是第一张了哦',
                            duration: 1600
                        })
                    }
                }
                else if (location.value <= images.value[`left`].length + images.value[`middle`].length) {
                    goIndex = location.value - 2 - images.value[`left`].length
                    goIndexName = 'middle'
                    if (goIndex < 0) {
                        goIndex = location.value - 2
                        goIndexName = 'left'
                    }
                }
                else {
                    goIndex = location.value - 2 - images.value[`left`].length - images.value[`middle`].length
                    goIndexName = 'right'
                    if (goIndex < 0) {
                        goIndex = images.value[`middle`].length - 1
                        goIndexName = 'middle'
                    }
                }

                if (isSuccess == 1) {
                    location.value -= 1
                    magnifier_body.value.style.display = 'none'
                    magnifier_body.value.src = '/api/lookImg/Image?path=' + images.value[`${goIndexName}`][goIndex].img
                    Img_load()
                }
            }
            else {
                let goIndex = 0
                let goIndexName = ''
                // 判断是否是第一张或最后一张
                let isSuccess = 1

                if (location.value <= images.value[`left`].length) {
                    goIndex = location.value
                    goIndexName = 'left'
                    if (goIndex == images.value[`left`].length) {
                        goIndex = 0
                        goIndexName = 'middle'
                    }
                }
                else if (location.value <= images.value[`left`].length + images.value[`middle`].length) {
                    goIndex = location.value - images.value[`left`].length
                    goIndexName = 'middle'
                    if (goIndex == images.value[`middle`].length) {
                        goIndex = 0
                        goIndexName = 'right'
                    }
                } else {
                    goIndex = location.value - images.value[`left`].length - images.value[`middle`].length
                    goIndexName = 'right'
                    if (goIndex == images.value[`right`].length) {
                        isSuccess = 0
                        ElMessage({
                            showClose: true,
                            message: '已经是最后一张了哦',
                            duration: 1600
                        })
                    }
                }

                if (isSuccess == 1) {
                    location.value += 1
                    magnifier_body.value.style.display = 'none'
                    magnifier_body.value.src = '/api/lookImg/Image?path=' + images.value[`${goIndexName}`][goIndex].img
                    Img_load()
                }
            }
        }

        // 工具栏触发函数
        function ClickToolBar(e) {
            let tool = e.target.parentNode.getAttribute('data-tool')
            if (tool == 'left' || tool == 'right') {
                ClickTool(undefined, tool)
            }
            else if (tool == 'zoomIn' || tool == 'zoomOut') {
                let scale = getScaleRotate()
                zoom(scale, tool)
            }
            else if (tool == 'rotateRight' || tool == 'rotateLeft') {
                let rotate_ = getScaleRotate()
                rotate(rotate_, tool)
            } else {
                magnifier_body.value.style.transform = `scale(1,1) rotate(0deg)`
            }

        }

        // 返回 magnifier 图片的 scale rotate
        function getScaleRotate() {
            if(isImg) return
            if (document.defaultView.getComputedStyle(magnifier_body.value, null).transform) {
                let values = (document.defaultView.getComputedStyle(magnifier_body.value, null).transform).split('(')[1].split(')')[0].split(',');
                let a = values[0];
                let b = values[1];
                let scale = Math.sqrt(a * a + b * b);
                let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                return [scale, angle]
            }

        }
        // 用于旋转角度
        function rotate(rotate, tool) {
            if(isImg) return
            let rotate_go = 0
            if (tool == 'rotateRight') {
                rotate_go = rotate[1] + 90
            }
            else {
                rotate_go = rotate[1] - 90
            }
            magnifier_body.value.style.transform = `scale(${rotate[0]},${rotate[0]}) rotate(${rotate_go}deg)`
        }

        // 用于放大缩小
        let Elmsg = null
        function zoom(scale, InOut) {
            if(isImg) return 
            let scale_zoom = 0
            if (Elmsg) {
                Elmsg.close()
            }
            if (InOut == 'zoomIn') {
                scale_zoom = new BigNumber(scale[0]).plus(0.1)
            } else {
                scale_zoom = new BigNumber(scale[0]).minus(0.1)
            }
            if (scale_zoom > 2) {
                magnifier_body.value.style.transform = `scale(2,2) rotate(${scale[1]}deg)`
                Elmsg = ElMessage({
                    message: '200%',
                    duration: 600
                })
                return false
            } else if (scale_zoom < 0.1) {
                magnifier_body.value.style.transform = `scale(0.1,0.1) rotate(${scale[1]}deg)`
                Elmsg = ElMessage({
                    message: '10%',
                    duration: 600
                })
                return false
            }
            Elmsg = ElNotification({
                message: `${Math.floor(scale_zoom * 100)}%`,
                showClose: false,
                position: 'top-left',
                duration: 700,
                customClass: 'notify-success'
            })
            magnifier_body.value.style.transform = `scale(${scale_zoom},${scale_zoom}) rotate(${scale[1]}deg)`
        }
        // load加载中
        let isImg = 0
        let load_body = ref(null)
        function Img_load() {
            clearInterval(isImg)
            load_body.value.style.display = 'block'
            isImg = setInterval(() => {
                if (magnifier_body.value.complete) {
                    load_body.value.style.display = 'none'
                    magnifier_body.value.style.display = 'block'
                    clearInterval(isImg)
                    isImg = null
                }
            }, 100)
        }


        return {
            images,
            test,
            AddleftRef,
            AddmiddleRef,
            AddrightRef,
            showMagnifier,
            magnifier_body,
            ClickTool,
            magnifier,
            load_body,
            location_all,
            location,
            ClickToolBar
        }
    },
    components: {
        goTop
    }

}
</script>

<style lang="less" scoped>
.lookImgBody {
    display: flex;
    margin-top: .2vw;
    padding: 1.2vw;
    height: auto;

    .one,
    .two,
    .three {
        box-sizing: border-box;
        padding: .58vw;

        div {
            margin: 1vw 0;
            border-radius: 25px;
            animation: TestStart .6s;
            overflow: hidden;
            transition: all .2s;
        }

        div:hover {
            transform: scale(1.03, 1.03);
            border-radius: 0;
        }
    }

    img {
        width: 100%;
        height: 100%;
        background-size: cover;
    }

    .one {
        flex: 1;
    }

    .two {
        flex: 1;
    }

    .three {
        flex: 1;
    }
}

.magnifier {
    display: none;
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(100, 100, 100, .85);
    z-index: 99;

    .body {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        margin-top: 4.5vw;
        width: 78%;
        height: 77%;
    }

    img {

        max-width: 100%;
        max-height: 100%;
        transform: scale(1, 1) rotate(0deg);
    }

    .load {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        opacity: .8;
        max-width: 15%;
        max-height: 15%;
    }

    .left,
    .right,
    .close {
        background-color: rgba(225, 225, 225, .78);
        width: 2.5vw;
        height: 2.5vw;
        border-radius: 50%;
        overflow: hidden;
        z-index: 99;

        .el-icon {
            padding: 1.3vw;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 1vw;
        }
    }

    .left {

        position: absolute;
        left: 6%;
        top: 50%;
    }

    .right {
        position: absolute;
        right: 6%;
        top: 50%;
    }

    .close {
        position: absolute;
        right: 4.5%;
        top: 5%;

        .el-icon {
            transform: translate(-50%, -50%);
            font-size: 1.5vw;
            font-weight: 550;
        }
    }

    .tool {
        position: absolute;
        left: 50%;
        bottom: 6%;
        transform: translateX(-50%);
        z-index: 99;
        background-color: rgba(225, 225, 225, .78);
        border-radius: 20px;
        padding: 0 .85vw;

        .el-icon {
            font-size: 1.4vw;
            color: rgba(0, 0, 0, .85);
            padding: .4vw .6vw;
        }
    }

    .location {
        position: absolute;
        left: 50%;
        top: 1.5vw;
        transform: translateX(-50%);
        background-color: rgba(225, 225, 225, .78);
        padding: .2vw .6vw;
        border-radius: 25px;
        font-size: 1vw;
    }
}

@keyframes TestStart {
    from {
        opacity: .5;
        transform: translateY(10vw)
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}
</style>