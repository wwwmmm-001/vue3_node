import { createWebHistory, createRouter } from "vue-router";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: () => import('@/pages/Login'),
            meta: { HeadNoShow: true, title: '登录' },
        },
        {
            path: '/home',
            component: () => import('@/pages/home'),
            meta: { title: '主页' },
        },
        {
            path: '/lookimg',
            component: () => import('@/pages/LookImg'),
            meta: { title: '图片' },
        },
        {
            path: '/look',
            component: () => import('@/pages/Look'),
            meta: { title: '放映' },
        },
        {
            path: '/editor',
            component: () => import('@/pages/Editor'),
            meta: { title: '发布' },
        },
        {
            path: '/article',
            name: 'article',
            component: () => import('@/pages/Article'),
        },
        {
            path: '/about',
            component: () => import('@/pages/About'),
            meta: { title: '关于' },
        },
        {
            path: '/leavemsg',
            component: () => import('@/pages/LeaveMsg'),
            meta: { title: '留言' },
        },
        {
            path: '/collect',
            component: () => import('@/pages/collect'),
            meta: { title: '收藏' },
        },
        {
            path:'/music',
            component: ()=>import('@/pages/Music'),
            meta: { title: '音乐' },
        },
        {
            path: '/',
            redirect: '/home'
        }
    ]
})
router.beforeEach((to, from, next) => {
    if (to.meta.title) document.title = to.meta.title
    NProgress.start()
    next();

});
router.afterEach(()=>{
    // window.scrollTo(0,0)
    NProgress.done()
})
export default router;