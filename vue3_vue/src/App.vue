<template>
  <div class="AppHome">
    <div ref='header' class="header">
      <Header v-show="!showHead" class="head" />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from '@/components/header.vue'
import { computed, onMounted, onUnmounted, ref, provide } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  name: 'App',
  components: {
    Header,
  },
  setup() {
    const store= useStore()
    let header = ref(null)

    // 当前屏幕距离顶部距离
    let pageY = ref(0)
    // 节流
    let Navigation = 0

    // 修改pageY 供home lookImg使用
    function getNavigation() {
      if (Navigation) { }
      else {
        Navigation = setTimeout(() => {
          pageY.value = window.pageYOffset;
          Navigation = null
        }, 100)
      }


    }
    provide('pageY', pageY)

    // 监听鼠标位置显示header
    let timer_header = 0
    let in_header = 0
    let out_header = 0
    function showHeader(e) {
      if (timer_header) return
      timer_header = setTimeout(() => {
        if (e.clientX < (header.value.children[0].clientWidth) / 8) {
          if (in_header == 0) {
            in_header = 1
            out_header = 0
            header.value.children[0].style.transform = 'translateX(0)';
          }

        } else if (e.clientX > header.value.children[0].clientWidth * 1.4) {
          if (out_header == 0) {
            out_header = 1
            in_header = 0
            header.value.children[0].style.transform = 'translateX(-105%)'
          }

        }
        timer_header = 0
      }, 38)

    }
    provide('showHeader', showHeader)

    function homeShowHeader(num) {
      header.value.children[0].style.transform = `translateX(${num})`;
    }
    provide('homeShowHeader', homeShowHeader)

    onMounted(() => {
      window.addEventListener('scroll', getNavigation)
      window.addEventListener('mousemove', showHeader)
      // 获取天气
      store.dispatch('basicMsg/GetWeather', 101271101)
      // 获取热搜
      store.dispatch('basicMsg/GetWeibo')
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', getNavigation)
    })

    const router = useRouter()
    let showHead = computed(() =>
      router.currentRoute.value.meta.HeadNoShow
    )
    return { showHead, header }
  }

}
</script>

<style>
* {
  margin: 0px;
  pad: 0px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: none;
}

.copy:hover * {
  -moz-user-select: text;
  -webkit-user-select: text;
  -ms-user-select: text;
  user-select: text;

}

#nprogress .bar {
  background: rgba(114, 215, 255, 0.9) !important;
}

ul {
  list-style: none;
}

li {
  list-style-type: none;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  cursor: pointer;
}

.notify-success {
  width: 6vw !important;
  outline: none;
  border: none;
  background-color: rgba(255, 255, 255, .8) !important;
}


.head {
  z-index: 999;
}

.el-slider__button {
  border: 0 !important;
  background-color: rgb(41, 39, 39, .9);

}

.el-notification {
  --el-notification-width: 10vw !important;
}
</style>
