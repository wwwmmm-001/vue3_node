<template>
    <button class="goTop" ref="goTop" @click="backTop">
        {{top_all}}%
    </button>
</template>

<script>
import { ref,watch,computed,inject } from 'vue'
import goUp_Down from '@/assets/js/goUp_Down'
export default {
    name: "MyTop",
    setup() {
        let goTop = ref(null)
        const backTop = () => goUp_Down(0)

        let top_all = computed(() => {
            let point = ((pageY.value) / (document.body.clientHeight - window.innerHeight)) * 100
            return Math.ceil(point)
        })

        let pageY = inject('pageY')
        let Timertimeout = 0
        watch(pageY, (newValue) => {
            let vw = window.innerWidth / 100
            if (Timertimeout) { return false }
            else {
                Timertimeout = setTimeout(() => {
                    if (newValue - window.innerHeight > vw*1 ) {
                        goTop.value.style.display = 'block'
                    }
                    // 用户向下移动触发动画2
                    else if (newValue - window.innerHeight < -3 * vw) {
                        goTop.value.style.display = 'none'
                    }
                    Timertimeout = null
                }, 120)
            }
        })


        return {
            goTop,
            backTop,
            top_all
        }
    }
}
</script>

<style lang="less" scoped>
.goTop {
    position: fixed;
    display: none;
    border: none;

    font-size: .8vw;
    text-align: center;
    color: white;
    right: 2.5vw;
    bottom: 3vw;
    width: 2.6vw;
    height: 2.6vw;
    padding: .34vw;
    border-radius: 8px;
    background-color: rgba(19, 121, 168, 0.9);
}
</style>