<template>
    <div>
        <div class="recommend">

            <div v-if="head" v-for="(data,index) in head" :key="data.id" :class="`describe init${index}`"
                :ref="AddDetails">
                <b class="time">{{data.play_time}}<p>&nbsp;{{data.name[2]}}</p></b>
                <b class="title">{{data.name[0]}}<br>
                    <p>&nbsp;&nbsp;({{data.name[1]}})</p>
                </b>
                <span class="detail">
                    <p>
                        {{data.detail}}
                    </p>
                </span>
                <a :href="data.see" target="_blank" class="Gosee">Go See</a>
            </div>
            <div class="img">
                <div class="swiper-container" ref="swiper_container">
                    <div class="swiper-wrapper swiper-no-swiping" v-if="head" ref="ChildLen">
                        <div class="swiper-slide"><img :src="`/api/Look/headImg?path=${head[0].path}`"
                                alt=""></div>
                        <div class="swiper-slide"><img :src="`/api/Look/headImg?path=${head[1].path}`"
                                alt=""></div>
                        <div class="swiper-slide"><img :src="`/api/Look/headImg?path=${head[2].path}`"
                                alt=""></div>
                    </div>
                    <div class="swiper-button-next" ref="FlaseNext" style="display: none;"></div>
                </div>
                <button class="next" @click="TrueNext">NEXT<el-icon>
                        <Right />
                    </el-icon>
                </button>
            </div>
        </div>
        <anime :show='`Anime`' />
        <anime :show='`映画`' />
        <anime :show='`Video`' />    
        <goTop/>    
    </div>
</template>

<script>
import 'swiper/css/swiper.min.css'
import Swiper from 'swiper'

import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import anime from '@/components/anime.vue'
import goTop from '@/components/goTop.vue'
export default {
    name: 'MyLook',
    setup() {
        //#region
        const store = useStore()
        var swiper = {}
        // head信息
        let head = computed(() => {
            if (store.state.look.head[0]) {
                return store.state.look.head
            }

        })

        let swiper_container = ref(null)
        let FlaseNext = ref(null)
        let swiper_opacity = ref(null)
        let ChildLen = ref(null)
        let len = 0
        let img_index = ref(-1)

        // 完成head部分 new swiper,及获取到轮播图下标
        onMounted(async () => {
            await store.dispatch('look/GetLookHead')
            len = ChildLen.value.children.length - 1;
            createSwiper()
        })

        // onMounted时 用于创建head轮播图
        function createSwiper() {
            swiper = new Swiper(swiper_container.value, {
                effect: 'fade',
                fadeEffect: {
                    crossFade: true,
                },
                slidesPerView: 1,
                spaceBetween: 30,
                speed: 1400,
                loop: true,
                autoplay: true,
                autoplay: {
                    delay: 8000,
                    disableOnInteraction: false
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                },
                observer: true,
                on: {
                    slideChangeTransitionStart: function () {
                        img_index.value += 1
                        if (img_index.value > len) {
                            img_index.value = 0
                        }
                    },
                    slideChangeTransitionEnd: function () {
                    },
                },
            });
            nextTick(() => {
                swiper.updateSlides();
                swiper.update();
            })
        }

        // 收集head介绍文字信息的元素
        let details = ref([])
        const AddDetails = (el) => {
            details.value.push(el)
        }
        // 监听轮播图下标,展现不同文字
        watch(img_index, (newV, old) => {
            if (!details.value[newV] || old == -1) { return false }
            details.value[old].classList.remove("go");
            details.value[old].classList.add("back");
            setTimeout(() => {
                details.value[newV].style.display = 'block'
                details.value[newV].classList.remove("back");
                details.value[newV].classList.add("go");
                details.value[old].style.display = 'none'
            }, 400)
        })
        // NEXT
        function TrueNext() {
            FlaseNext.value.click()
        }
        //#endregion

        return {
            swiper_container,
            FlaseNext,
            TrueNext,
            swiper_opacity,
            ChildLen,
            head,
            AddDetails,
        }
    },
    components: {
        anime,
        goTop
    }
}
</script>

<style scoped lang="less" >
.recommend {
    display: flex;
    margin: 0 auto;
    padding: 0 1.5vw;
    padding-top: 1.2vw;
    overflow: hidden;
    background-color: rgb(238, 225, 225);
    border-radius: 0 0 20px 20px;
    height: 82vh;

    .describe {
        flex: 1;
        position: relative;
        display: none;
        background-color: rgb(240, 229, 229);

        .time {
            position: absolute;
            left: 10%;
            top: 12%;
            font-size: 1.35vw;

            p {
                display: inline;
                font-size: .7vw;
                color: gray;
            }
        }

        .title {
            position: absolute;
            left: 10%;
            top: 23%;
            font-size: 2.2vw;

            p {
                font-size: 1.8vw;
            }
        }

        .detail {
            overflow: hidden;
            position: absolute;
            width: 80%;
            height: 27vh;
            left: 10%;
            top: 44%;
            font-size: .8vw;
            line-height: 1.6vw;

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

        .Gosee {
            position: absolute;
            left: 10%;
            bottom: 12%;
            background-color: rgb(226, 129, 129);
            color: white;
            font-size: 1.25vw;
            padding: .45vw 1.15vw;
            border-radius: 10px;
            text-decoration: none;
        }
    }

    .init0 {
        display: block;
    }

    .img {
        flex: 1.45;
        position: relative;
        border-radius: 25px 0 0 0;
        background-color: black;
        overflow: hidden;

        img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 100%;
            max-height: 100%;
        }

        .swiper-container {
            width: 100%;
            height: 100%;
        }

        .next {
            position: absolute;
            bottom: 0;
            color: rgb(223, 108, 108);
            font-size: 1.1vw;
            font-weight: 600;
            right: 0;
            padding: .85vw 1.9vw;
            outline: none;
            border: none;
            border-radius: 10px 0 0 0;
            z-index: 99;

            .el-icon {
                padding-left: .2vw;
                vertical-align: top;
            }
        }
    }

    .go {
        animation: go 1s;

    }

    .back {
        animation: back 0.5s;

    }

    @keyframes go {
        0% {
            transform: scale(.9, .9);
            opacity: 0.1;
        }

        100% {
            transform: scale(1, 1);
            opacity: 1;
        }
    }

    @keyframes back {
        0% {
            opacity: 0.8;
            transform: translateX(0);
        }

        100% {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
}

</style>