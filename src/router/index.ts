import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// @ts-ignore
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import("@/views/home.vue"),
        redirect: "/myVue",
        children: [
            {
                path: '/myVue',
                name: 'myVue',
                component: () => import('@/views/myVue/myVue.vue'),
                meta: {
                    title: 'myVue',
                    langTitle: 'myVue'
                }
            },
            {
                path: '/canvas',
                name: 'canvas',
                component: () => import('@/views/canvas/canvas.vue'),
                meta: {
                    title: 'canvas',
                    langTitle: 'canvas'
                }
            },
            {
                path: '/threeJs',
                name: 'threeJs',
                component: () => import('@/views/threeJs/threeJs.vue'),
                meta: {
                    title: 'threeJs',
                    langTitle: 'threeJs'
                }
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
