import {  RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"
// @ts-ignore
const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import("@/views/demoLibrary/home.vue"),
        redirect: "/myVue",
        children: [
            {
                path: '/myVue',
                name: 'myVue',
                component: () => import('@/views/demoLibrary/myVue/myVue.vue'),
                meta: {
                    title: 'myVue',
                    langTitle: 'myVue'
                }
            },
            {
                path: '/canvas',
                name: 'canvas',
                component: () => import('@/views/demoLibrary/canvas/canvas.vue'),
                meta: {
                    title: 'canvas',
                    langTitle: 'canvas'
                }
            },
            {
                path: '/threeJs',
                name: 'threeJs',
                component: () => import('@/views/demoLibrary/threeJs/threeJs.vue'),
                meta: {
                    title: 'threeJs',
                    langTitle: 'threeJs'
                }
            },
        ]
    },
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
