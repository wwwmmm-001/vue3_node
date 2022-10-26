import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import store from '@/store/index'
import VueLazyload from 'vue-lazyload'
// 此处为引入 element-plus全部icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { quillEditor } from 'vue3-quill'
const app=createApp(App)

// 此处为引入 element-plus全部icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(store)
app.use(VueLazyload,{
    perload:1,
    erroe:require('@/assets/loading.png'),
    loading:require('@/assets/loading.png'),
    attempt:1,
})
app.use(quillEditor)
app.mount('#app')

