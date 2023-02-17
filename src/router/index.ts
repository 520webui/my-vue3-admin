import {  RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"
// @ts-ignore
const constantRoutes: RouteRecordRaw[] = [
    // 菜单
    {
        path: '/',
        name: 'home',
        component: () => import("@/views/demoLibrary/home.vue"),
        redirect: "/myVue",
        children: [
            {
                path: '/myVue',
                name: 'myVue',
                component: () => import('@/views/demoLibrary/myVue/index.vue'),
                meta: {
                    title: 'myVue',
                    langTitle: 'myVue'
                }
            },
            {
                path: '/canvas',
                name: 'canvas',
                component: () => import('@/views/demoLibrary/canvas/index.vue'),
                meta: {
                    title: 'canvas',
                    langTitle: 'canvas'
                }
            },
            {
                path: '/threeJs',
                name: 'threeJs',
                component: () => import('@/views/demoLibrary/threeJs/index.vue'),
                meta: {
                    title: 'threeJs',
                    langTitle: 'threeJs'
                }
            },
            {
                path: '/transform',
                name: 'transform',
                component: () => import('@/views/demoLibrary/transform/index.vue'),
                meta: {
                    title: 'transform',
                    langTitle: 'transform'
                }
            },
            {
                path: '/personSearch',
                name: 'personSearch',
                component: () => import('@/views/demoLibrary/personSearch/index.vue'),
                meta: {
                    title: 'personSearch',
                    langTitle: 'personSearch'
                }
            },
            {
                path: '/dynamicsJs',
                name: 'dynamicsJs',
                component: () => import('@/views/demoLibrary/dynamicsJs/index.vue'),
                meta: {
                    title: 'dynamicsJs',
                    langTitle: 'dynamicsJs'
                }
            },
            {
                path: '/greenSock',
                name: 'greenSock',
                component: () => import('@/views/demoLibrary/greenSock/index.vue'),
                meta: {
                    title: 'greenSock',
                    langTitle: 'greenSock'
                }
            },
            {
                path: '/Es6',
                name: 'Es6',
                component: () => import('@/views/demoLibrary/Es6/index.vue'),
                meta: {
                    title: 'Es6',
                    langTitle: 'Es6'
                }
            },
            {
                path: '/javaScript',
                name: 'javaScript',
                component: () => import('@/views/demoLibrary/javaScript/index.vue'),
                meta: {
                    title: 'javaScript',
                    langTitle: 'javaScript'
                }
            },
            {
                path: '/echarts',
                name: 'echarts',
                component: () => import('@/views/demoLibrary/echarts/index.vue'),
                meta: {
                    title: 'echarts',
                    langTitle: 'echarts'
                }
            },
            {
                path: '/contenteditable',
                name: 'contenteditable',
                component: () => import('@/views/demoLibrary/contenteditable/index.vue'),
                meta: {
                    title: 'contenteditable',
                    langTitle: 'contenteditable'
                }
            },
            {
                path: '/markdown',
                name: 'markdown',
                component: () => import('@/views/demoLibrary/markdown/index.vue'),
                meta: {
                    title: 'markdown',
                    langTitle: 'markdown'
                }
            },
            {
                path: '/contenteditable',
                name: 'contenteditable',
                component: () => import('@/views/demoLibrary/contenteditable/index.vue'),
                meta: {
                    title: 'contenteditable',
                    langTitle: 'contenteditable'
                }
            },
            {
                path: '/vue3',
                name: 'vue3',
                component: () => import('@/views/demoLibrary/vue3/index.vue'),
                meta: {
                    title: 'vue3',
                    langTitle: 'vue3'
                }
            },
            {
                path: '/electronjs',
                name: 'electronjs',
                component: () => import('@/views/demoLibrary/electronjs/index.vue'),
                meta: {
                    title: 'electronjs',
                    langTitle: 'electronjs'
                }
            },
        ]
    },
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import("@/views/index/index.vue"),
        meta: {
            hidden: true
        }
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes:constantRoutes,
});
export default router;
