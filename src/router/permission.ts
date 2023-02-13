// 登录权限
import router from "@/router/index";

router.beforeEach((to, from, next) => {
    if (to.path!=='/login') {
        if (!localStorage.getItem('loginToken')) {
            next({path:'/login'})
        }else {
            next()
        }
    } else {
        next()
    }
})
